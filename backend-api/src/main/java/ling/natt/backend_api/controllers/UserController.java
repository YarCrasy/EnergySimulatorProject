package ling.natt.backend_api.controllers;

import ling.natt.backend_api.models.User;
import ling.natt.backend_api.repositories.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    // Obtener todos los usuarios
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Obtener un usuario por ID
    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .orElseThrow();
    }

    // Crear un nuevo usuario
    @PostMapping
    public User createUser(@RequestBody User user) {
        // Agregar mas atrde lógica para verificar si el email ya existe, etc.

        // verificar si el email ya existe
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está registrado");
        }
        return userRepository.save(user);
    }

    // Actualizar un usuario existente
    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow();

        user.setFullName(userDetails.getFullName());
        user.setEmail(userDetails.getEmail());
        user.setDateOfBirth(userDetails.getDateOfBirth());
        user.setPasswordHash(userDetails.getPasswordHash());
        user.setAdmin(userDetails.isAdmin());

        return userRepository.save(user);
    }

    // Eliminar un usuario
    @DeleteMapping("/{id}")
    public User deleteUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow();
        userRepository.deleteById(id);
        return user;
    }

    // Buscar usuarios por nombre completo que contenga un texto dado
    @GetMapping("/search")
    public List<User> searchUsersByFullName(@RequestParam String name) {
        return userRepository.findByFullNameContaining(name);
    }

    // para hacer login
    @PostMapping("/login")
    public User login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario o contraseña incorrectos"));

        if (!user.getPasswordHash().equals(password)) {
            throw new RuntimeException("Usuario o contraseña incorrectos");
        }

        return user;
    }

}
