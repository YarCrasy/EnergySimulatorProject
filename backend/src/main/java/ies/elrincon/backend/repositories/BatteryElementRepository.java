package ies.elrincon.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import ies.elrincon.backend.models.BatteryElement;

public interface BatteryElementRepository extends JpaRepository<BatteryElement, Long> {
}
