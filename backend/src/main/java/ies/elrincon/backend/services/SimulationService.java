package ies.elrincon.backend.services;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import ies.elrincon.backend.dto.OpenMeteoForecastRequest;
import ies.elrincon.backend.dto.SimulationRequest;
import ies.elrincon.backend.models.Element;
import ies.elrincon.backend.models.ConsumerElement;
import ies.elrincon.backend.models.GeneratorElement;
import ies.elrincon.backend.models.Project;
import ies.elrincon.backend.models.ProjectNode;
import ies.elrincon.backend.models.SimulationPoint;
import ies.elrincon.backend.models.SimulationRun;
import ies.elrincon.backend.repositories.ProjectNodeRepository;
import ies.elrincon.backend.repositories.ProjectRepository;
import ies.elrincon.backend.repositories.SimulationRunRepository;
import ies.elrincon.backend.services.OpenMeteoClient.OpenMeteoForecast;

@Service
public class SimulationService {

    private final ProjectRepository projectRepository;
    private final ProjectNodeRepository projectNodeRepository;
    private final SimulationRunRepository simulationRunRepository;
    private final OpenMeteoClient openMeteoClient;
    private final ObjectMapper objectMapper;

    public SimulationService(
            ProjectRepository projectRepository,
            ProjectNodeRepository projectNodeRepository,
            SimulationRunRepository simulationRunRepository,
            OpenMeteoClient openMeteoClient) {
        this.projectRepository = projectRepository;
        this.projectNodeRepository = projectNodeRepository;
        this.simulationRunRepository = simulationRunRepository;
        this.openMeteoClient = openMeteoClient;
        this.objectMapper = new ObjectMapper();
    }

    public SimulationRun simulate(Long projectId, SimulationRequest request) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Proyecto no encontrado con id " + projectId));

        double latitude = firstNonNull(request == null ? null : request.latitude(), project.getLatitude(), 28.1d);
        double longitude = firstNonNull(request == null ? null : request.longitude(), project.getLongitude(), -15.4d);
        String timezone = firstNonBlank(request == null ? null : request.timezone(), project.getTimezone(), "auto");
        LocalDate simulationDate = firstNonNull(request == null ? null : request.simulationDate(), project.getSimulationDate(), LocalDate.now());
        int durationDays = clamp(firstNonNull(request == null ? null : request.durationDays(), project.getDurationDays(), 1), 1, 16);
        double tiltAngle = firstNonNull(request == null ? null : request.tiltAngle(), project.getTiltAngle(), 30d);
        double azimuth = firstNonNull(request == null ? null : request.azimuth(), project.getAzimuth(), 0d);
        double systemLossPercent = clamp(
                firstNonNull(request == null ? null : request.systemLossPercent(), project.getSystemLossPercent(), 14d),
                0d,
                95d);

        OpenMeteoForecast forecast = openMeteoClient.fetchHourlyForecast(new OpenMeteoForecastRequest(
                latitude,
                longitude,
                timezone,
                simulationDate,
                durationDays,
                tiltAngle,
                azimuth));
        List<ProjectNode> nodes = projectNodeRepository.findByProjectId(projectId);

        SimulationRun run = new SimulationRun();
        run.setProject(project);
        run.setProvider("open-meteo");
        run.setLatitude(latitude);
        run.setLongitude(longitude);
        run.setTimezone(timezone);
        run.setDurationDays(durationDays);
        run.setTiltAngle(tiltAngle);
        run.setAzimuth(azimuth);

        double totalGenerationKwh = 0d;
        double totalConsumptionKwh = 0d;
        double deficitKwh = 0d;
        double surplusKwh = 0d;

        int hours = Math.min(forecast.times().size(), durationDays * 24);
        for (int index = 0; index < hours; index++) {
            boolean day = booleanAt(forecast.day(), index);
            double irradiance = day ? resolveIrradiance(forecast, index) : 0d;
            double cloudCover = valueAt(forecast.cloudCover(), index);
            double generationW = calculateGenerationW(nodes, irradiance, systemLossPercent);
            double consumptionW = calculateConsumptionW(nodes, index);
            double balanceW = generationW - consumptionW;
            double hourlyDeficitKwh = balanceW < 0 ? Math.abs(balanceW) / 1000d : 0d;
            double hourlySurplusKwh = balanceW > 0 ? balanceW / 1000d : 0d;

            SimulationPoint point = new SimulationPoint();
            point.setSimulationRun(run);
            point.setTimestamp(forecast.times().get(index));
            point.setGenerationW(round(generationW));
            point.setConsumptionW(round(consumptionW));
            point.setBalanceW(round(balanceW));
            point.setDeficitKwh(round(hourlyDeficitKwh));
            point.setSurplusKwh(round(hourlySurplusKwh));
            point.setCloudCover(round(cloudCover));
            point.setIrradiance(round(irradiance));
            point.setDay(day);
            run.getPoints().add(point);

            totalGenerationKwh += generationW / 1000d;
            totalConsumptionKwh += consumptionW / 1000d;
            deficitKwh += hourlyDeficitKwh;
            surplusKwh += hourlySurplusKwh;
        }

        run.setTotalGenerationKwh(round(totalGenerationKwh));
        run.setTotalConsumptionKwh(round(totalConsumptionKwh));
        run.setDeficitKwh(round(deficitKwh));
        run.setSurplusKwh(round(surplusKwh));
        run.setEnergyEnough(deficitKwh <= 0.001d);
        run.setSelfSufficiencyPercent(round(totalConsumptionKwh == 0d
                ? 100d
                : Math.min(100d, (totalGenerationKwh - surplusKwh) / totalConsumptionKwh * 100d)));

        project.setEnergyEnough(run.isEnergyEnough());
        project.setEnergyNeeded((float) round(Math.max(0d, deficitKwh)));
        projectRepository.save(project);
        return simulationRunRepository.save(run);
    }

    public SimulationRun getLatest(Long projectId) {
        if (!projectRepository.existsById(projectId)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Proyecto no encontrado con id " + projectId);
        return simulationRunRepository.findFirstByProjectIdOrderByCreatedAtDesc(projectId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "No hay simulaciones para el proyecto " + projectId));
    }

    private double calculateGenerationW(List<ProjectNode> nodes, double irradiance, double systemLossPercent) {
        double lossFactor = 1d - (systemLossPercent / 100d);
        return nodes.stream()
                .filter(this::isGeneratorNode)
                .mapToDouble(node -> generationForNode(node, irradiance, lossFactor))
                .sum();
    }

    private double generationForNode(ProjectNode node, double irradiance, double lossFactor) {
        GeneratorElement generator = node.getElement() instanceof GeneratorElement generatorElement ? generatorElement : null;
        JsonNode data = parseNodeData(node);
        int quantity = nodeQuantity(node, data);
        double area = firstNonNull(readNumber(data, "area"), generator == null ? null : generator.getArea(), 0d);
        double efficiency = normalizeEfficiency(firstNonNull(readNumber(data, "efficiency"), generator == null ? null : generator.getEfficiency(), 0d));
        if (area > 0d && efficiency > 0d) return irradiance * area * efficiency * quantity * lossFactor;
        double peakPower = firstNonNull(readNumber(data, "powerWatt"), generator == null ? null : generator.getPowerWatt(), 0d);
        return peakPower * (irradiance / 1000d) * quantity * lossFactor;
    }

    private double calculateConsumptionW(List<ProjectNode> nodes, int hourIndex) {
        int hourOfDay = hourIndex % 24;
        return nodes.stream()
                .filter(this::isConsumerNode)
                .mapToDouble(node -> consumptionForNode(node, node.getElement() instanceof ConsumerElement consumer ? consumer : null, hourOfDay))
                .sum();
    }

    private double consumptionForNode(ProjectNode node, ConsumerElement consumer, int hourOfDay) {
        JsonNode data = parseNodeData(node);
        int quantity = nodeQuantity(node, data);
        Double dataBase = firstNonNull(
                readNumber(data, "baseConsumption"),
                readNumber(data, "powerConsumption"),
                readNumber(data, "powerWatt"));
        double base = firstNonNull(
                dataBase,
                consumer == null ? null : consumer.getBaseConsumption(),
                consumer == null ? null : consumer.getPowerConsumption(),
                0d);
        Double explicitPeak = firstNonNull(readNumber(data, "peakConsumption"), consumer == null ? null : consumer.getPeakConsumption());
        double peak = firstNonNull(explicitPeak, base, 0d);
        String profile = inferConsumerProfile(node, data, consumer);
        double factor = switch (profile) {
            case "HOME", "HOUSE", "VIVIENDA" ->
                    hourOfDay >= 0 && hourOfDay <= 5 ? 0.12d :
                    hourOfDay == 6 ? 0.3d :
                    hourOfDay >= 7 && hourOfDay <= 9 ? 0.9d :
                    hourOfDay >= 10 && hourOfDay <= 16 ? 0.28d :
                    hourOfDay == 17 ? 0.55d :
                    hourOfDay >= 18 && hourOfDay <= 22 ? 1d :
                    0.42d;
            case "RESIDENTIAL", "RESIDENTIAL_COMPLEX", "RESIDENCIAL" ->
                    hourOfDay >= 0 && hourOfDay <= 5 ? 0.22d :
                    hourOfDay >= 6 && hourOfDay <= 8 ? 0.55d :
                    hourOfDay >= 9 && hourOfDay <= 16 ? 0.4d :
                    hourOfDay >= 17 && hourOfDay <= 22 ? 0.85d :
                    0.35d;
            case "FACTORY", "INDUSTRY", "INDUSTRIAL", "FABRICA" ->
                    hourOfDay >= 7 && hourOfDay <= 19 ? 1d : 0.18d;
            case "EV", "EV_CHARGER", "EVENING", "CARGADOR_EV" ->
                    hourOfDay >= 18 && hourOfDay <= 23 ? 1d : 0.2d;
            case "SCHOOL", "CLASSROOM" -> hourOfDay >= 8 && hourOfDay <= 15 ? 1d : 0.25d;
            case "BUSINESS", "OFFICE" -> hourOfDay >= 9 && hourOfDay <= 18 ? 1d : 0.3d;
            default -> 1d;
        };

        // Si no hay curva base/pico definida, usamos la potencia disponible como referencia
        // y la modulamos por franja horaria para evitar un consumo plano 24/7.
        if (explicitPeak == null && dataBase != null) {
            return base * factor * quantity;
        }

        String normalizedProfile = profile
                .trim()
                .toUpperCase();
        if (peak <= base && !"CONSTANT".equals(normalizedProfile)) {
            peak = base * (1d + factor);
        }

        return (base + ((peak - base) * factor)) * quantity;
    }

    private String inferConsumerProfile(ProjectNode node, JsonNode data, ConsumerElement consumer) {
        String explicitProfile = firstNonBlank(readText(data, "profileType"), consumer == null ? null : consumer.getProfileType(), "");
        if (!explicitProfile.isBlank()) {
            return explicitProfile.trim().toUpperCase();
        }

        String text = classifyNodeType(node)
                + " "
                + firstNonBlank(readText(data, "label"), "")
                + " "
                + firstNonBlank(readText(data, "notes"), "");
        String normalized = text.toLowerCase();

        if (normalized.contains("house") || normalized.contains("home") || normalized.contains("hogar") || normalized.contains("vivienda")) {
            return "HOME";
        }
        if (normalized.contains("residential") || normalized.contains("residencial")) {
            return "RESIDENTIAL";
        }
        if (normalized.contains("factory") || normalized.contains("industrial") || normalized.contains("fabrica")) {
            return "FACTORY";
        }
        if (normalized.contains("school") || normalized.contains("classroom") || normalized.contains("colegio")) {
            return "SCHOOL";
        }
        if (normalized.contains("office") || normalized.contains("business") || normalized.contains("oficina")) {
            return "BUSINESS";
        }
        if (normalized.contains("ev") || normalized.contains("charger") || normalized.contains("cargador")) {
            return "EV";
        }
        return "CONSTANT";
    }

    private boolean isGeneratorNode(ProjectNode node) {
        if (node.getElement() instanceof GeneratorElement) return true;
        return classifyNodeType(node).contains("generator")
                || classifyNodeType(node).contains("generacion")
                || classifyNodeType(node).contains("solar")
                || classifyNodeType(node).contains("panel");
    }

    private boolean isConsumerNode(ProjectNode node) {
        if (node.getElement() instanceof ConsumerElement) return true;
        String type = classifyNodeType(node);
        return type.contains("consumer")
                || type.contains("consumo")
                || type.contains("carga")
                || type.contains("factory")
                || type.contains("resid");
    }

    private String classifyNodeType(ProjectNode node) {
        Element element = node.getElement();
        String category = element == null || element.getCategory() == null ? "" : element.getCategory();
        String className = element == null ? "" : element.getClass().getSimpleName();
        String nodeType = node.getType() == null ? "" : node.getType();
        return (nodeType + " " + category + " " + className).toLowerCase();
    }

    private double resolveIrradiance(OpenMeteoForecast forecast, int index) {
        double tilted = valueAt(forecast.tiltedIrradiance(), index);
        if (tilted > 0d) return tilted;
        return valueAt(forecast.shortwaveRadiation(), index);
    }

    private int nodeQuantity(ProjectNode node, JsonNode data) {
        Double dataQuantity = readNumber(data, "quantity");
        int quantity = node.getQuantity() == null ? 0 : node.getQuantity();
        if (quantity <= 0 && dataQuantity != null) quantity = dataQuantity.intValue();
        return Math.max(1, quantity <= 0 ? 1 : quantity);
    }

    private double normalizeEfficiency(Double efficiency) {
        if (efficiency == null) return 0d;
        return efficiency > 1d ? efficiency / 100d : efficiency;
    }

    private double valueAt(List<Double> values, int index) {
        return index < values.size() ? values.get(index) : 0d;
    }

    private JsonNode parseNodeData(ProjectNode node) {
        if (node.getData() == null || node.getData().isBlank()) return objectMapper.createObjectNode();
        try {
            JsonNode parsed = objectMapper.readTree(node.getData());
            return parsed != null && parsed.isObject() ? parsed : objectMapper.createObjectNode();
        } catch (Exception ignored) {
            return objectMapper.createObjectNode();
        }
    }

    private Double readNumber(JsonNode node, String fieldName) {
        JsonNode value = node == null ? null : node.get(fieldName);
        if (value == null || value.isNull()) return null;
        if (value.isNumber()) return value.asDouble();
        if (value.isTextual()) {
            try {
                return Double.parseDouble(value.asText());
            } catch (NumberFormatException ignored) {
                return null;
            }
        }
        return null;
    }

    private String readText(JsonNode node, String fieldName) {
        JsonNode value = node == null ? null : node.get(fieldName);
        if (value == null || value.isNull()) return null;
        return value.isTextual() ? value.asText() : null;
    }

    private boolean booleanAt(List<Boolean> values, int index) {
        return index < values.size() && Boolean.TRUE.equals(values.get(index));
    }

    @SafeVarargs
    private final <T> T firstNonNull(T... values) {
        for (T value : values) {
            if (value != null) return value;
        }
        return null;
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) return value;
        }
        return "auto";
    }

    private int clamp(int value, int min, int max) {
        return Math.max(min, Math.min(max, value));
    }

    private double clamp(double value, double min, double max) {
        return Math.max(min, Math.min(max, value));
    }

    private double round(double value) {
        return Math.round(value * 1000d) / 1000d;
    }
}
