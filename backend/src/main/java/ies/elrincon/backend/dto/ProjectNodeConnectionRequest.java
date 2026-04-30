package ies.elrincon.backend.dto;

public record ProjectNodeConnectionRequest(
        Long sourceNodeId,
        Long targetNodeId,
        String connectionType) {
}
