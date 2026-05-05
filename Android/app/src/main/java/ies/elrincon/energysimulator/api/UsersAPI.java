package ies.elrincon.energysimulator.api;

import java.io.IOException;
import java.util.ArrayList;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import ies.elrincon.energysimulator.models.User;

public class UsersAPI {
    public static ArrayList<User> getUsers() throws JSONException, IOException {
        ArrayList<User> users = new ArrayList<>();
        JSONArray usersArray = ApiConnection.getArray("users");
        for (int i = 0; i < usersArray.length(); i++) {
            JSONObject userObject = usersArray.getJSONObject(i);
            users.add(new User(userObject));
        }
        return users;
    }
    public static User getUser(String id) throws JSONException, IOException {
        JSONObject userObject = ApiConnection.getObject("users/" + id);
        return new User(userObject);
    }
    public static void updateUser(User user) throws JSONException, IOException {
        ApiConnection.put("users/" + user.getId(), user.toJSON());
    }
    public static void deleteUser(Long userId) throws JSONException, IOException {
        if (userId == null) throw new IllegalArgumentException("userId requerido");
        ApiConnection.delete("users/" + userId);
    }

    public static User register(String fullName, String dateOfBirth, String email, String password) throws JSONException, IOException {
        if (email == null || email.isBlank()) throw new IllegalArgumentException("email requerido");
        if (password == null || password.isBlank()) throw new IllegalArgumentException("password requerido");
        if (fullName == null || fullName.isBlank()) throw new IllegalArgumentException("nombre requerido");

        JSONObject payload = new JSONObject();
        payload.put("fullName", fullName);
        payload.put("email", email);
        payload.put("passwordHash", password);
        payload.put("dateOfBirth", dateOfBirth == null || dateOfBirth.isBlank() ? JSONObject.NULL : normalizeDateOfBirth(dateOfBirth));
        payload.put("admin", false);

        JSONObject response = ApiConnection.post("users", payload);
        String token = readToken(response);
        ApiConnection.setBearerToken(token);
        JSONObject userPayload = response.has("user") ? response.getJSONObject("user") : response;
        User user = new User(userPayload);
        user.setAuthToken(token);
        return user;
    }

    public static User login(String email, String password) throws JSONException, IOException {
        JSONObject loginObject = new JSONObject();
        loginObject.put("email", email);
        loginObject.put("password", password);
        JSONObject response = ApiConnection.post("users/login", loginObject);
        String token = readToken(response);
        ApiConnection.setBearerToken(token);
        JSONObject userPayload = response.has("user") ? response.getJSONObject("user") : response;
        User user = new User(userPayload);
        user.setAuthToken(token);
        return user;
    }

    private static String readToken(JSONObject response) {
        if (response == null) return null;
        String[] keys = {"token", "accessToken", "jwt"};
        for (String key : keys) {
            if (response.has(key) && !response.isNull(key)) {
                return response.optString(key, null);
            }
        }
        return null;
    }

    private static String normalizeDateOfBirth(String rawDate) throws IOException {
        if (rawDate == null || rawDate.isBlank()) {
            return null;
        }

        DateTimeFormatter[] inputFormats = new DateTimeFormatter[] {
                DateTimeFormatter.ISO_LOCAL_DATE,
                DateTimeFormatter.ofPattern("d/M/yyyy"),
                DateTimeFormatter.ofPattern("d-M-yyyy"),
                DateTimeFormatter.ofPattern("d.M.yyyy")
        };

        for (DateTimeFormatter formatter : inputFormats) {
            try {
                LocalDate parsed = LocalDate.parse(rawDate, formatter);
                return parsed.format(DateTimeFormatter.ISO_LOCAL_DATE);
            } catch (DateTimeParseException ignored) {
            }
        }

        throw new IOException("Formato de fecha inválido: " + rawDate + ". Use yyyy-MM-dd o dd/MM/yyyy.");
    }
}

