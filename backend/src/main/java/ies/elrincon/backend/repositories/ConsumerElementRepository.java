package ies.elrincon.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ies.elrincon.backend.models.ConsumerElement;

public interface ConsumerElementRepository extends JpaRepository<ConsumerElement, Long> {
}
