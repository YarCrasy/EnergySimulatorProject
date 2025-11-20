package ling.natt.backend_api.models;

import jakarta.persistence.*;

@Entity
@Table(name = "consum_elements")
public class ConsumElement extends Element {
    private Double powerConsumption;

    // constructores
    public ConsumElement() {
    }

    public ConsumElement(int id, String name, Float x, Float y, Double powerConsumption) {
        super(id, name, x, y);
        this.powerConsumption = powerConsumption;
    }

    // getters y setters
    public Double getPowerConsumption() {
        return this.powerConsumption;
    }

    public void setPowerConsumption(Double powerConsumption) {
        this.powerConsumption = powerConsumption;
    }
}