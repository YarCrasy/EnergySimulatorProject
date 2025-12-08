package ling.natt.backend_api.repositories;

import ling.natt.backend_api.models.ProjectNode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectNodeRepository extends JpaRepository<ProjectNode, Long> {
    List<ProjectNode> findByProjectId(Long projectId);

    List<ProjectNode> findByElementId(Long elementId);
}
