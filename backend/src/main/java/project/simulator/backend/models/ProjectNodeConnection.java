package project.simulator.backend.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "project_node_connections")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class ProjectNodeConnection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    @JsonBackReference(value = "project-node-connections")
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "source_node_id", nullable = false)
    private ProjectNode source;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "target_node_id", nullable = false)
    private ProjectNode target;

    private String connectionType;

    public ProjectNodeConnection() {
    }

    public ProjectNodeConnection(Project project, ProjectNode source, ProjectNode target, String connectionType) {
        this.project = project;
        this.source = source;
        this.target = target;
        this.connectionType = connectionType;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public ProjectNode getSource() {
        return source;
    }

    public void setSource(ProjectNode source) {
        this.source = source;
    }

    public ProjectNode getTarget() {
        return target;
    }

    public void setTarget(ProjectNode target) {
        this.target = target;
    }

    public String getConnectionType() {
        return connectionType;
    }

    public void setConnectionType(String connectionType) {
        this.connectionType = connectionType;
    }
}
