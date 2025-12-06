package ling.natt.energysimulator.models;

import android.os.Build;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class Project {

    private Long id;

    private String name;
    private LocalDateTime updatedAt;
    private boolean isEnergyEnough;
    private float energyNeeded;

    private User user;

    private List<ProjectElement> projectElements = new ArrayList<>();

    public Project(String name, User user, LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
        this.name = name;
        this.user = user;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            this.updatedAt = LocalDateTime.now();
        }
    }

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
