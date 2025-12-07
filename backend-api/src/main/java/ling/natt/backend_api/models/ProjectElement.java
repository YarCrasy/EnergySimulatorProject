package ling.natt.backend_api.models;

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
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "project_elements", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "project_id", "element_id" })
})
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class ProjectElement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    @JsonBackReference(value = "project-elements")
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "element_id", nullable = false)
    @JsonBackReference
    private Element element;

    private Integer unidades = 1;

    public ProjectElement() {
    }

    public ProjectElement(Project project, Element element, Integer unidades) {
        this.project = project;
        this.element = element;
        this.unidades = unidades;
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

    public void setElement(Element element) {
        this.element = element;
    }

    public Integer getUnidades() {
        return unidades;
    }

    public void setUnidades(Integer unidades) {
        this.unidades = unidades;
    }

    @Override
    public String toString() {
        return "{" +
                "unidades='" + getUnidades() + "'" +
                "}";
    }
}
