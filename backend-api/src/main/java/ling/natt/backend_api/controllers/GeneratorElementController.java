package ling.natt.backend_api.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ling.natt.backend_api.models.GeneratorElement;
import ling.natt.backend_api.models.Project;
import ling.natt.backend_api.models.ProjectNode;
import ling.natt.backend_api.repositories.GeneratorElementRepository;
import ling.natt.backend_api.repositories.ProjectRepository;
import ling.natt.backend_api.repositories.ProjectNodeRepository;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/generator-elements")
public class GeneratorElementController {
    @Autowired
    private GeneratorElementRepository generatorElementRepository;
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private ProjectNodeRepository projectNodeRepository;

    // Obtener todos los Panels
    @GetMapping
    public List<GeneratorElement> getAllGeneratorElements() {
        return generatorElementRepository.findAll();
    }

    // Obtener Panel por ID
    @GetMapping("/{id}")
    public GeneratorElement getGeneratorElementById(@PathVariable Long id) {
        return generatorElementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("GeneratorElement not found"));
    }

    // Obtener Panels por Project ID
    @GetMapping("/project/{projectId}")
    public List<GeneratorElement> getGeneratorElementsByProject(@PathVariable Long projectId) {

        List<ProjectNode> nodes = projectNodeRepository.findByProjectId(projectId);

        return nodes.stream()
            .map(ProjectNode::getElement)
                .filter(e -> e instanceof GeneratorElement)
                .map(e -> (GeneratorElement) e)
                .toList();
    }

    // Crear GeneratorElement
    @PostMapping
    public GeneratorElement createGeneratorElement(@RequestBody GeneratorElement generatorElement) {
        return generatorElementRepository.save(generatorElement);
    }

    // Crear GeneratorElement y asociarlo a un proyecto
    @PostMapping("/project/{projectId}")
    public GeneratorElement createGeneratorElementInProject(@PathVariable Long projectId, @RequestBody GeneratorElement generatorElement) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        GeneratorElement saved = generatorElementRepository.save(generatorElement);

        ProjectNode node = new ProjectNode(project, saved);
        projectNodeRepository.save(node);

        return saved;
    }

    // Update GeneratorElement
    @PutMapping("/{id}")
    public GeneratorElement updateGeneratorElement(@PathVariable Long id, @RequestBody GeneratorElement generatorElementDetails) {
        return generatorElementRepository.findById(id)
                .map(generatorElement -> {
                    generatorElement.setName(generatorElementDetails.getName());
                    generatorElement.setBrand(generatorElementDetails.getBrand());
                    generatorElement.setEfficiency(generatorElementDetails.getEfficiency());
                    generatorElement.setPowerWatt(generatorElementDetails.getPowerWatt());
                    return generatorElementRepository.save(generatorElement);
                })
                .orElseThrow(() -> new RuntimeException("GeneratorElement not found with id " + id));
    }

    // Delete Method
    @DeleteMapping("/{id}")
    public void deleteGeneratorElement(@PathVariable Long id) {
        if (!generatorElementRepository.existsById(id)) {
            throw new RuntimeException("GeneratorElement not found with id " + id);
        }
        generatorElementRepository.deleteById(id);
    }

}
