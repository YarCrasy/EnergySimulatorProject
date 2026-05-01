package ies.elrincon.backend.dto;

public record ProjectSeed(
        String name,
        Float energyNeeded,
        Boolean energyEnough,
        Long userId) {
}
