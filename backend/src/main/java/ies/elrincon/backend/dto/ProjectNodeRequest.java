package ies.elrincon.backend.dto;

public record ProjectNodeRequest(
        Long elementId,
        Float positionX,
        Float positionY,
        String type,
        Integer quantity,
        String data) {
}
