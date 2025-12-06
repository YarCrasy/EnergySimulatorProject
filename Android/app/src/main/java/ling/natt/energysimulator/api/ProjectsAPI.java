package ling.natt.energysimulator.api;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

import ling.natt.energysimulator.models.Project;

public class ProjectsAPI {

    public static Project createProject(Long userId, Project project) throws JSONException, IOException {
        if (userId == null) throw new IllegalArgumentException("userId requerido");
        JSONObject response = ApiConnection.post("projects?userId=" + userId, project.toJSON());
        return new Project(response);
    }
}
