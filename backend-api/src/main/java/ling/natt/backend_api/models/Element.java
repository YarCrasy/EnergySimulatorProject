package ling.natt.backend_api.models;

import jakarta.persistence.Entity;
import jakarta.persistence.*;

@Entity
@Table(name = "elements")
@Inheritance(strategy = InheritanceType.JOINED)
public class Element {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String name;
    private Float x;
    private Float y;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    // constructores
    public Element() {
    }

    public Element(int id, String name, Float x, Float y) {
        this.id = id;
        this.name = name;
        this.x = x;
        this.y = y;
    }

    // getters y setters
    public int getId() {
        return this.id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Float getX() {
        return this.x;
    }

    public void setX(Float x) {
        this.x = x;
    }

    public Float getY() {
        return this.y;
    }

    public void setY(Float y) {
        this.y = y;
    }

    public Project getProject() {
        return this.project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    @Override
    public String toString() {
        return "{" +
                " id='" + getId() + "'" +
                ", name='" + getName() + "'" +
                ", x='" + getX() + "'" +
                ", y='" + getY() + "'" +
                "}";
    }
}