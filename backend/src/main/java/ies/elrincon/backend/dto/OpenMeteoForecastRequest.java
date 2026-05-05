package ies.elrincon.backend.dto;

import java.time.LocalDate;

public record OpenMeteoForecastRequest(
        double latitude,
        double longitude,
        String timezone,
        LocalDate startDate,
        int forecastDays,
        double tiltAngle,
        double azimuth) {
}
