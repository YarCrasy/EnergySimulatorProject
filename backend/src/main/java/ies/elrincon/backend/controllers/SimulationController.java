package ies.elrincon.backend.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ies.elrincon.backend.dto.SimulationRequest;
import ies.elrincon.backend.models.SimulationRun;
import ies.elrincon.backend.services.SimulationService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/projects/{projectId}/simulations")
public class SimulationController {

    private final SimulationService simulationService;

    public SimulationController(SimulationService simulationService) {
        this.simulationService = simulationService;
    }

    @PostMapping
    public SimulationRun runSimulation(
            @PathVariable Long projectId,
            @RequestBody(required = false) SimulationRequest request) {
        return simulationService.simulate(projectId, request);
    }

    @GetMapping("/latest")
    public SimulationRun getLatestSimulation(@PathVariable Long projectId) {
        return simulationService.getLatest(projectId);
    }
}
