package ling.natt.backend_api.repositories;

import ling.natt.backend_api.models.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Integer> {
    List<Project> findByNameContaining(String name);
    List<Project> findByUserId(int userId);
}
