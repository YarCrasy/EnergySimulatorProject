package ling.natt.backend_api.repositories;

import ling.natt.backend_api.models.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    // Buscar proyectos cuyo nombre contenga un texto
    List<Project> findByNameContaining(String name);

    // Buscar proyectos por el ID del usuario asociado
    List<Project> findByUser_Id(Long userId);
}
