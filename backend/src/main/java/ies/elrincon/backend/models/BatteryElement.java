package ies.elrincon.backend.models;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "battery_elements")
@DiscriminatorValue("BATTERY_ELEMENT")
public class BatteryElement extends Element {

    private Double capacity;
    private Double initialCharge;
    private Double maxChargePower;
    private Double maxDischargePower;

    public BatteryElement() {
    }

    public BatteryElement(String name, Double capacity) {
        super(name);
        this.capacity = capacity;
    }

    public Double getCapacity() {
        return capacity;
    }

    public void setCapacity(Double capacity) {
        this.capacity = capacity;
    }

    public Double getInitialCharge() {
        return initialCharge;
    }

    public void setInitialCharge(Double initialCharge) {
        this.initialCharge = initialCharge;
    }

    public Double getMaxChargePower() {
        return maxChargePower;
    }

    public void setMaxChargePower(Double maxChargePower) {
        this.maxChargePower = maxChargePower;
    }

    public Double getMaxDischargePower() {
        return maxDischargePower;
    }

    public void setMaxDischargePower(Double maxDischargePower) {
        this.maxDischargePower = maxDischargePower;
    }
}
