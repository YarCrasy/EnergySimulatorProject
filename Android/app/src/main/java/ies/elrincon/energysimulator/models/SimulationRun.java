package ies.elrincon.energysimulator.models;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class SimulationRun {
    private Long id;
    private String createdAt;
    private String provider;
    private Double latitude;
    private Double longitude;
    private String timezone;
    private Integer durationDays;
    private Double tiltAngle;
    private Double azimuth;
    private Double totalGenerationKwh = 0d;
    private Double totalConsumptionKwh = 0d;
    private Double deficitKwh = 0d;
    private Double surplusKwh = 0d;
    private Double selfSufficiencyPercent = 0d;
    private boolean energyEnough;
    private final List<SimulationPoint> points = new ArrayList<>();

    public SimulationRun(JSONObject json) {
        if (json == null) return;
        id = readLong(json, "id");
        createdAt = readString(json, "createdAt");
        provider = readString(json, "provider");
        latitude = readDouble(json, "latitude", null);
        longitude = readDouble(json, "longitude", null);
        timezone = readString(json, "timezone");
        durationDays = readInteger(json, "durationDays");
        tiltAngle = readDouble(json, "tiltAngle", null);
        azimuth = readDouble(json, "azimuth", null);
        totalGenerationKwh = readDouble(json, "totalGenerationKwh", 0d);
        totalConsumptionKwh = readDouble(json, "totalConsumptionKwh", 0d);
        deficitKwh = readDouble(json, "deficitKwh", 0d);
        surplusKwh = readDouble(json, "surplusKwh", 0d);
        selfSufficiencyPercent = readDouble(json, "selfSufficiencyPercent", 0d);
        energyEnough = json.optBoolean("energyEnough", false);

        JSONArray pointsArray = json.optJSONArray("points");
        if (pointsArray != null) {
            for (int i = 0; i < pointsArray.length(); i++) {
                JSONObject point = pointsArray.optJSONObject(i);
                if (point != null) points.add(new SimulationPoint(point));
            }
        }
    }

    public Long getId() { return id; }
    public String getCreatedAt() { return createdAt; }
    public String getProvider() { return provider; }
    public Double getLatitude() { return latitude; }
    public Double getLongitude() { return longitude; }
    public String getTimezone() { return timezone; }
    public Integer getDurationDays() { return durationDays; }
    public Double getTiltAngle() { return tiltAngle; }
    public Double getAzimuth() { return azimuth; }
    public Double getTotalGenerationKwh() { return totalGenerationKwh; }
    public Double getTotalConsumptionKwh() { return totalConsumptionKwh; }
    public Double getDeficitKwh() { return deficitKwh; }
    public Double getSurplusKwh() { return surplusKwh; }
    public Double getSelfSufficiencyPercent() { return selfSufficiencyPercent; }
    public boolean isEnergyEnough() { return energyEnough; }
    public List<SimulationPoint> getPoints() { return points; }

    private static String readString(JSONObject json, String key) {
        return json.has(key) && !json.isNull(key) ? json.optString(key, null) : null;
    }

    private static Long readLong(JSONObject json, String key) {
        return json.has(key) && !json.isNull(key) ? json.optLong(key) : null;
    }

    private static Integer readInteger(JSONObject json, String key) {
        return json.has(key) && !json.isNull(key) ? json.optInt(key) : null;
    }

    private static Double readDouble(JSONObject json, String key, Double fallback) {
        return json.has(key) && !json.isNull(key) ? json.optDouble(key) : fallback;
    }
}
