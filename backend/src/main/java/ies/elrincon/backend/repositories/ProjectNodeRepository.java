package ies.elrincon.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import ies.elrincon.backend.models.ProjectNode;

public interface ProjectNodeRepository extends JpaRepository<ProjectNode, Long> {
    List<ProjectNode> findByProjectId(Long projectId);

    List<ProjectNode> findByElementId(Long elementId);

    Optional<ProjectNode> findByProjectIdAndId(Long projectId, Long id);
}
