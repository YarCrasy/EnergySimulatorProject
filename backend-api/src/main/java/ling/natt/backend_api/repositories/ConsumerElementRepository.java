package ling.natt.backend_api.repositories;

import ling.natt.backend_api.models.ConsumerElement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConsumerElementRepository extends JpaRepository<ConsumerElement, Long> {
}