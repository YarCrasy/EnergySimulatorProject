package project.simulator.backend.models;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonSetter;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Entity
@Table(name = "project_nodes")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class ProjectNode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    @JsonBackReference(value = "project-nodes")
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "element_id", nullable = false)
    @JsonBackReference
    private Element element;

    @Transient
    private Long elementIdReference;

    @Column(name = "position_x")
    private Float positionX = 0f;

    @Column(name = "position_y")
    private Float positionY = 0f;

    public ProjectNode() {
    }

    public ProjectNode(Project project, Element element) {
        this.project = project;
        this.element = element;
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

    public Element getElement() {
        return element;
    }

    @JsonIgnore
    public void setElement(Element element) {
        this.element = element;
    }

    @JsonSetter("element")
    public void captureElementReference(Object elementPayload) {
        if (elementPayload == null) {
            this.elementIdReference = null;
            this.element = null;
            return;
        }

        if (elementPayload instanceof Element providedElement) {
            this.element = providedElement;
            this.elementIdReference = providedElement.getId();
            return;
        }

        if (elementPayload instanceof Map<?, ?> mapPayload) {
            Object idValue = mapPayload.get("id");
            this.elementIdReference = parseElementId(idValue);
            return;
        }

        this.elementIdReference = parseElementId(elementPayload);
    }

    public Long getElementIdReference() {
        if (element != null && element.getId() != null) {
            return element.getId();
        }
        return elementIdReference;
    }

    public Float getPositionX() {
        return positionX;
    }

    public void setPositionX(Float positionX) {
        this.positionX = positionX;
    }

    public Float getPositionY() {
        return positionY;
    }

    public void setPositionY(Float positionY) {
        this.positionY = positionY;
    }

    private Long parseElementId(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof Number number) {
            return number.longValue();
        }
        if (value instanceof String text) {
            if (text.isBlank()) {
                return null;
            }
            try {
                return Long.parseLong(text);
            } catch (NumberFormatException ignored) {
                return null;
            }
        }
        return null;
    }

    @Override
    public String toString() {
        return "{" +
            "positionX='" + getPositionX() + "'" +
                ", positionY='" + getPositionY() + "'" +
                "}";
    }
}
