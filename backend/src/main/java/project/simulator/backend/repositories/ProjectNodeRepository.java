package project.simulator.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import project.simulator.backend.models.ProjectNode;

public interface ProjectNodeRepository extends JpaRepository<ProjectNode, Long> {
    List<ProjectNode> findByProjectId(Long projectId);

    List<ProjectNode> findByElementId(Long elementId);
}
