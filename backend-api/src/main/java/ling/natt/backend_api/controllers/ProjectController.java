package ling.natt.backend_api.controllers;

import ling.natt.backend_api.models.Project;
import ling.natt.backend_api.repositories.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/projects")
public class ProjectController {
    @Autowired
    private ProjectRepository projectRepository;

    @GetMapping
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Project> getProjectById(@PathVariable int id) {
        return projectRepository.findById(id);
    }

    @PostMapping
    public Project createProject(@RequestBody Project project) {
        return projectRepository.save(project);
    }

    @PutMapping("/{id}")
    public Project updateProject(@PathVariable int id, @RequestBody Project projectDetails) {
        return projectRepository.findById(id)
                .map(project -> {
                    project.userId = projectDetails.userId;
                    project.name = projectDetails.name;
                    project.updatedAt = projectDetails.updatedAt;
                    project.isEnergyEnough = projectDetails.isEnergyEnough;
                    project.energyNeeded = projectDetails.energyNeeded;
                    return projectRepository.save(project);
                })
                .orElseGet(() -> {
                    projectDetails.id = id;
                    return projectRepository.save(projectDetails);
                });
    }

    @DeleteMapping("/{id}")
    public void deleteProject(@PathVariable int id) {
        projectRepository.deleteById(id);
    }
}
