package project.simulator.backend.models;

import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Column;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Entity
@Table(name = "elements")
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "element_type")
public abstract class Element {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @Column(length = 120)
    private String category;

    @Column(length = 512)
    private String description;

    @Column(name = "image_url", length = 512)
    private String imageUrl;

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

    public String getCategory() {
        return this.category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return this.imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    @Transient
    public String getElementType() {
        if (this.category != null && !this.category.isBlank()) {
            return this.category;
        }
        return this.getClass().getSimpleName();
    }

    public void setElementType(String elementType) {
        if (this.category == null || this.category.isBlank()) {
            this.category = elementType;
        }
    }

    @Override
    public String toString() {
        return "{" +
                " id='" + getId() + "'" +
                ", name='" + getName() + "'" +
                ", category='" + getCategory() + "'" +
                "}";
    }
}
