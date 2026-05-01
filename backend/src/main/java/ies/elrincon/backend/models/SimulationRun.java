package ies.elrincon.backend.models;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "simulation_runs")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class SimulationRun {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    @JsonIgnore
    private Project project;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(length = 80)
    private String provider = "open-meteo";

    private Double latitude;
    private Double longitude;

    @Column(length = 80)
    private String timezone;

    @Column(name = "duration_days")
    private Integer durationDays;

    @Column(name = "tilt_angle")
    private Double tiltAngle;

    private Double azimuth;

    @Column(name = "total_generation_kwh")
    private Double totalGenerationKwh = 0d;

    @Column(name = "total_consumption_kwh")
    private Double totalConsumptionKwh = 0d;

    @Column(name = "deficit_kwh")
    private Double deficitKwh = 0d;

    @Column(name = "surplus_kwh")
    private Double surplusKwh = 0d;

    @Column(name = "self_sufficiency_percent")
    private Double selfSufficiencyPercent = 0d;

    @Column(name = "is_energy_enough")
    private boolean energyEnough;

    @OneToMany(mappedBy = "simulationRun", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference(value = "simulation-run-points")
    @OrderBy("timestamp ASC")
    private List<SimulationPoint> points = new ArrayList<>();

    @PrePersist
    private void touchCreatedAt() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
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

    public Integer getDurationDays() {
        return durationDays;
    }

    public void setDurationDays(Integer durationDays) {
        this.durationDays = durationDays;
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

    public Double getTotalGenerationKwh() {
        return totalGenerationKwh;
    }

    public void setTotalGenerationKwh(Double totalGenerationKwh) {
        this.totalGenerationKwh = totalGenerationKwh;
    }

    public Double getTotalConsumptionKwh() {
        return totalConsumptionKwh;
    }

    public void setTotalConsumptionKwh(Double totalConsumptionKwh) {
        this.totalConsumptionKwh = totalConsumptionKwh;
    }

    public Double getDeficitKwh() {
        return deficitKwh;
    }

    public void setDeficitKwh(Double deficitKwh) {
        this.deficitKwh = deficitKwh;
    }

    public Double getSurplusKwh() {
        return surplusKwh;
    }

    public void setSurplusKwh(Double surplusKwh) {
        this.surplusKwh = surplusKwh;
    }

    public Double getSelfSufficiencyPercent() {
        return selfSufficiencyPercent;
    }

    public void setSelfSufficiencyPercent(Double selfSufficiencyPercent) {
        this.selfSufficiencyPercent = selfSufficiencyPercent;
    }

    public boolean isEnergyEnough() {
        return energyEnough;
    }

    public void setEnergyEnough(boolean energyEnough) {
        this.energyEnough = energyEnough;
    }

    public List<SimulationPoint> getPoints() {
        return points;
    }

    public void setPoints(List<SimulationPoint> points) {
        this.points = points;
    }
}
