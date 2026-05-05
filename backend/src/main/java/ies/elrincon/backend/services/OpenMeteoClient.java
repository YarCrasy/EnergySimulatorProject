package ies.elrincon.backend.services;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import ies.elrincon.backend.dto.OpenMeteoForecastRequest;

@Service
public class OpenMeteoClient {

    private static final String FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public OpenMeteoClient() {
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(8))
                .build();
        this.objectMapper = new ObjectMapper();
    }

    public OpenMeteoForecast fetchHourlyForecast(OpenMeteoForecastRequest forecastRequest) {
        String resolvedTimezone = (forecastRequest.timezone() == null || forecastRequest.timezone().isBlank())
                ? "auto"
                : forecastRequest.timezone();
        int resolvedDays = Math.max(1, Math.min(forecastRequest.forecastDays(), 16));
        URI uri = URI.create(FORECAST_URL
                + "?latitude=" + forecastRequest.latitude()
                + "&longitude=" + forecastRequest.longitude()
                + "&hourly=shortwave_radiation,direct_radiation,diffuse_radiation,direct_normal_irradiance,global_tilted_irradiance,cloud_cover,is_day"
                + "&forecast_days=" + resolvedDays
                + "&tilt=" + forecastRequest.tiltAngle()
                + "&azimuth=" + forecastRequest.azimuth()
                + "&timezone=" + encode(resolvedTimezone));

        HttpRequest request = HttpRequest.newBuilder(uri)
                .timeout(Duration.ofSeconds(15))
                .GET()
                .build();

        try {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) throw new OpenMeteoException("Open-Meteo devolvio estado " + response.statusCode());
            return parseForecast(response.body());
        } catch (IOException exception) {
            throw new OpenMeteoException("No se pudo contactar con Open-Meteo", exception);
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new OpenMeteoException("La consulta a Open-Meteo fue interrumpida", exception);
        }
    }

    private OpenMeteoForecast parseForecast(String body) throws IOException {
        JsonNode root = objectMapper.readTree(body);
        JsonNode hourly = getNode(root, "hourly");
        List<String> times = toStringList(getNode(hourly, "time"));
        List<Double> shortwaveRadiation = toDoubleList(getNode(hourly, "shortwave_radiation"));
        List<Double> tiltedIrradiance = toDoubleList(getNode(hourly, "global_tilted_irradiance"));
        List<Double> directRadiation = toDoubleList(getNode(hourly, "direct_radiation"));
        List<Double> diffuseRadiation = toDoubleList(getNode(hourly, "diffuse_radiation"));
        List<Double> directNormalIrradiance = toDoubleList(getNode(hourly, "direct_normal_irradiance"));
        List<Double> cloudCover = toDoubleList(getNode(hourly, "cloud_cover"));
        List<Boolean> day = toBooleanList(getNode(hourly, "is_day"));
        return new OpenMeteoForecast(
                times,
                shortwaveRadiation,
                tiltedIrradiance,
                directRadiation,
                diffuseRadiation,
                directNormalIrradiance,
                cloudCover,
                day);
    }

    private JsonNode getNode(JsonNode parent, String fieldName) {
        JsonNode value = parent == null ? null : parent.get(fieldName);
        return value == null ? objectMapper.createArrayNode() : value;
    }

    private List<String> toStringList(JsonNode node) {
        List<String> values = new ArrayList<>();
        if (!node.isArray()) return values;
        node.forEach(value -> values.add(value.isNull() ? "" : value.asText("")));
        return values;
    }

    private List<Double> toDoubleList(JsonNode node) {
        List<Double> values = new ArrayList<>();
        if (!node.isArray()) return values;
        node.forEach(value -> values.add(value.isNumber() ? value.asDouble() : 0d));
        return values;
    }

    private List<Boolean> toBooleanList(JsonNode node) {
        List<Boolean> values = new ArrayList<>();
        if (!node.isArray()) return values;
        node.forEach(value -> {
            if (value.isNumber()) {
                values.add(value.asInt() == 1);
            } else if (value.isBoolean()) {
                values.add(value.asBoolean());
            } else {
                values.add(false);
            }
        });
        return values;
    }

    private String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }

    public record OpenMeteoForecast(
            List<String> times,
            List<Double> shortwaveRadiation,
            List<Double> tiltedIrradiance,
            List<Double> directRadiation,
            List<Double> diffuseRadiation,
            List<Double> directNormalIrradiance,
            List<Double> cloudCover,
            List<Boolean> day) {
    }

    public static class OpenMeteoException extends RuntimeException {
        public OpenMeteoException(String message) {
            super(message);
        }

        public OpenMeteoException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}
