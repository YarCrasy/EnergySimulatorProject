package ies.elrincon.backend.dto;

public record OpenMeteoForecastRequest(
        double latitude,
        double longitude,
        String timezone,
        int forecastDays,
        double tiltAngle,
        double azimuth) {
}
