package project.simulator.backend.dto.auth;

import java.time.LocalDate;

public record AuthenticatedUser(
        Long id,
        String fullName,
        String email,
        LocalDate dateOfBirth,
        boolean isAdmin
) {
}
