package ling.natt.backend_api.models;

import jakarta.persistence.*;

@Entity
@Table(name = "elements")
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "element_type")
public abstract class Element {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private Float x;
    private Float y;

    // constructores
    public Element() {
    }

    public Element(String name, Float x, Float y) {
        this.name = name;
        this.x = x;
        this.y = y;
    }

    // getters y setters
    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
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