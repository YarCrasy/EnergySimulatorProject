package ling.natt.backend_api.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ling.natt.backend_api.models.ConsumElement;
//import ling.natt.backend_api.models.Project;
import ling.natt.backend_api.repositories.ConsumElementRepository;
//import ling.natt.backend_api.repositories.ProjectRepository;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController // indica que es un controlador de Spring
@RequestMapping("/api/consum-elements") // ruta base para las solicitudes HTTP
public class ConsumElementController {

    @Autowired
    private ConsumElementRepository consumElementRepository;
    // @Autowired
    // private ProjectRepository projectRepository; // inyectar el repositorio de
    // Project

    // Aquí irán los métodos para manejar las solicitudes HTTP (GET, POST, PUT,
    // DELETE)
    @GetMapping
    public List<ConsumElement> getAllConsumElements() {
        return consumElementRepository.findAll();
    }

    @GetMapping("/{id}")
    public ConsumElement getConsumElementById(@PathVariable Long id) {
        return consumElementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ConsumElement not found"));
    }

    @PostMapping
    public ConsumElement createConsumElement(@RequestBody ConsumElement consumElement) {
        return consumElementRepository.save(consumElement);
    }

    @PutMapping("/{id}")
    public ConsumElement updateConsumElement(@PathVariable Long id, @RequestBody ConsumElement details) {
        return consumElementRepository.findById(id)
                .map(consumElement -> {
                    consumElement.setName(details.getName());
                    consumElement.setX(details.getX());
                    consumElement.setY(details.getY());
                    consumElement.setPowerConsumption(details.getPowerConsumption());
                    return consumElementRepository.save(consumElement);
                })
                .orElseThrow(() -> new RuntimeException("ConsumElement not found"));
    }

    @DeleteMapping("/{id}")
    public void deleteConsumElement(@PathVariable Long id) {
        consumElementRepository.deleteById(id);
    }
    // Crear un ConsumElement asociado a un Project

    // @PostMapping("/projects/{projectId}/consum-elements")
    // public ResponseEntity<ConsumElement> createConsumElement(
    // @PathVariable Long projectId,
    // @RequestBody ConsumElement consumElement) {

    // Project project = projectRepository.findById(projectId) // pendiente de que
    // se haga el metodo en repositorio
    // .orElseThrow(() -> new RuntimeException("Project not found"));

    // consumElement.setProject(project);
    // ConsumElement saved = consumElementRepository.save(consumElement);

    // return ResponseEntity.ok(saved);
    // }

}
