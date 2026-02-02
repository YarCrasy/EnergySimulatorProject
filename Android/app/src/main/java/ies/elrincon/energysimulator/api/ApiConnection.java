package ies.elrincon.energysimulator.api;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class ApiConnection {
    public final static String BASE_URL = "https://damt-project.yarcrasy.com/api/";

    private static String buildUrl(String endpoint) {
        String normalized = endpoint == null ? "" : endpoint.trim();
        if (normalized.startsWith("/")) normalized = normalized.substring(1);
        return BASE_URL + normalized;
    }

    private static String request(String method, String endpoint, JSONObject payload) throws IOException {
        HttpURLConnection conn = (HttpURLConnection) new URL(buildUrl(endpoint)).openConnection();
        conn.setRequestMethod(method);
        conn.setRequestProperty("Accept", "application/json");
        conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
        conn.setConnectTimeout(10000);
        conn.setReadTimeout(10000);
        if (payload != null) {
            conn.setDoOutput(true);
            byte[] body = payload.toString().getBytes(StandardCharsets.UTF_8);
            conn.setFixedLengthStreamingMode(body.length);
            try (OutputStream os = conn.getOutputStream()) {
                os.write(body);
            }
        }

        int statusCode = conn.getResponseCode();
        InputStream stream = statusCode >= HttpURLConnection.HTTP_BAD_REQUEST ? conn.getErrorStream() : conn.getInputStream();
        if (stream == null) {
            conn.disconnect();
            throw new IOException("No response stream (HTTP " + statusCode + ")");
        }

        StringBuilder sb = new StringBuilder();
        try (BufferedReader br = new BufferedReader(new InputStreamReader(stream, StandardCharsets.UTF_8))) {
            String line;
            while ((line = br.readLine()) != null) sb.append(line);
        } finally {
            conn.disconnect();
        }

        if (statusCode >= HttpURLConnection.HTTP_BAD_REQUEST) {
            throw new IOException("HTTP " + statusCode + ": " + sb);
        }
        return sb.toString();
    }

    public static JSONObject getObject(String endpoint) throws IOException, JSONException {
        return new JSONObject(request("GET", endpoint, null));
    }

    public static JSONArray getArray(String endpoint) throws IOException, JSONException {
        return new JSONArray(request("GET", endpoint, null));
    }

    public static void put(String endpoint, JSONObject data) throws IOException {
        request("PUT", endpoint, data);
    }

    public static JSONObject post(String endpoint, JSONObject data) throws IOException, JSONException {
        return new JSONObject(request("POST", endpoint, data));
    }

    public static JSONObject delete(String endpoint) throws IOException, JSONException {
        return new JSONObject(request("DELETE", endpoint, null));
    }
}
