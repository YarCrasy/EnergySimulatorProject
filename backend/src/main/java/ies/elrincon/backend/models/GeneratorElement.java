package ies.elrincon.backend.models;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "generator_elements")
@DiscriminatorValue("GENERATOR_ELEMENT")
public class GeneratorElement extends Element {
    private String brand;
    private Double area;
    private Double efficiency;
    private Double powerWatt;

    // constructores
    public GeneratorElement() {
    }

    public GeneratorElement(String name, String brand, Double efficiency, Double powerWatt) {
        super(name);
        this.brand = brand;
        this.efficiency = efficiency;
        this.powerWatt = powerWatt;
    }

    // getters y setters
    public String getBrand() {
        return this.brand;
    }

    public Double getArea() {
        return this.area;
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

    public void setArea(Double area) {
        this.area = area;
    }

    public void setEfficiency(Double efficiency) {
        this.efficiency = efficiency;
    }

    public void setPowerWatt(Double powerWatt) {
        this.powerWatt = powerWatt;
    }
}
