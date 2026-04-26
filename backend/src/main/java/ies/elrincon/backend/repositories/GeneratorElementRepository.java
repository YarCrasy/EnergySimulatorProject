package ies.elrincon.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import ies.elrincon.backend.models.GeneratorElement;

public interface GeneratorElementRepository extends JpaRepository<GeneratorElement, Long> {
}
