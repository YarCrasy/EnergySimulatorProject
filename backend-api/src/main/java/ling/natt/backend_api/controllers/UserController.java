package ling.natt.backend_api.controllers;

import ling.natt.backend_api.models.User;
import ling.natt.backend_api.repositories.UserRepository;
import ling.natt.exception.ResourceNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*") // Permite solicitudes desde cualquier frontend
@RestController
@RequestMapping("/user")
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
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id " + id));
    }

    // Crear un nuevo usuario
    @PostMapping
    public User createUser(@RequestBody User user) {
        // Agregar mas atrde lógica para verificar si el email ya existe, etc.
        return userRepository.save(user);
    }

    // Actualizar un usuario existente
    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id " + id));

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
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id " + id));
        userRepository.deleteById(id);
        return user;
    }

    // Buscar usuarios por nombre completo que contenga un texto dado
    @GetMapping("/search")
    public List<User> searchUsersByFullName(@RequestParam String name) {
        return userRepository.findByFullNameContaining(name);
    }
}
