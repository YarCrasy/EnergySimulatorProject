package ling.natt.backend_api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import ling.natt.backend_api.models.Panel;

public interface PanelRepository extends JpaRepository<Panel, Integer> {

}
