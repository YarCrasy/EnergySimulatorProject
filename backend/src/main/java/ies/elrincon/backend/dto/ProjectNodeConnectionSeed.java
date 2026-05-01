package ies.elrincon.backend.dto;

import ies.elrincon.backend.models.Project;
import ies.elrincon.backend.models.ProjectNode;

public record ProjectNodeConnectionSeed(
        Project project,
        ProjectNode source,
        ProjectNode target,
        String connectionType) {
}
