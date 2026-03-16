package project.simulator.backend.models;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "consumer_elements")
@DiscriminatorValue("CONSUMER_ELEMENT")
public class ConsumerElement extends Element {

    private Double powerConsumption;
    private Double baseConsumption;

    public ConsumerElement() {
    }

    public ConsumerElement(String name, Double powerConsumption) {
        super(name);
        this.powerConsumption = powerConsumption;
    }

    public Double getPowerConsumption() {
        return this.powerConsumption != null ? this.powerConsumption : this.baseConsumption;
    }

    public Double getBaseConsumption() {
        return this.baseConsumption != null ? this.baseConsumption : this.powerConsumption;
    }

    public void setPowerConsumption(Double powerConsumption) {
        this.powerConsumption = powerConsumption;
        if (this.baseConsumption == null) {
            this.baseConsumption = powerConsumption;
        }
    }

    public void setBaseConsumption(Double baseConsumption) {
        this.baseConsumption = baseConsumption;
        if (this.powerConsumption == null) {
            this.powerConsumption = baseConsumption;
        }
    }
}
