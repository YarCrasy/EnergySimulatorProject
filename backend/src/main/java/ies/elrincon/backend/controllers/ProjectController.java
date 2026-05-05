package ies.elrincon.backend.controllers;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

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

import ies.elrincon.backend.models.Element;
import ies.elrincon.backend.models.Project;
import ies.elrincon.backend.models.ProjectNode;
import ies.elrincon.backend.models.ProjectNodeConnection;
import ies.elrincon.backend.repositories.ElementRepository;
import ies.elrincon.backend.repositories.ProjectRepository;
import ies.elrincon.backend.repositories.SimulationRunRepository;
import ies.elrincon.backend.repositories.UserRepository;

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

    @Autowired
    private SimulationRunRepository simulationRunRepository;

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
        if (userId == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El campo userId es obligatorio");
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

        if (project.getName() != null) existingProject.setName(project.getName());
        if (project.getSeason() != null) existingProject.setSeason(project.getSeason());
        if (project.getLatitude() != null) existingProject.setLatitude(project.getLatitude());
        if (project.getLongitude() != null) existingProject.setLongitude(project.getLongitude());
        if (project.getTimezone() != null) existingProject.setTimezone(project.getTimezone());
        if (project.getSimulationDate() != null) existingProject.setSimulationDate(project.getSimulationDate());
        if (project.getTiltAngle() != null) existingProject.setTiltAngle(project.getTiltAngle());
        if (project.getAzimuth() != null) existingProject.setAzimuth(project.getAzimuth());
        if (project.getDurationDays() != null) existingProject.setDurationDays(project.getDurationDays());
        if (project.getSimulationMode() != null) existingProject.setSimulationMode(project.getSimulationMode());
        if (project.getSystemLossPercent() != null) existingProject.setSystemLossPercent(project.getSystemLossPercent());
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
        simulationRunRepository.deleteByProjectId(id);
        projectRepository.deleteById(id);
        return project;
    }

    @DeleteMapping("/user/{userId}")
    public void deleteProjectsByUser(@PathVariable Long userId) {
        validateUserExists(userId);
        List<Project> projects = projectRepository.findByUserId(userId);
        projects.forEach(project -> simulationRunRepository.deleteByProjectId(project.getId()));
        projectRepository.deleteAll(projects);
    }

    private void validateUserExists(Long userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado con id " + userId));
    }

    private void bindProjectStructure(Project project) {
        if (project.getProjectNodes() == null) project.setProjectNodes(new java.util.ArrayList<>());
        if (project.getNodeConnections() == null) project.setNodeConnections(new java.util.ArrayList<>());

        project.getProjectNodes().forEach(node -> {
            node.setProject(project);
            ensureElementAssigned(node);
        });
        project.getNodeConnections().forEach(connection -> {
            connection.setProject(project);
            ensureConnectionNodesAssigned(project, connection);
        });
    }

    private void replaceProjectNodes(Project project, List<ProjectNode> nodes) {
        List<ProjectNode> currentNodes = project.getProjectNodes();
        Map<Long, ProjectNode> currentById = new LinkedHashMap<>();
        currentNodes.forEach(node -> {
            if (node.getId() != null) currentById.put(node.getId(), node);
        });

        List<ProjectNode> nextNodes = new ArrayList<>();
        if (nodes != null) {
            nodes.forEach(node -> {
                ProjectNode targetNode = node.getId() != null ? currentById.get(node.getId()) : null;
                if (targetNode == null) targetNode = new ProjectNode();
                mergeProjectNode(project, targetNode, node);
                nextNodes.add(targetNode);
            });
        }

        currentNodes.clear();
        currentNodes.addAll(nextNodes);
    }

    private void replaceNodeConnections(Project project, List<ProjectNodeConnection> connections) {
        List<ProjectNodeConnection> currentConnections = project.getNodeConnections();
        Map<Long, ProjectNodeConnection> currentById = new LinkedHashMap<>();
        currentConnections.forEach(connection -> {
            if (connection.getId() != null) currentById.put(connection.getId(), connection);
        });

        List<ProjectNodeConnection> nextConnections = new ArrayList<>();
        if (connections != null) {
            connections.forEach(connection -> {
                ProjectNodeConnection targetConnection = connection.getId() != null ? currentById.get(connection.getId()) : null;
                if (targetConnection == null) targetConnection = new ProjectNodeConnection();
                mergeProjectConnection(project, targetConnection, connection);
                nextConnections.add(targetConnection);
            });
        }

        currentConnections.clear();
        currentConnections.addAll(nextConnections);
    }

    private void mergeProjectNode(Project project, ProjectNode target, ProjectNode source) {
        target.setProject(project);
        target.setType(source.getType());
        target.setPositionX(source.getPositionX());
        target.setPositionY(source.getPositionY());
        target.setQuantity(source.getQuantity());
        target.setData(source.getData());

        if (source.getElement() != null) {
            target.setElement(source.getElement());
        } else {
            Long elementId = source.getElementIdReference();
            if (elementId == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cada nodo debe incluir element.id");

            Element element = elementRepository.findById(elementId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Elemento no encontrado con id " + elementId));
            target.setElement(element);
        }
    }

    private void mergeProjectConnection(Project project, ProjectNodeConnection target, ProjectNodeConnection source) {
        target.setProject(project);
        target.setConnectionType(source.getConnectionType());
        ProjectNode resolvedSource = resolveConnectionNode(project, source.getSource(), source.getSourceNodeIdReference(), "source.id");
        ProjectNode resolvedTarget = resolveConnectionNode(project, source.getTarget(), source.getTargetNodeIdReference(), "target.id");
        target.setSource(resolvedSource);
        target.setTarget(resolvedTarget);
    }

    private void ensureElementAssigned(ProjectNode node) {
        if (node.getElement() != null && node.getElement().getId() != null) return;

        Long elementId = node.getElementIdReference();
        if (elementId == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cada nodo debe incluir element.id");

        Element element = elementRepository.findById(elementId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Elemento no encontrado con id " + elementId));
        node.setElement(element);
    }

    private void ensureConnectionNodesAssigned(Project project, ProjectNodeConnection connection) {
        ProjectNode source = resolveConnectionNode(project, connection.getSource(), connection.getSourceNodeIdReference(), "source.id");
        ProjectNode target = resolveConnectionNode(project, connection.getTarget(), connection.getTargetNodeIdReference(), "target.id");
        connection.setSource(source);
        connection.setTarget(target);
    }

    private ProjectNode resolveConnectionNode(Project project, ProjectNode currentNode, Long nodeId, String fieldName) {
        if (currentNode != null && currentNode.getProject() == project) return currentNode;
        if (nodeId == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cada conexion debe incluir " + fieldName);

        return project.getProjectNodes().stream()
                .filter(node -> nodeId.equals(node.getId()))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "No se encontro el nodo " + nodeId + " dentro del proyecto actualizado"));
    }
}
