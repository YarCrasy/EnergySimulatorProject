package ling.natt.backend_api.controllers;

import java.util.List;
import java.util.stream.Collectors;

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
import ling.natt.backend_api.models.ProjectElement;
import ling.natt.backend_api.repositories.PanelRepository;
import ling.natt.backend_api.repositories.ProjectRepository;
import ling.natt.backend_api.repositories.ProjectElementRepository;
import ling.natt.exception.ResourceNotFoundException;

@RestController
@RequestMapping("/api/panel")
public class PanelController {
    @Autowired
    private PanelRepository panelRepository;
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private ProjectElementRepository projectElementRepository;

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
    public List<Panel> getPanelsByProject(@PathVariable Long projectId) {

        List<ProjectElement> entries = projectElementRepository.findByProjectId(projectId);

        return entries.stream()
                .map(ProjectElement::getElement)
                .filter(e -> e instanceof Panel)
                .map(e -> (Panel) e)
                .toList();
    }

    // Crear Panel
    @PostMapping
    public Panel createPanel(@RequestBody Panel panel) {
        return panelRepository.save(panel);
    }

    // Crear panel y asociarlo a un proyecto
    @PostMapping("/project/{projectId}")
    public Panel createPanelInProject(@PathVariable Long projectId, @RequestBody Panel panel) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // Primero guardas el panel
        Panel saved = panelRepository.save(panel);

        // Luego creas la relación
        ProjectElement pe = new ProjectElement(project, saved, 1);
        projectElementRepository.save(pe);

        return saved;
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
