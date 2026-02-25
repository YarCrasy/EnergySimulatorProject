package project.simulator.backend.dto.auth;

public record AuthResponse(
        String token,
        String tokenType,
        AuthenticatedUser user
) {
}
