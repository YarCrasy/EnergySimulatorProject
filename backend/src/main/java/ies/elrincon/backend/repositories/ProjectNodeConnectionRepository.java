package ies.elrincon.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import ies.elrincon.backend.models.ProjectNodeConnection;

public interface ProjectNodeConnectionRepository extends JpaRepository<ProjectNodeConnection, Long> {
    List<ProjectNodeConnection> findByProjectId(Long projectId);
}
