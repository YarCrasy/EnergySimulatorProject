package ling.natt.backend_api.repositories;

import ling.natt.backend_api.models.ProjectElement;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProjectElementRepository extends JpaRepository<ProjectElement, Long> {
    List<ProjectElement> findByProjectId(Long projectId);

    List<ProjectElement> findByElementId(Long elementId);
}
