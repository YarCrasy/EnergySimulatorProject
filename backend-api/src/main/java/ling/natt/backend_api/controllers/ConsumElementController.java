package ling.natt.backend_api.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ling.natt.backend_api.models.ConsumElement;
import ling.natt.backend_api.models.Project;
import ling.natt.backend_api.models.ProjectElement;
import ling.natt.backend_api.repositories.ConsumElementRepository;
import ling.natt.backend_api.repositories.ProjectElementRepository;
import ling.natt.backend_api.repositories.ProjectRepository;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController // indica que es un controlador de Spring
@RequestMapping("/api/consum-element") // ruta base para las solicitudes HTTP
@CrossOrigin("*") // permite solicitudes desde cualquier origen
public class ConsumElementController {

    @Autowired
    private ConsumElementRepository consumElementRepository;

    @Autowired
    private ProjectRepository projectRepository; // Inyecta el repositorio de proyecto

    @Autowired
    private ProjectElementRepository projectElementRepository;

    // Obtener todos los ConsumElements
    @GetMapping
    public List<ConsumElement> getAllConsumElements() {
        return consumElementRepository.findAll();
    }

    // Obtener ConsumElement por ID
    @GetMapping("/{id}")
    public ConsumElement getConsumElementById(@PathVariable Long id) {
        return consumElementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ConsumElement not found" + id));
    }

    // Obtener consum elements dentro de un proyecto
    @GetMapping("/project/{projectId}")
    public List<ConsumElement> getConsumElementsByProject(@PathVariable Long projectId) {

        List<ProjectElement> entries = projectElementRepository.findByProjectId(projectId);

        return entries.stream()
                .map(ProjectElement::getElement)
                .filter(e -> e instanceof ConsumElement)
                .map(e -> (ConsumElement) e)
                .toList();
    }

    // Crear ConsumElement simple
    @PostMapping
    public ConsumElement createConsumElement(@RequestBody ConsumElement consumElement) {
        return consumElementRepository.save(consumElement);
    }

    // Crear un consum-element asociado a un proyecto
    @PostMapping("/project/{projectId}")
    public ConsumElement createConsumElementInProject(
            @PathVariable Long projectId,
            @RequestBody ConsumElement element) {

        Project p = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        ConsumElement saved = consumElementRepository.save(element);

        // creas la relación
        ProjectElement pe = new ProjectElement(p, saved, 1);
        projectElementRepository.save(pe);

        return saved;
    }

    // Actualizar ConsumElement
    @PutMapping("/{id}")
    public ConsumElement updateConsumElement(@PathVariable Long id, @RequestBody ConsumElement details) {
        return consumElementRepository.findById(id)
                .map(element -> {
                    element.setName(details.getName());
                    element.setX(details.getX());
                    element.setY(details.getY());
                    element.setPowerConsumption(details.getPowerConsumption());
                    return consumElementRepository.save(element);
                })
                .orElseThrow(() -> new RuntimeException("ConsumElement not found with id " + id));
    }

    // Eliminar ConsumElement
    @DeleteMapping("/{id}")
    public void deleteConsumElement(@PathVariable Long id) {
        if (!consumElementRepository.existsById(id)) {
            throw new RuntimeException("ConsumElement not found with id " + id);
        }
        consumElementRepository.deleteById(id);
    }

}
