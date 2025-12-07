package ling.natt.energysimulator.api;

import java.io.IOException;
import java.util.ArrayList;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import ling.natt.energysimulator.models.User;

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

    public static User login(String email, String password) throws JSONException, IOException {
        JSONObject loginObject = new JSONObject();
        loginObject.put("email", email);
        loginObject.put("password", password);
        JSONObject response = ApiConnection.post("users/login", loginObject);
        JSONObject userPayload = response.has("user") ? response.getJSONObject("user") : response;
        return new User(userPayload);
    }
}
