package ling.natt.backend_api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ling.natt.backend_api.models.Element;

@Repository
public interface ElementRepository extends JpaRepository<Element, Integer> {
}
