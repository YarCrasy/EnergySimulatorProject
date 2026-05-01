package ies.elrincon.backend.controllers;

import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import ies.elrincon.backend.models.BatteryElement;
import ies.elrincon.backend.models.ConsumerElement;
import ies.elrincon.backend.models.Element;
import ies.elrincon.backend.models.GeneratorElement;
import ies.elrincon.backend.repositories.BatteryElementRepository;
import ies.elrincon.backend.repositories.ConsumerElementRepository;
import ies.elrincon.backend.repositories.ElementRepository;
import ies.elrincon.backend.repositories.GeneratorElementRepository;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/elements")
public class ElementController {

    @Autowired
    private ElementRepository elementRepository;

    @Autowired
    private GeneratorElementRepository generatorElementRepository;

    @Autowired
    private ConsumerElementRepository consumerElementRepository;

    @Autowired
    private BatteryElementRepository batteryElementRepository;

    @GetMapping
    public List<Element> getAllElements() {
        return elementRepository.findAll();
    }

    @PostMapping
    public Element createElement(@RequestBody Map<String, Object> elementData) {
        String type = readText(elementData, "elementType", "type", "category").toLowerCase(Locale.ROOT);

        if (type.contains("generator")) {
            GeneratorElement element = new GeneratorElement();
            applyCommonFields(element, elementData);
            element.setBrand(readText(elementData, "brand"));
            element.setArea(readDouble(elementData, "area"));
            element.setEfficiency(readDouble(elementData, "efficiency"));
            element.setPowerWatt(readDouble(elementData, "powerWatt", "power"));
            return generatorElementRepository.save(element);
        } 
        else if (type.contains("consumer")) {
            ConsumerElement element = new ConsumerElement();
            applyCommonFields(element, elementData);
            element.setPowerConsumption(readDouble(elementData, "powerConsumption", "powerWatt", "power"));
            element.setBaseConsumption(readDouble(elementData, "baseConsumption"));
            element.setPeakConsumption(readDouble(elementData, "peakConsumption"));
            String profileType = readText(elementData, "profileType");
            if (!profileType.isBlank()) element.setProfileType(profileType);
            return consumerElementRepository.save(element);
        } 
        else if (type.contains("battery")) {
            BatteryElement element = new BatteryElement();
            applyCommonFields(element, elementData);
            element.setCapacity(readDouble(elementData, "capacity"));
            element.setInitialCharge(readDouble(elementData, "initialCharge"));
            element.setMaxChargePower(readDouble(elementData, "maxChargePower"));
            element.setMaxDischargePower(readDouble(elementData, "maxDischargePower"));
            return batteryElementRepository.save(element);
        }

        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "elementType debe ser generator, consumer o battery");
    }

    private void applyCommonFields(Element element, Map<String, Object> data) {
        element.setName(readText(data, "name"));
        element.setCategory(readText(data, "category", "elementType", "type"));
        element.setDescription(readText(data, "description"));
        element.setImageUrl(readText(data, "imageUrl"));
    }

    private String readText(Map<String, Object> data, String... fieldNames) {
        for (String fieldName : fieldNames) {
            Object value = data.get(fieldName);
            if (value instanceof String text && !text.isBlank()) return text.trim();
        }
        return "";
    }

    private Double readDouble(Map<String, Object> data, String... fieldNames) {
        for (String fieldName : fieldNames) {
            Object value = data.get(fieldName);
            if (value instanceof Number number) return number.doubleValue();
            if (value instanceof String text && !text.isBlank()) {
                try {
                    return Double.parseDouble(text);
                } catch (NumberFormatException ignored) {
                    return null;
                }
            }
        }
        return null;
    }
}
