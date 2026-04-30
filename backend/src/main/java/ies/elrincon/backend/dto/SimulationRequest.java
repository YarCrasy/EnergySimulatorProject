package ies.elrincon.backend.dto;

public record SimulationRequest(
        Double latitude,
        Double longitude,
        String timezone,
        Integer durationDays,
        Double tiltAngle,
        Double azimuth,
        Double systemLossPercent) {
}
