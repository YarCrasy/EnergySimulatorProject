package ling.natt.backend_api.controllers;

import ling.natt.backend_api.models.Project;
import ling.natt.backend_api.models.User;
import ling.natt.backend_api.repositories.ProjectRepository;
import ling.natt.backend_api.repositories.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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

    // Obtener todos los proyectos
    @GetMapping
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    // Obtener un proyecto por ID
    @GetMapping("/{id}")
    public Project getProjectById(@PathVariable Long id) {
        return projectRepository.findById(id)
                .orElseThrow();
    }

    // Crear un nuevo proyecto asociándolo a un usuario existente
    @PostMapping()
    public Project createProject(@RequestParam Long userId, @RequestBody Project project) {
        User user = userRepository.findById(userId)
                .orElseThrow();
        project.setUser(user);
        project.setUpdatedAt(LocalDateTime.now());
        return projectRepository.save(project);
    }

    // Actualizar un proyecto
    @PutMapping("/{id}")
    public Project updateProject(@PathVariable Long id, @RequestBody Project projectDetails) {
        Project project = projectRepository.findById(id)
                .orElseThrow();

        project.setName(projectDetails.getName());
        project.setUpdatedAt(LocalDateTime.now());
        project.setEnergyEnough(projectDetails.isEnergyEnough());
        project.setEnergyNeeded(projectDetails.getEnergyNeeded());

        // Si quieres cambiar el usuario del proyecto
        if (projectDetails.getUser() != null) {
            Long newUserId = projectDetails.getUser().getId();
            User user = userRepository.findById(newUserId)
                    .orElseThrow();
            project.setUser(user);
        }

        return projectRepository.save(project);
    }

    // Eliminar un proyecto
    @DeleteMapping("/{id}")
    public Project deleteProject(@PathVariable Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow();
        projectRepository.deleteById(id);
        return project;
    }
}
