package project.simulator.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import project.simulator.backend.models.GeneratorElement;

public interface GeneratorElementRepository extends JpaRepository<GeneratorElement, Long> {
}
