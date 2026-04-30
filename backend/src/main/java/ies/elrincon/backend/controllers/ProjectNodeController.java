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

import ies.elrincon.backend.dto.ProjectNodeRequest;
import ies.elrincon.backend.models.Element;
import ies.elrincon.backend.models.Project;
import ies.elrincon.backend.models.ProjectNode;
import ies.elrincon.backend.repositories.ElementRepository;
import ies.elrincon.backend.repositories.ProjectNodeRepository;
import ies.elrincon.backend.repositories.ProjectRepository;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/projects/{projectId}/nodes")
public class ProjectNodeController {

    private final ProjectRepository projectRepository;
    private final ElementRepository elementRepository;
    private final ProjectNodeRepository projectNodeRepository;

    public ProjectNodeController(
            ProjectRepository projectRepository,
            ElementRepository elementRepository,
            ProjectNodeRepository projectNodeRepository) {
        this.projectRepository = projectRepository;
        this.elementRepository = elementRepository;
        this.projectNodeRepository = projectNodeRepository;
    }

    @GetMapping
    public List<ProjectNode> getProjectNodes(@PathVariable Long projectId) {
        validateProject(projectId);
        return projectNodeRepository.findByProjectId(projectId);
    }

    @GetMapping("/{nodeId}")
    public ProjectNode getProjectNode(@PathVariable Long projectId, @PathVariable Long nodeId) {
        return findProjectNode(projectId, nodeId);
    }

    @PostMapping
    public ProjectNode createProjectNode(
            @PathVariable Long projectId,
            @RequestBody ProjectNodeRequest request) {
        Project project = validateProject(projectId);
        Element element = findElement(request.elementId());

        ProjectNode node = new ProjectNode(project, element);
        applyRequest(node, request);
        return projectNodeRepository.save(node);
    }

    @PutMapping("/{nodeId}")
    public ProjectNode updateProjectNode(
            @PathVariable Long projectId,
            @PathVariable Long nodeId,
            @RequestBody ProjectNodeRequest request) {
        ProjectNode node = findProjectNode(projectId, nodeId);
        if (request.elementId() != null) {
            node.setElement(findElement(request.elementId()));
        }
        applyRequest(node, request);
        return projectNodeRepository.save(node);
    }

    @DeleteMapping("/{nodeId}")
    public void deleteProjectNode(@PathVariable Long projectId, @PathVariable Long nodeId) {
        ProjectNode node = findProjectNode(projectId, nodeId);
        projectNodeRepository.delete(node);
    }

    private Project validateProject(Long projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Proyecto no encontrado con id " + projectId));
    }

    private ProjectNode findProjectNode(Long projectId, Long nodeId) {
        return projectNodeRepository.findByProjectIdAndId(projectId, nodeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Nodo no encontrado con id " + nodeId + " en proyecto " + projectId));
    }

    private Element findElement(Long elementId) {
        if (elementId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El campo elementId es obligatorio");
        }
        return elementRepository.findById(elementId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Elemento no encontrado con id " + elementId));
    }

    private void applyRequest(ProjectNode node, ProjectNodeRequest request) {
        if (request.positionX() != null) {
            node.setPositionX(request.positionX());
        }
        if (request.positionY() != null) {
            node.setPositionY(request.positionY());
        }
        if (request.type() != null) {
            node.setType(request.type());
        }
        if (request.quantity() != null) {
            node.setQuantity(Math.max(1, request.quantity()));
        }
        if (request.data() != null) {
            node.setData(request.data());
        }
    }
}
