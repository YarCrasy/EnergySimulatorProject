package ling.natt.backend_api.controllers;

import ling.natt.backend_api.models.Project;
import ling.natt.backend_api.models.User;
import ling.natt.backend_api.repositories.ProjectRepository;
import ling.natt.backend_api.repositories.UserRepository;
import ling.natt.exception.ResourceNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*") // Permite solicitudes desde el frontend
@RestController
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
                .orElseThrow(() -> new ResourceNotFoundException("Proyecto no encontrado con id " + id));
    }

    // Crear un nuevo proyecto asociándolo a un usuario existente
    @PostMapping
    public Project createProject(@RequestParam Long userId, @RequestBody Project project) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id " + userId));
        project.setUser(user);
        project.setUpdatedAt(LocalDateTime.now());
        return projectRepository.save(project);
    }

    // Actualizar un proyecto
    @PutMapping("/{id}")
    public Project updateProject(@PathVariable Long id, @RequestBody Project projectDetails) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proyecto no encontrado con id " + id));

        project.setName(projectDetails.getName());
        project.setUpdatedAt(LocalDateTime.now());
        project.setEnergyEnough(projectDetails.isEnergyEnough());
        project.setEnergyNeeded(projectDetails.getEnergyNeeded());

        // Si quieres cambiar el usuario del proyecto
        if (projectDetails.getUser() != null) {
            Long newUserId = projectDetails.getUser().getId();
            User user = userRepository.findById(newUserId)
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id " + newUserId));
            project.setUser(user);
        }

        return projectRepository.save(project);
    }

    // Eliminar un proyecto
    @DeleteMapping("/{id}")
    public Project deleteProject(@PathVariable Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proyecto no encontrado con id " + id));
        projectRepository.deleteById(id);
        return project;
    }
}
