package ies.elrincon.backend.models;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSetter;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

import ies.elrincon.backend.dto.ProjectNodeConnectionSeed;

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

    @Transient
    private Long sourceNodeIdReference;

    @Transient
    private Long targetNodeIdReference;

    private String connectionType;

    public ProjectNodeConnection() {
    }

    public ProjectNodeConnection(ProjectNodeConnectionSeed seed) {
        this.project = seed.project();
        this.source = seed.source();
        this.target = seed.target();
        this.connectionType = seed.connectionType();
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

    @JsonIgnore
    public ProjectNode getSource() {
        return source;
    }

    @JsonIgnore
    public void setSource(ProjectNode source) {
        this.source = source;
    }

    @JsonIgnore
    public ProjectNode getTarget() {
        return target;
    }

    @JsonIgnore
    public void setTarget(ProjectNode target) {
        this.target = target;
    }

    @JsonSetter("source")
    public void captureSourceReference(Object sourcePayload) {
        if (sourcePayload == null) {
            this.sourceNodeIdReference = null;
            this.source = null;
            return;
        }

        if (sourcePayload instanceof ProjectNode providedNode) {
            this.source = providedNode;
            this.sourceNodeIdReference = providedNode.getId();
            return;
        }

        if (sourcePayload instanceof Map<?, ?> mapPayload) {
            this.sourceNodeIdReference = parseNodeId(mapPayload.get("id"));
            return;
        }

        this.sourceNodeIdReference = parseNodeId(sourcePayload);
    }

    @JsonSetter("target")
    public void captureTargetReference(Object targetPayload) {
        if (targetPayload == null) {
            this.targetNodeIdReference = null;
            this.target = null;
            return;
        }

        if (targetPayload instanceof ProjectNode providedNode) {
            this.target = providedNode;
            this.targetNodeIdReference = providedNode.getId();
            return;
        }

        if (targetPayload instanceof Map<?, ?> mapPayload) {
            this.targetNodeIdReference = parseNodeId(mapPayload.get("id"));
            return;
        }

        this.targetNodeIdReference = parseNodeId(targetPayload);
    }

    public Long getSourceNodeIdReference() {
        if (source != null && source.getId() != null) return source.getId();
        return sourceNodeIdReference;
    }

    public Long getTargetNodeIdReference() {
        if (target != null && target.getId() != null) return target.getId();
        return targetNodeIdReference;
    }

    @JsonProperty("source")
    public Map<String, Long> getSourceReferencePayload() {
        Long id = getSourceNodeIdReference();
        if (id == null) return null;
        return Map.of("id", id);
    }

    @JsonProperty("target")
    public Map<String, Long> getTargetReferencePayload() {
        Long id = getTargetNodeIdReference();
        if (id == null) return null;
        return Map.of("id", id);
    }

    public String getConnectionType() {
        return connectionType;
    }

    public void setConnectionType(String connectionType) {
        this.connectionType = connectionType;
    }

    private Long parseNodeId(Object value) {
        if (value == null) return null;
        if (value instanceof Number number) return number.longValue();
        if (value instanceof String text) {
            if (text.isBlank()) return null;
            try {
                return Long.parseLong(text);
            } catch (NumberFormatException ignored) {
                return null;
            }
        }
        return null;
    }
}
