package ling.natt.backend_api.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import ling.natt.backend_api.models.ConsumElement;

public interface ConsumElementRepository extends JpaRepository<ConsumElement, Long> {
    List<ConsumElement> findByProjectId(Long projectId);
}
