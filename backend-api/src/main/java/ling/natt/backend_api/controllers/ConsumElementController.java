package ling.natt.backend_api.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ling.natt.backend_api.models.ConsumElement;
import ling.natt.backend_api.models.Project;
import ling.natt.backend_api.repositories.ConsumElementRepository;
import ling.natt.backend_api.repositories.ProjectRepository;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController // indica que es un controlador de Spring
@RequestMapping("/api/consum-elements") // ruta base para las solicitudes HTTP
@CrossOrigin("*") // permite solicitudes desde cualquier origen
public class ConsumElementController {

    @Autowired
    private ConsumElementRepository consumElementRepository;
    @Autowired
    private ProjectRepository projectRepository; // Inyecta el repositorio de proyecto

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

    @GetMapping("/project/{projectId}")
    public List<ConsumElement> getConsumElementsByProjectId(@PathVariable Long projectId) {
        // Verificar si el proyecto existe
        if (!projectRepository.existsById(projectId)) {
            throw new RuntimeException("Project not found with id " + projectId);
        }
        return consumElementRepository.findByProjectId(projectId);
    }

    // Crear ConsumElement simple
    @PostMapping
    public ConsumElement createConsumElement(@RequestBody ConsumElement consumElement) {
        return consumElementRepository.save(consumElement);
    }

    // Crear un consum-element asociado a un proyecto
    @PostMapping("/projects/{projectId}")
    public ConsumElement createConsumElementWithProject(@PathVariable Long projectId,
            @RequestBody ConsumElement element) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id " + projectId));
        element.setProject(project);
        return consumElementRepository.save(element);
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
