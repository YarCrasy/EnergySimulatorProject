package ling.natt.energysimulator.models;

public class ConsumElement extends Element {
    private Double powerConsumption;

    public ConsumElement(String name, Float x, Float y, Double powerConsumption) {
        super(name, x, y);
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