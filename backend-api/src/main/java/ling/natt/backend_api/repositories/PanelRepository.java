package ling.natt.backend_api.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import ling.natt.backend_api.models.Panel;

<<<<<<< HEAD
public interface PanelRepository extends JpaRepository<Panel, Integer> {

=======
public interface PanelRepository extends JpaRepository<Panel, Long> {
    List<Panel> findByProjectId(Long projectId);
>>>>>>> 6bf01e1 (Revision de modelos, repositorios y controladores + control de exceptiones basico)
}
