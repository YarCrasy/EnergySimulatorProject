package project.simulator.backend.dto.auth;

import java.time.LocalDate;

public record RegisterRequest(
        String fullName,
        String email,
        String password,
        LocalDate dateOfBirth
) {
}
