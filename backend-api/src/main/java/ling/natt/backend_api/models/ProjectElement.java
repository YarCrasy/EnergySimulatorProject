package ling.natt.backend_api.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "project_elements", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "project_id", "element_id" })
}) // asegura que no haya duplicados de elemento por proyecto
public class ProjectElement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false) // relacion con Project
    @JoinColumn(name = "project_id", nullable = false) // obliga a que siempre haya un proyecto asociado
    @JsonBackReference // evita referencias cíclicas según tu serialización
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY, optional = false) // relacion con Element
    @JoinColumn(name = "element_id", nullable = false) // obliga a que siempre haya un elemento asociado
    @JsonBackReference // evita referencias cíclicas según tu serialización
    private Element element;

    private Integer unidades = 1;

    public ProjectElement() {
    }

    public ProjectElement(Project project, Element element, Integer unidades) {
        this.project = project;
        this.element = element;
        this.unidades = unidades;
    }

    // getters y setters
    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Project getProject() {
        return this.project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public Element getElement() {
        return this.element;
    }

    public void setElement(Element element) {
        this.element = element;
    }

    public Integer getUnidades() {
        return this.unidades;
    }

    public void setUnidades(Integer unidades) {
        this.unidades = unidades;
    }

    // toString
    @Override
    public String toString() {
        return "{" +
                "unidades='" + getUnidades() + "'" +
                "}";
    }
}
