package ies.elrincon.backend.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import ies.elrincon.backend.dto.ProjectNodeConnectionRequest;
import ies.elrincon.backend.models.Project;
import ies.elrincon.backend.models.ProjectNode;
import ies.elrincon.backend.models.ProjectNodeConnection;
import ies.elrincon.backend.repositories.ProjectNodeConnectionRepository;
import ies.elrincon.backend.repositories.ProjectNodeRepository;
import ies.elrincon.backend.repositories.ProjectRepository;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/projects/{projectId}/connections")
public class ProjectNodeConnectionController {

    private final ProjectRepository projectRepository;
    private final ProjectNodeRepository projectNodeRepository;
    private final ProjectNodeConnectionRepository connectionRepository;

    public ProjectNodeConnectionController(
            ProjectRepository projectRepository,
            ProjectNodeRepository projectNodeRepository,
            ProjectNodeConnectionRepository connectionRepository) {
        this.projectRepository = projectRepository;
        this.projectNodeRepository = projectNodeRepository;
        this.connectionRepository = connectionRepository;
    }

    @GetMapping
    public List<ProjectNodeConnection> getConnections(@PathVariable Long projectId) {
        validateProject(projectId);
        return connectionRepository.findByProjectId(projectId);
    }

    @GetMapping("/{connectionId}")
    public ProjectNodeConnection getConnection(@PathVariable Long projectId, @PathVariable Long connectionId) {
        return findConnection(projectId, connectionId);
    }

    @PostMapping
    public ProjectNodeConnection createConnection(
            @PathVariable Long projectId,
            @RequestBody ProjectNodeConnectionRequest request) {
        Project project = validateProject(projectId);
        ProjectNode source = findProjectNode(projectId, request.sourceNodeId(), "sourceNodeId");
        ProjectNode target = findProjectNode(projectId, request.targetNodeId(), "targetNodeId");

        ProjectNodeConnection connection = new ProjectNodeConnection(
                project,
                source,
                target,
                request.connectionType());
        return connectionRepository.save(connection);
    }

    @PutMapping("/{connectionId}")
    public ProjectNodeConnection updateConnection(
            @PathVariable Long projectId,
            @PathVariable Long connectionId,
            @RequestBody ProjectNodeConnectionRequest request) {
        ProjectNodeConnection connection = findConnection(projectId, connectionId);
        if (request.sourceNodeId() != null) {
            connection.setSource(findProjectNode(projectId, request.sourceNodeId(), "sourceNodeId"));
        }
        if (request.targetNodeId() != null) {
            connection.setTarget(findProjectNode(projectId, request.targetNodeId(), "targetNodeId"));
        }
        if (request.connectionType() != null) {
            connection.setConnectionType(request.connectionType());
        }
        return connectionRepository.save(connection);
    }

    @DeleteMapping("/{connectionId}")
    public void deleteConnection(@PathVariable Long projectId, @PathVariable Long connectionId) {
        ProjectNodeConnection connection = findConnection(projectId, connectionId);
        connectionRepository.delete(connection);
    }

    private Project validateProject(Long projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Proyecto no encontrado con id " + projectId));
    }

    private ProjectNodeConnection findConnection(Long projectId, Long connectionId) {
        return connectionRepository.findByProjectIdAndId(projectId, connectionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Conexion no encontrada con id " + connectionId + " en proyecto " + projectId));
    }

    private ProjectNode findProjectNode(Long projectId, Long nodeId, String fieldName) {
        if (nodeId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El campo " + fieldName + " es obligatorio");
        }
        return projectNodeRepository.findByProjectIdAndId(projectId, nodeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Nodo no encontrado con id " + nodeId + " en proyecto " + projectId));
    }
}
