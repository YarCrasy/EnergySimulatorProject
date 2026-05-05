package ies.elrincon.backend.models;

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
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import ies.elrincon.backend.dto.ProjectSeed;

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

    @Column(length = 50)
    private String season = "verano";

    private Double latitude = 28.1;

    private Double longitude = -15.4;

    @Column(length = 80)
    private String timezone = "auto";

    @Column(name = "simulation_date")
    private LocalDate simulationDate;

    @Column(name = "tilt_angle")
    private Double tiltAngle = 30.0;

    private Double azimuth = 0.0;

    @Column(name = "duration_days")
    private Integer durationDays = 1;

    @Column(name = "simulation_mode", length = 80)
    private String simulationMode = "open-meteo";

    @Column(name = "system_loss_percent")
    private Double systemLossPercent = 14.0;

    @Column(name = "is_energy_enough")
    private Boolean energyEnough = false;

    @Column(name = "energy_needed")
    private Float energyNeeded = 0f;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference(value = "project-nodes")
    private List<ProjectNode> projectNodes = new ArrayList<>();

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference(value = "project-node-connections")
    private List<ProjectNodeConnection> nodeConnections = new ArrayList<>();

    public Project() {
    }

    public Project(ProjectSeed seed) {
        this.name = seed.name();
        this.energyNeeded = seed.energyNeeded() == null ? 0f : seed.energyNeeded();
        this.energyEnough = seed.energyEnough() != null && seed.energyEnough();
        this.userId = seed.userId();
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

    public String getSeason() {
        return season;
    }

    public void setSeason(String season) {
        this.season = season;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public LocalDate getSimulationDate() {
        return simulationDate;
    }

    public void setSimulationDate(LocalDate simulationDate) {
        this.simulationDate = simulationDate;
    }

    public Double getTiltAngle() {
        return tiltAngle;
    }

    public void setTiltAngle(Double tiltAngle) {
        this.tiltAngle = tiltAngle;
    }

    public Double getAzimuth() {
        return azimuth;
    }

    public void setAzimuth(Double azimuth) {
        this.azimuth = azimuth;
    }

    public Integer getDurationDays() {
        return durationDays;
    }

    public void setDurationDays(Integer durationDays) {
        this.durationDays = durationDays;
    }

    public String getSimulationMode() {
        return simulationMode;
    }

    public void setSimulationMode(String simulationMode) {
        this.simulationMode = simulationMode;
    }

    public Double getSystemLossPercent() {
        return systemLossPercent;
    }

    public void setSystemLossPercent(Double systemLossPercent) {
        this.systemLossPercent = systemLossPercent;
    }

    public boolean isEnergyEnough() {
        return Boolean.TRUE.equals(energyEnough);
    }

    public void setEnergyEnough(Boolean energyEnough) {
        this.energyEnough = energyEnough != null && energyEnough;
    }

    public Float getEnergyNeeded() {
        return energyNeeded;
    }

    public void setEnergyNeeded(Float energyNeeded) {
        this.energyNeeded = energyNeeded == null ? 0f : energyNeeded;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<ProjectNode> getProjectNodes() {
        return projectNodes;
    }

    public void setProjectNodes(List<ProjectNode> projectNodes) {
        this.projectNodes = projectNodes;
    }

    public List<ProjectNodeConnection> getNodeConnections() {
        return nodeConnections;
    }

    public void setNodeConnections(List<ProjectNodeConnection> nodeConnections) {
        this.nodeConnections = nodeConnections;
    }
}
