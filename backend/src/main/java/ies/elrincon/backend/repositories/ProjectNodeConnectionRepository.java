package ies.elrincon.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import ies.elrincon.backend.models.ProjectNodeConnection;

public interface ProjectNodeConnectionRepository extends JpaRepository<ProjectNodeConnection, Long> {
    List<ProjectNodeConnection> findByProjectId(Long projectId);

    Optional<ProjectNodeConnection> findByProjectIdAndId(Long projectId, Long id);
}
