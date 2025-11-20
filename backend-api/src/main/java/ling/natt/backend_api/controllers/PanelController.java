package ling.natt.backend_api.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ling.natt.backend_api.models.Panel;
//import ling.natt.backend_api.models.Project;
import ling.natt.backend_api.repositories.PanelRepository;
//import ling.natt.backend_api.repositories.ProjectRepository;

@RestController
@RequestMapping("/api/panels")
public class PanelController {
    @Autowired
    private PanelRepository panelRepository;
    // @Autowired
    // private ProjectRepository projectRepository; // inyectar el repositorio de
    // Project

    @GetMapping
    public List<Panel> getAllPanels() {
        return panelRepository.findAll();
    }

    @GetMapping("/{id}")
    public Panel getPanelById(@PathVariable int id) {
        return panelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Panel not found"));
    }

    @PostMapping
    public Panel createPanel(@RequestBody Panel panel) {
        return panelRepository.save(panel);
    }

    @PutMapping("/{id}")
    public Panel updatePanel(@PathVariable int id, @RequestBody Panel panelDetails) {
        return panelRepository.findById(id)
                .map(panel -> {
                    panel.setName(panelDetails.getName());
                    panel.setX(panelDetails.getX());
                    panel.setY(panelDetails.getY());
                    panel.setBrand(panelDetails.getBrand());
                    panel.setEfficiency(panelDetails.getEfficiency());
                    panel.setPowerWatt(panelDetails.getPowerWatt());
                    return panelRepository.save(panel);
                })
                .orElseThrow(() -> new RuntimeException("Panel not found"));
    }

    @DeleteMapping("/{id}")
    public void deletePanel(@PathVariable int id) {
        panelRepository.deleteById(id);
    }

    // Crear un Panel asociado a un Project

    // @PostMapping("/projects/{projectId}/panels")
    // public ResponseEntity<Panel> createPanel(
    // @PathVariable Long projectId,
    // @RequestBody Panel panel) {
    // // Aquí puedes agregar lógica para asociar el panel con el proyecto usando
    // // projectId
    // Project project = projectRepository.findById(projectId) // poner el metodo
    // que se le asigne al findById en
    // // repositorio proyecto
    // .orElseThrow(() -> new RuntimeException("Project not found"));
    // panel.setProject(project);
    // Panel saved = panelRepository.save(panel);

    // return ResponseEntity.ok(saved);
    // }

}
