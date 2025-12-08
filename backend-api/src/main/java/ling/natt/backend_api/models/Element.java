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

    // constructores
    public Element() {
    }

    public Element(String name) {
        this.name = name;
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

    @Override
    public String toString() {
        return "{" +
                " id='" + getId() + "'" +
                ", name='" + getName() + "'" +
                "}";
    }
}