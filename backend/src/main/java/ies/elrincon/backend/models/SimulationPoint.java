package ies.elrincon.backend.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "simulation_points")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class SimulationPoint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "simulation_run_id", nullable = false)
    @JsonBackReference(value = "simulation-run-points")
    private SimulationRun simulationRun;

    @Column(name = "time_label", length = 80)
    private String timestamp;

    @Column(name = "generation_w")
    private Double generationW = 0d;

    @Column(name = "consumption_w")
    private Double consumptionW = 0d;

    @Column(name = "balance_w")
    private Double balanceW = 0d;

    @Column(name = "deficit_kwh")
    private Double deficitKwh = 0d;

    @Column(name = "surplus_kwh")
    private Double surplusKwh = 0d;

    @Column(name = "cloud_cover")
    private Double cloudCover = 0d;

    private Double irradiance = 0d;

    @Column(name = "is_day")
    private boolean day;

    public Long getId() {
        return id;
    }

    public SimulationRun getSimulationRun() {
        return simulationRun;
    }

    public void setSimulationRun(SimulationRun simulationRun) {
        this.simulationRun = simulationRun;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public Double getGenerationW() {
        return generationW;
    }

    public void setGenerationW(Double generationW) {
        this.generationW = generationW;
    }

    public Double getConsumptionW() {
        return consumptionW;
    }

    public void setConsumptionW(Double consumptionW) {
        this.consumptionW = consumptionW;
    }

    public Double getBalanceW() {
        return balanceW;
    }

    public void setBalanceW(Double balanceW) {
        this.balanceW = balanceW;
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

    public Double getCloudCover() {
        return cloudCover;
    }

    public void setCloudCover(Double cloudCover) {
        this.cloudCover = cloudCover;
    }

    public Double getIrradiance() {
        return irradiance;
    }

    public void setIrradiance(Double irradiance) {
        this.irradiance = irradiance;
    }

    public boolean isDay() {
        return day;
    }

    public void setDay(boolean day) {
        this.day = day;
    }
}
