package ling.natt.backend_api.repositories;

import ling.natt.backend_api.models.GeneratorElement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GeneratorElementRepository extends JpaRepository<GeneratorElement, Long> {
}
