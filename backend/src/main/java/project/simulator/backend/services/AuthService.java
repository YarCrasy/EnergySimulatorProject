package project.simulator.backend.services;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import project.simulator.backend.dto.auth.AuthResponse;
import project.simulator.backend.dto.auth.AuthenticatedUser;
import project.simulator.backend.dto.auth.LoginRequest;
import project.simulator.backend.dto.auth.RegisterRequest;
import project.simulator.backend.models.User;
import project.simulator.backend.repositories.UserRepository;
import project.simulator.backend.security.JwtService;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder legacyBcryptPasswordEncoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse login(LoginRequest credentials) {
        String normalizedEmail = normalizeEmail(credentials.email());
        User user = userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> unauthorized());

        if (!isPasswordValid(user, credentials.password())) {
            throw unauthorized();
        }

        return toAuthResponse(user);
    }

    public AuthResponse register(RegisterRequest request) {
        String fullName = requireValue(request.fullName(), "El nombre completo es obligatorio");
        String normalizedEmail = normalizeEmail(request.email());
        String rawPassword = requireValue(request.password(), "La contraseña es obligatoria");

        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El email ya está registrado");
        }

        User user = new User();
        user.setFullName(fullName);
        user.setEmail(normalizedEmail);
        user.setDateOfBirth(request.dateOfBirth());
        user.setAdmin(false);
        user.setPasswordHash(passwordEncoder.encode(rawPassword));

        User savedUser = userRepository.save(user);
        return toAuthResponse(savedUser);
    }

    public String encodeIfNeeded(String rawOrHashedPassword) {
        String value = requireValue(rawOrHashedPassword, "La contraseña es obligatoria");
        if (isArgon2Hash(value)) {
            return value;
        }
        return passwordEncoder.encode(value);
    }

    private boolean isPasswordValid(User user, String rawPassword) {
        String raw = requireValue(rawPassword, "La contraseña es obligatoria");
        String storedPassword = user.getPasswordHash();
        if (storedPassword == null || storedPassword.isBlank()) {
            return false;
        }

        boolean valid = false;

        if (isArgon2Hash(storedPassword)) {
            valid = passwordEncoder.matches(raw, storedPassword);
        } else if (isBcryptHash(storedPassword)) {
            valid = legacyBcryptPasswordEncoder.matches(raw, storedPassword);
        } else {
            valid = storedPassword.equals(raw);
        }

        if (valid && !isArgon2Hash(storedPassword)) {
            user.setPasswordHash(passwordEncoder.encode(raw));
            userRepository.save(user);
        }

        return valid;
    }

    private AuthResponse toAuthResponse(User user) {
        String token = jwtService.generateToken(user);
        AuthenticatedUser authUser = new AuthenticatedUser(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getDateOfBirth(),
                user.isAdmin()
        );
        return new AuthResponse(token, "Bearer", authUser);
    }

    private String normalizeEmail(String email) {
        return requireValue(email, "El email es obligatorio").toLowerCase();
    }

    private String requireValue(String value, String message) {
        if (value == null || value.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
        }
        return value.trim();
    }

    private boolean isArgon2Hash(String passwordHash) {
        return passwordHash.startsWith("$argon2id$");
    }

    private boolean isBcryptHash(String passwordHash) {
        return passwordHash.startsWith("$2a$") || passwordHash.startsWith("$2b$") || passwordHash.startsWith("$2y$");
    }

    private ResponseStatusException unauthorized() {
        return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario o contraseña incorrectos");
    }
}
