package ling.natt.backend_api.models;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;
    private LocalDateTime updatedAt;
    private boolean isEnergyEnough;
    private float energyNeeded;

    // relacion con User
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // relacion con Element
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProjectElement> projectElements = new ArrayList<>();

    // constructores
    public Project(String name, User user, LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
        this.name = name;
        this.user = user;
        this.updatedAt = LocalDateTime.now();
    }

    public Project() {
    }

    // helper method to get elements directly
    public void addElement(Element element, int unidades) {
        ProjectElement pe = new ProjectElement(this, element, unidades);
        projectElements.add(pe);
    }

    public void removeElement(ProjectElement pe) {
        projectElements.remove(pe);
        pe.setProject(null);
        pe.setElement(null);
    }

    // Getters and Setters
    public List<ProjectElement> getElements() {
        return projectElements;
    }

    public void setElements(List<ProjectElement> projectElements) {
        this.projectElements = projectElements;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public boolean isEnergyEnough() {
        return isEnergyEnough;
    }

    public void setEnergyEnough(boolean energyEnough) {
        isEnergyEnough = energyEnough;
    }

    public float getEnergyNeeded() {
        return energyNeeded;
    }

    public void setEnergyNeeded(float energyNeeded) {
        this.energyNeeded = energyNeeded;
    }

}
