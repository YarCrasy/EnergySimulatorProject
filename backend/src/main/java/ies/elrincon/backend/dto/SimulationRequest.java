package ies.elrincon.backend.dto;

import java.time.LocalDate;

public record SimulationRequest(
        Double latitude,
        Double longitude,
        String timezone,
        LocalDate simulationDate,
        Integer durationDays,
        Double tiltAngle,
        Double azimuth,
        Double systemLossPercent) {
}
