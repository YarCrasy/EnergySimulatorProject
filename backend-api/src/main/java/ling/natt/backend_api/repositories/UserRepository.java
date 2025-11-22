package ling.natt.backend_api.repositories;

import ling.natt.backend_api.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Buscar usuario por email, si existe
    Optional<User> findByEmail(String email);

    // Buscar usuarios cuyo nombre completo contenga un texto
    List<User> findByFullNameContaining(String fullName);
}
