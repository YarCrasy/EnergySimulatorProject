package ies.elrincon.backend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import ies.elrincon.backend.models.SimulationRun;

public interface SimulationRunRepository extends JpaRepository<SimulationRun, Long> {
    Optional<SimulationRun> findFirstByProjectIdOrderByCreatedAtDesc(Long projectId);
}
