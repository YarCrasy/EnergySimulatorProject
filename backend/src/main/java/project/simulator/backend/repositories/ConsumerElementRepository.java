package project.simulator.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import project.simulator.backend.models.ConsumerElement;

public interface ConsumerElementRepository extends JpaRepository<ConsumerElement, Long> {
}