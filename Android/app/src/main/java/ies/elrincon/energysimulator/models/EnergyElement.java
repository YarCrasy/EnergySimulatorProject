package ies.elrincon.energysimulator.models;

import org.json.JSONObject;

public class EnergyElement {
    private Long id;
    private String name;
    private String category;
    private String description;
    private String imageUrl;
    private String elementType;
    private String brand;
    private Double area;
    private Double efficiency;
    private Double powerWatt;
    private Double powerConsumption;
    private Double baseConsumption;

    public EnergyElement() {
    }

    public EnergyElement(JSONObject json) {
        if (json == null) {
            return;
        }
        id = readLong(json, "id");
        name = readString(json, "name");
        category = readString(json, "category");
        description = readString(json, "description");
        imageUrl = readString(json, "imageUrl");
        elementType = readString(json, "elementType");
        brand = readString(json, "brand");
        area = readDouble(json, "area");
        efficiency = readDouble(json, "efficiency");
        powerWatt = readDouble(json, "powerWatt");
        powerConsumption = readDouble(json, "powerConsumption");
        baseConsumption = readDouble(json, "baseConsumption");
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getCategory() {
        return category;
    }

    public String getDescription() {
        return description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getElementType() {
        if (elementType != null && !elementType.isBlank()) {
            return elementType;
        }
        if (category != null && !category.isBlank()) {
            return category;
        }
        return "Elemento";
    }

    public String getBrand() {
        return brand;
    }

    public Double getArea() {
        return area;
    }

    public Double getEfficiency() {
        return efficiency;
    }

    public Double getPowerWatt() {
        return powerWatt;
    }

    public Double getPowerConsumption() {
        return powerConsumption;
    }

    public Double getBaseConsumption() {
        return baseConsumption;
    }

    public boolean isGenerator() {
        return powerWatt != null && powerWatt > 0;
    }

    public double getNominalPower() {
        if (powerWatt != null) {
            return powerWatt;
        }
        if (powerConsumption != null) {
            return powerConsumption;
        }
        if (baseConsumption != null) {
            return baseConsumption;
        }
        return 0d;
    }

    public String getPowerLabel() {
        double power = getNominalPower();
        return String.format(java.util.Locale.US, "%.0f W", power);
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setElementType(String elementType) {
        this.elementType = elementType;
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

    public void setBaseConsumption(Double baseConsumption) {
        this.baseConsumption = baseConsumption;
    }

    private static String readString(JSONObject json, String key) {
        if (!json.has(key) || json.isNull(key)) {
            return null;
        }
        return json.optString(key, null);
    }

    private static Long readLong(JSONObject json, String key) {
        if (!json.has(key) || json.isNull(key)) {
            return null;
        }
        return json.optLong(key);
    }

    private static Double readDouble(JSONObject json, String key) {
        if (!json.has(key) || json.isNull(key)) {
            return null;
        }
        return json.optDouble(key);
    }
}
