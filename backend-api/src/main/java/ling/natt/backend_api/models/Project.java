package ling.natt.backend_api.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "projects")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "is_energy_enough")
    private boolean energyEnough;

    @Column(name = "energy_needed")
    private float energyNeeded;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference(value = "project-elements")
    private List<ProjectElement> projectElements = new ArrayList<>();

    public Project() {
    }

    public Project(String name, float energyNeeded, boolean energyEnough, Long userId) {
        this.name = name;
        this.energyNeeded = energyNeeded;
        this.energyEnough = energyEnough;
        this.userId = userId;
    }

    @PrePersist
    @PreUpdate
    private void touchUpdatedAt() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
        return energyEnough;
    }

    public void setEnergyEnough(boolean energyEnough) {
        this.energyEnough = energyEnough;
    }

    public float getEnergyNeeded() {
        return energyNeeded;
    }

    public void setEnergyNeeded(float energyNeeded) {
        this.energyNeeded = energyNeeded;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<ProjectElement> getProjectElements() {
        return projectElements;
    }

    public void setProjectElements(List<ProjectElement> projectElements) {
        this.projectElements = projectElements;
    }
}
