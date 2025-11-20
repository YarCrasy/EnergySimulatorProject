package ling.natt.backend_api.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "panels")
public class Panel extends Element {
    private String brand;
    private Double efficiency;
    private Double powerWatt;

    // constructores
    public Panel() {
    }

    public Panel(int id, String nombre, Float x, Float y, String brand, Double efficiency, Double powerWatt) {
        super(id, nombre, x, y);
        this.brand = brand;
        this.efficiency = efficiency;
        this.powerWatt = powerWatt;
    }

    // getters y setters
    public String getBrand() {
        return this.brand;
    }

    public Double getEfficiency() {
        return this.efficiency;
    }

    public Double getPowerWatt() {
        return this.powerWatt;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public void setEfficiency(Double efficiency) {
        this.efficiency = efficiency;
    }

    public void setPowerWatt(Double powerWatt) {
        this.powerWatt = powerWatt;
    }
}