package ling.natt.backend_api.controllers;

import ling.natt.backend_api.models.ConsumerElement;
import ling.natt.backend_api.models.Project;
import ling.natt.backend_api.models.ProjectElement;
import ling.natt.backend_api.repositories.ConsumerElementRepository;
import ling.natt.backend_api.repositories.ProjectElementRepository;
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
    private ProjectElementRepository projectElementRepository;

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

        List<ProjectElement> entries = projectElementRepository.findByProjectId(projectId);

        return entries.stream()
                .map(ProjectElement::getElement)
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

        ProjectElement pe = new ProjectElement(p, saved, 1);
        projectElementRepository.save(pe);

        return saved;
    }

    @PutMapping("/{id}")
    public ConsumerElement updateConsumerElement(@PathVariable Long id, @RequestBody ConsumerElement details) {
        return consumerElementRepository.findById(id)
                .map(element -> {
                    element.setName(details.getName());
                    element.setX(details.getX());
                    element.setY(details.getY());
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