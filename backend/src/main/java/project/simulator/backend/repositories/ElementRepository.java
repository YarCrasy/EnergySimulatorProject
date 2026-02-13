package project.simulator.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import project.simulator.backend.models.Element;

@Repository
public interface ElementRepository extends JpaRepository<Element, Long> {
}
