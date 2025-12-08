package ling.natt.backend_api.controllers;

import ling.natt.backend_api.models.ConsumerElement;
import ling.natt.backend_api.models.Project;
import ling.natt.backend_api.models.ProjectNode;
import ling.natt.backend_api.repositories.ConsumerElementRepository;
import ling.natt.backend_api.repositories.ProjectNodeRepository;
import ling.natt.backend_api.repositories.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/consumer-element")
public class ConsumerElementController {

    @Autowired
    private ConsumerElementRepository consumerElementRepository;
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private ProjectNodeRepository projectNodeRepository;

    @GetMapping
    public List<ConsumerElement> getAllConsumerElements() {
        return consumerElementRepository.findAll();
    }

    @GetMapping("/{id}")
    public ConsumerElement getConsumerElementById(@PathVariable Long id) {
        return consumerElementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ConsumerElement not found" + id));
    }

    @GetMapping("/project/{projectId}")
    public List<ConsumerElement> getConsumerElementsByProject(@PathVariable Long projectId) {

        List<ProjectNode> nodes = projectNodeRepository.findByProjectId(projectId);

        return nodes.stream()
            .map(ProjectNode::getElement)
                .filter(e -> e instanceof ConsumerElement)
                .map(e -> (ConsumerElement) e)
                .toList();
    }

    @PostMapping
    public ConsumerElement createConsumerElement(@RequestBody ConsumerElement consumerElement) {
        return consumerElementRepository.save(consumerElement);
    }

    @PostMapping("/project/{projectId}")
    public ConsumerElement createConsumerElementInProject(
            @PathVariable Long projectId,
            @RequestBody ConsumerElement element) {

        Project p = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        ConsumerElement saved = consumerElementRepository.save(element);

        ProjectNode node = new ProjectNode(p, saved);
        projectNodeRepository.save(node);

        return saved;
    }

    @PutMapping("/{id}")
    public ConsumerElement updateConsumerElement(@PathVariable Long id, @RequestBody ConsumerElement details) {
        return consumerElementRepository.findById(id)
                .map(element -> {
                    element.setName(details.getName());
                    element.setPowerConsumption(details.getPowerConsumption());
                    return consumerElementRepository.save(element);
                })
                .orElseThrow(() -> new RuntimeException("ConsumerElement not found with id " + id));
    }

    @DeleteMapping("/{id}")
    public void deleteConsumerElement(@PathVariable Long id) {
        if (!consumerElementRepository.existsById(id)) {
            throw new RuntimeException("ConsumerElement not found with id " + id);
        }
        consumerElementRepository.deleteById(id);
    }
}