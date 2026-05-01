package ies.elrincon.backend.dto;

import ies.elrincon.backend.models.GeneratorElement;
import ies.elrincon.backend.models.ProjectNode;

public record GenerationCalculationRequest(
        ProjectNode node,
        GeneratorElement generator,
        double irradiance,
        double lossFactor) {
}
