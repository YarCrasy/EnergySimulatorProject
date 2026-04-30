package ies.elrincon.energysimulator.models;

import org.json.JSONObject;

public class SimulationPoint {
    private Long id;
    private String timestamp;
    private Double generationW = 0d;
    private Double consumptionW = 0d;
    private Double balanceW = 0d;
    private Double deficitKwh = 0d;
    private Double surplusKwh = 0d;
    private Double cloudCover = 0d;
    private Double irradiance = 0d;
    private boolean day;

    public SimulationPoint(JSONObject json) {
        if (json == null) return;
        id = readLong(json, "id");
        timestamp = readString(json, "timestamp");
        generationW = readDouble(json, "generationW", 0d);
        consumptionW = readDouble(json, "consumptionW", 0d);
        balanceW = readDouble(json, "balanceW", 0d);
        deficitKwh = readDouble(json, "deficitKwh", 0d);
        surplusKwh = readDouble(json, "surplusKwh", 0d);
        cloudCover = readDouble(json, "cloudCover", 0d);
        irradiance = readDouble(json, "irradiance", 0d);
        day = json.optBoolean("day", false);
    }

    public Long getId() { return id; }
    public String getTimestamp() { return timestamp; }
    public Double getGenerationW() { return generationW; }
    public Double getConsumptionW() { return consumptionW; }
    public Double getBalanceW() { return balanceW; }
    public Double getDeficitKwh() { return deficitKwh; }
    public Double getSurplusKwh() { return surplusKwh; }
    public Double getCloudCover() { return cloudCover; }
    public Double getIrradiance() { return irradiance; }
    public boolean isDay() { return day; }

    private static String readString(JSONObject json, String key) {
        return json.has(key) && !json.isNull(key) ? json.optString(key, null) : null;
    }

    private static Long readLong(JSONObject json, String key) {
        return json.has(key) && !json.isNull(key) ? json.optLong(key) : null;
    }

    private static Double readDouble(JSONObject json, String key, Double fallback) {
        return json.has(key) && !json.isNull(key) ? json.optDouble(key) : fallback;
    }
}
