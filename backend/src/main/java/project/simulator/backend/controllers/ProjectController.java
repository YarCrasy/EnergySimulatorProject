package project.simulator.backend.controllers;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import project.simulator.backend.models.Element;
import project.simulator.backend.models.Project;
import project.simulator.backend.models.ProjectNode;
import project.simulator.backend.models.ProjectNodeConnection;
import project.simulator.backend.repositories.ElementRepository;
import project.simulator.backend.repositories.ProjectRepository;
import project.simulator.backend.repositories.UserRepository;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ElementRepository elementRepository;

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
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Proyecto no encontrado con id " + id));
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
        bindProjectStructure(project);

        return projectRepository.save(project);
    }

    @PutMapping("/{id}")
    public Project updateProject(@PathVariable Long id, @RequestBody Project project) {
        Project existingProject = projectRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Proyecto no encontrado con id " + id));

        existingProject.setName(project.getName());
        existingProject.setEnergyNeeded(project.getEnergyNeeded());
        existingProject.setEnergyEnough(project.isEnergyEnough());

        if (project.getUserId() != null) {
            Long userId = project.getUserId();
            validateUserExists(userId);
            existingProject.setUserId(userId);
        }

        replaceProjectNodes(existingProject, project.getProjectNodes());
        replaceNodeConnections(existingProject, project.getNodeConnections());
        existingProject.setUpdatedAt(LocalDateTime.now());
        return projectRepository.save(existingProject);
    }

    // Eliminar un proyecto
    @DeleteMapping("/{id}")
    public Project deleteProject(@PathVariable Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Proyecto no encontrado con id " + id));
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
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado con id " + userId));
    }

    private void bindProjectStructure(Project project) {
        if (project.getProjectNodes() == null) {
            project.setProjectNodes(new java.util.ArrayList<>());
        }
        if (project.getNodeConnections() == null) {
            project.setNodeConnections(new java.util.ArrayList<>());
        }

        project.getProjectNodes().forEach(node -> {
            node.setProject(project);
            ensureElementAssigned(node);
        });
        project.getNodeConnections().forEach(connection -> connection.setProject(project));
    }

    private void replaceProjectNodes(Project project, List<ProjectNode> nodes) {
        project.getProjectNodes().clear();
        if (nodes == null) {
            return;
        }
        nodes.forEach(node -> {
            node.setProject(project);
            ensureElementAssigned(node);
            project.getProjectNodes().add(node);
        });
    }

    private void replaceNodeConnections(Project project, List<ProjectNodeConnection> connections) {
        project.getNodeConnections().clear();
        if (connections == null) {
            return;
        }
        connections.forEach(connection -> {
            connection.setProject(project);
            project.getNodeConnections().add(connection);
        });
    }

    private void ensureElementAssigned(ProjectNode node) {
        if (node.getElement() != null && node.getElement().getId() != null) {
            return;
        }

        Long elementId = node.getElementIdReference();
        if (elementId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cada nodo debe incluir element.id");
        }

        Element element = elementRepository.findById(elementId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Elemento no encontrado con id " + elementId));
        node.setElement(element);
    }
}
