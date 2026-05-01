package ies.elrincon.backend.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ies.elrincon.backend.models.BatteryElement;
import ies.elrincon.backend.repositories.BatteryElementRepository;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/battery-elements")
public class BatteryElementController {

    private final BatteryElementRepository batteryElementRepository;

    public BatteryElementController(BatteryElementRepository batteryElementRepository) {
        this.batteryElementRepository = batteryElementRepository;
    }

    @GetMapping
    public List<BatteryElement> getAllBatteryElements() {
        return batteryElementRepository.findAll();
    }

    @GetMapping("/{id}")
    public BatteryElement getBatteryElementById(@PathVariable Long id) {
        return batteryElementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("BatteryElement not found with id " + id));
    }

    @PostMapping
    public BatteryElement createBatteryElement(@RequestBody BatteryElement batteryElement) {
        return batteryElementRepository.save(batteryElement);
    }

    @PutMapping("/{id}")
    public BatteryElement updateBatteryElement(@PathVariable Long id, @RequestBody BatteryElement details) {
        return batteryElementRepository.findById(id)
                .map(element -> {
                    element.setName(details.getName());
                    element.setCategory(details.getCategory());
                    element.setDescription(details.getDescription());
                    element.setImageUrl(details.getImageUrl());
                    element.setCapacity(details.getCapacity());
                    element.setInitialCharge(details.getInitialCharge());
                    element.setMaxChargePower(details.getMaxChargePower());
                    element.setMaxDischargePower(details.getMaxDischargePower());
                    return batteryElementRepository.save(element);
                })
                .orElseThrow(() -> new RuntimeException("BatteryElement not found with id " + id));
    }

    @DeleteMapping("/{id}")
    public void deleteBatteryElement(@PathVariable Long id) {
        if (!batteryElementRepository.existsById(id)) throw new RuntimeException("BatteryElement not found with id " + id);
        batteryElementRepository.deleteById(id);
    }
}
