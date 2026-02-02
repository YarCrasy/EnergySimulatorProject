package ies.elrincon.energysimulator.api;

import java.io.IOException;
import java.util.ArrayList;
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

    public static User register(String email, String password) throws JSONException, IOException {
        if (email == null || email.isBlank()) throw new IllegalArgumentException("email requerido");
        if (password == null || password.isBlank()) throw new IllegalArgumentException("password requerido");

        JSONObject payload = new JSONObject();
        payload.put("fullName", "User");
        payload.put("email", email);
        payload.put("passwordHash", password);
        payload.put("dateOfBirth", JSONObject.NULL);
        payload.put("admin", false);

        JSONObject response = ApiConnection.post("users", payload);
        User createdUser = new User(response);
        if (createdUser.getId() != null) {
            String generatedName = "User" + createdUser.getId();
            if (!generatedName.equals(createdUser.getFullName())) {
                createdUser.setFullName(generatedName);
                updateUser(createdUser);
            }
        }
        return createdUser;
    }

    public static User login(String email, String password) throws JSONException, IOException {
        JSONObject loginObject = new JSONObject();
        loginObject.put("email", email);
        loginObject.put("password", password);
        JSONObject response = ApiConnection.post("users/login", loginObject);
        JSONObject userPayload = response.has("user") ? response.getJSONObject("user") : response;
        return new User(userPayload);
    }
}

