package ling.natt.backend_api.repositories;

import ling.natt.backend_api.models.ProjectNodeConnection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectNodeConnectionRepository extends JpaRepository<ProjectNodeConnection, Long> {
    List<ProjectNodeConnection> findByProjectId(Long projectId);
}
