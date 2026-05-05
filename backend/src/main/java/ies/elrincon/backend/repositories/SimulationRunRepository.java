package ies.elrincon.backend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import ies.elrincon.backend.models.SimulationRun;

public interface SimulationRunRepository extends JpaRepository<SimulationRun, Long> {
    Optional<SimulationRun> findFirstByProjectIdOrderByCreatedAtDesc(Long projectId);

    @Transactional
    void deleteByProjectId(Long projectId);
}
