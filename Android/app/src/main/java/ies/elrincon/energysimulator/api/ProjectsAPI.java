package ies.elrincon.energysimulator.api;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.List;

import ies.elrincon.energysimulator.models.Project;
import ies.elrincon.energysimulator.models.SimulationRun;

public class ProjectsAPI {

    public static Project createProject(Long userId, Project project) throws JSONException, IOException {
        if (userId == null) throw new IllegalArgumentException("userId requerido");
        JSONObject response = ApiConnection.post("projects", project.toJSON());
        return new Project(response);
    }

    public static List<Project> getProjectsFromUser(Long userId) throws JSONException, IOException {
        if (userId == null) throw new IllegalArgumentException("userId requerido");
        JSONArray projectsArray = ApiConnection.getArray("projects/user/" + userId);
        return Project.fromJsonArray(projectsArray);
    }

    public static Project getProjectById(Long projectId) throws JSONException, IOException {
        if (projectId == null) throw new IllegalArgumentException("projectId requerido");
        JSONObject projectObject = ApiConnection.getObject("projects/" + projectId);
        return new Project(projectObject);
    }

    // Actualiza un proyecto (por ejemplo, cambiar el nombre). Devuelve el proyecto actualizado.
    public static Project updateProject(Long projectId, JSONObject data) throws IOException, JSONException {
        if (projectId == null) throw new IllegalArgumentException("projectId requerido");
        // Ejecutar PUT con los datos
        ApiConnection.put("projects/" + projectId, data);
        // Recuperar el recurso actualizado (la API puede devolverlo en el PUT, pero aseguramos realizar un GET)
        JSONObject updated = ApiConnection.getObject("projects/" + projectId);
        return new Project(updated);
    }

    // Elimina un proyecto por id. Lanza IOException/JSONException si falla.
    public static boolean deleteProject(Long projectId) throws IOException, JSONException {
        if (projectId == null) throw new IllegalArgumentException("projectId requerido");
        // ApiConnection.delete devuelve un JSONObject con la respuesta; si no lanza excepción, consideramos éxito
        ApiConnection.delete("projects/" + projectId);
        return true;
    }

    public static SimulationRun runOpenMeteoSimulation(Long projectId) throws JSONException, IOException {
        if (projectId == null) throw new IllegalArgumentException("projectId requerido");
        JSONObject response = ApiConnection.post("projects/" + projectId + "/simulations", new JSONObject());
        return new SimulationRun(response);
    }

    public static SimulationRun getLatestSimulation(Long projectId) throws JSONException, IOException {
        if (projectId == null) throw new IllegalArgumentException("projectId requerido");
        JSONObject response = ApiConnection.getObject("projects/" + projectId + "/simulations/latest");
        return new SimulationRun(response);
    }
}

