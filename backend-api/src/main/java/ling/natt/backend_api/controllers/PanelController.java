package ling.natt.backend_api.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ling.natt.backend_api.models.Panel;
import ling.natt.backend_api.models.Project;
import ling.natt.backend_api.repositories.PanelRepository;
import ling.natt.backend_api.repositories.ProjectRepository;
import ling.natt.exception.ResourceNotFoundException;

@RestController
@RequestMapping("/api/panel")
public class PanelController {
    @Autowired
    private PanelRepository panelRepository;
    @Autowired
    private ProjectRepository projectRepository;

    // Obtener todos los Panels
    @GetMapping
    public List<Panel> getAllPanels() {
        return panelRepository.findAll();
    }

    // Obtener Panel por ID
    @GetMapping("/{id}")
    public Panel getPanelById(@PathVariable Long id) {
        return panelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Panel not found"));
    }

    // Obtener Panels por Project ID
    @GetMapping("/project/{projectId}")
    public List<Panel> getPanelsByProjectId(@PathVariable Long projectId) {
        // Verificar si el proyecto existe
        if (!projectRepository.existsById(projectId)) {
            throw new RuntimeException("Project not found with id " + projectId);
        }
        return panelRepository.findByProjectId(projectId);
    }

    // Crear Panel
    @PostMapping
    public Panel createPanel(@RequestBody Panel panel) {
        return panelRepository.save(panel);
    }

    // Crear un panel asociado a un proyecto
    @PostMapping("/project/{projectId}")
    public Panel createPanelForProject(@PathVariable Long projectId, @RequestBody Panel panel) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id " + projectId));
        panel.setProject(project);
        return panelRepository.save(panel);
    }

    // Update panel
    @PutMapping("/{id}")
    public Panel updatePanel(@PathVariable Long id, @RequestBody Panel panelDetails) {
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
                .orElseThrow(() -> new RuntimeException("Panel not found with id " + id));
    }

    // Delete Method
    @DeleteMapping("/{id}")
    public void deletePanel(@PathVariable Long id) {
        if (!panelRepository.existsById(id)) {
            throw new ResourceNotFoundException("Panel not found with id " + id);
        }
        panelRepository.deleteById(id);
    }

}
