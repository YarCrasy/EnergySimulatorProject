package project.simulator.backend.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import project.simulator.backend.dto.auth.AuthResponse;
import project.simulator.backend.dto.auth.LoginRequest;
import project.simulator.backend.models.Project;
import project.simulator.backend.models.User;
import project.simulator.backend.repositories.ProjectRepository;
import project.simulator.backend.repositories.UserRepository;
import project.simulator.backend.services.AuthService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final AuthService authService;

    public UserController(UserRepository userRepository, ProjectRepository projectRepository, AuthService authService) {
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.authService = authService;
    }

    // Obtener todos los usuarios con filtros opcionales por nombre o email
    @GetMapping
    public List<User> getAllUsers(
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "email", required = false) String email) {

        if (name != null && !name.isBlank()) {
            return userRepository.findByFullNameContainingIgnoreCase(name.trim());
        }
        if (email != null && !email.isBlank()) {
            return userRepository.findByEmailContainingIgnoreCase(email.trim());
        }
        return userRepository.findAll();
    }

    // Obtener un usuario por ID
    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return findUserOrThrow(id);
    }

    // Crear un nuevo usuario
    @PostMapping
    public User createUser(@RequestBody User user) {
        String normalizedEmail = normalizeEmail(user.getEmail());
        ensureEmailAvailable(normalizedEmail, null);

        user.setEmail(normalizedEmail);
        user.setPasswordHash(authService.encodeIfNeeded(user.getPasswordHash()));
        return userRepository.save(user);
    }

    // Actualizar un usuario existente
    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        User user = findUserOrThrow(id);
        String normalizedEmail = normalizeEmail(userDetails.getEmail());
        ensureEmailAvailable(normalizedEmail, id);

        user.setFullName(userDetails.getFullName());
        user.setEmail(normalizedEmail);
        user.setDateOfBirth(userDetails.getDateOfBirth());
        if (userDetails.getPasswordHash() != null && !userDetails.getPasswordHash().isBlank()) {
            user.setPasswordHash(authService.encodeIfNeeded(userDetails.getPasswordHash()));
        }
        user.setAdmin(userDetails.isAdmin());

        return userRepository.save(user);
    }

    // Eliminar un usuario
    @DeleteMapping("/{id}")
    public User deleteUser(@PathVariable Long id) {
        User user = findUserOrThrow(id);
        userRepository.delete(user);
        return user;
    }

    // Buscar usuarios por nombre completo que contenga un texto dado
    @GetMapping("/search")
    public List<User> searchUsersByFullName(@RequestParam("name") String name) {
        return userRepository.findByFullNameContainingIgnoreCase(name);
    }

    // Endpoint legado compatible con la ruta anterior, ahora retorna JWT.
    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest credentials) {
        return authService.login(credentials);
    }

    @GetMapping("/{id}/projects")
    public List<Project> getProjectsByUserId(@PathVariable Long id) {
        findUserOrThrow(id);
        return projectRepository.findByUserId(id);
    }

    private void ensureEmailAvailable(String email, Long currentUserId) {
        Optional<User> existing = userRepository.findByEmailIgnoreCase(email);
        if (existing.isPresent() && !existing.get().getId().equals(currentUserId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El email ya está registrado");
        }
    }

    private String normalizeEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El email es obligatorio");
        }
        return email.trim().toLowerCase();
    }

    private User findUserOrThrow(Long id) {
        return userRepository.findById(id)
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado")
                );
    }
}
