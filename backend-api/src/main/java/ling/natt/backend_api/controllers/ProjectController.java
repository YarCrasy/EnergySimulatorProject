package ling.natt.backend_api.controllers;

import ling.natt.backend_api.models.Project;
import ling.natt.backend_api.models.ProjectElement;
import ling.natt.backend_api.repositories.ProjectRepository;
import ling.natt.backend_api.repositories.UserRepository;
import ling.natt.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @GetMapping("/user/{userId}")
    public List<Project> getProjectsByUser(@PathVariable Long userId) {
        validateUserExists(userId);
        return projectRepository.findByUserId(userId);
    }

    @GetMapping("/search")
    public List<Project> searchProjects(@RequestParam("q") String query) {
        return projectRepository.findByNameContaining(query);
    }

    @GetMapping("/{id}")
    public Project getProjectById(@PathVariable Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proyecto no encontrado con id " + id));
    }

    @PostMapping()
    public Project createProject(@RequestBody Project project) {
        Long userId = project.getUserId();
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El campo userId es obligatorio");
        }
        validateUserExists(userId);

        project.setUserId(userId);
        project.setUpdatedAt(LocalDateTime.now());
        bindProjectToElements(project);

        return projectRepository.save(project);
    }

    @PutMapping("/{id}")
    public Project updateProject(@PathVariable Long id, @RequestBody Project project) {
        Project existingProject = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proyecto no encontrado con id " + id));

        existingProject.setName(project.getName());
        existingProject.setEnergyNeeded(project.getEnergyNeeded());
        existingProject.setEnergyEnough(project.isEnergyEnough());

        if (project.getUserId() != null) {
            Long userId = project.getUserId();
            validateUserExists(userId);
            existingProject.setUserId(userId);
        }

        replaceProjectElements(existingProject, project.getProjectElements());
        existingProject.setUpdatedAt(LocalDateTime.now());
        return projectRepository.save(existingProject);
    }

    // Eliminar un proyecto
    @DeleteMapping("/{id}")
    public Project deleteProject(@PathVariable Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proyecto no encontrado con id " + id));
        projectRepository.deleteById(id);
        return project;
    }

    @DeleteMapping("/user/{userId}")
    public void deleteProjectsByUser(@PathVariable Long userId) {
        validateUserExists(userId);
        List<Project> projects = projectRepository.findByUserId(userId);
        projectRepository.deleteAll(projects);
    }

    private void validateUserExists(Long userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id " + userId));
    }

    private void bindProjectToElements(Project project) {
        if (project.getProjectElements() == null) {
            project.setProjectElements(new java.util.ArrayList<>());
        }
        project.getProjectElements().forEach(element -> element.setProject(project));
    }

    private void replaceProjectElements(Project project, List<ProjectElement> elements) {
        project.getProjectElements().clear();
        if (elements == null) {
            return;
        }
        elements.forEach(element -> {
            element.setProject(project);
            project.getProjectElements().add(element);
        });
    }
}
