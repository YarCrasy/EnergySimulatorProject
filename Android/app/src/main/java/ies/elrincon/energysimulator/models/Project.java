package ies.elrincon.energysimulator.models;

import static java.time.LocalDateTime.now;

import android.os.Parcel;
import android.os.Parcelable;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class Project implements Parcelable {

    private Long id;
    private String name;
    private LocalDateTime updatedAt;
    private boolean isEnergyEnough;
    private float energyNeeded;
    private Long userId;
    private String season = "verano";
    private Double latitude = 28.1;
    private List<ProjectNode> projectNodes = new ArrayList<>();

    public Project() {
        name = "Nuevo Proyecto";
        updatedAt = now();
        isEnergyEnough = false;
        energyNeeded = 0.0f;
    }

    public Project(JSONObject projectObject) throws JSONException {
        if (projectObject == null) return;
        if (projectObject.has("id") && !projectObject.isNull("id"))
            this.id = projectObject.getLong("id");
        if (projectObject.has("name") && !projectObject.isNull("name"))
            this.name = projectObject.getString("name");
        if (projectObject.has("updatedAt") && !projectObject.isNull("updatedAt")) {
            String updatedAtStr = projectObject.getString("updatedAt");
            this.updatedAt = LocalDateTime.parse(updatedAtStr);
        }
        if (projectObject.has("energyEnough") && !projectObject.isNull("energyEnough"))
            this.isEnergyEnough = projectObject.getBoolean("energyEnough");
        if (projectObject.has("isEnergyEnough") && !projectObject.isNull("isEnergyEnough"))
            this.isEnergyEnough = projectObject.getBoolean("isEnergyEnough");
        if (projectObject.has("energyNeeded") && !projectObject.isNull("energyNeeded"))
            this.energyNeeded = (float) projectObject.getDouble("energyNeeded");
        if (projectObject.has("userId") && !projectObject.isNull("userId"))
            this.userId = projectObject.getLong("userId");
        if (projectObject.has("season") && !projectObject.isNull("season"))
            this.season = projectObject.getString("season");
        if (projectObject.has("latitude") && !projectObject.isNull("latitude"))
            this.latitude = projectObject.getDouble("latitude");
        JSONArray nodesArray = projectObject.optJSONArray("projectNodes");
        if (nodesArray != null) {
            for (int i = 0; i < nodesArray.length(); i++) {
                JSONObject nodeObject = nodesArray.optJSONObject(i);
                if (nodeObject != null) {
                    this.projectNodes.add(new ProjectNode(nodeObject));
                }
            }
        }
    }

    // Parcelable
    protected Project(Parcel in) {
        if (in.readByte() == 0) {
            id = null;
        } else {
            id = in.readLong();
        }
        name = in.readString();
        isEnergyEnough = in.readByte() != 0;
        energyNeeded = in.readFloat();
        if (in.readByte() == 0) {
            userId = null;
        } else {
            userId = in.readLong();
        }
        String updatedAtRaw = in.readString();
        updatedAt = updatedAtRaw != null && !updatedAtRaw.isBlank() ? LocalDateTime.parse(updatedAtRaw) : null;
        season = in.readString();
        if (in.readByte() == 0) {
            latitude = null;
        } else {
            latitude = in.readDouble();
        }
    }

    public static final Creator<Project> CREATOR = new Creator<Project>() {
        @Override
        public Project createFromParcel(Parcel in) {
            return new Project(in);
        }

        @Override
        public Project[] newArray(int size) {
            return new Project[size];
        }
    };

    public static List<Project> fromJsonArray(JSONArray projectsArray) {
        List<Project> projects = new ArrayList<>();
        if (projectsArray == null) return projects;
        for (int i = 0; i < projectsArray.length(); i++) {
            try {
                JSONObject projectObject = projectsArray.getJSONObject(i);
                projects.add(new Project(projectObject));
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        return projects;
    }

    public JSONObject toJSON() throws JSONException {
        JSONObject obj = new JSONObject();
        if (this.id != null) obj.put("id", this.id);
        if (this.name != null) obj.put("name", this.name);
        if (this.userId != null) obj.put("userId", this.userId);
        obj.put("energyNeeded", this.energyNeeded);
        obj.put("energyEnough", this.isEnergyEnough);
        obj.put("season", this.season != null ? this.season : "verano");
        if (this.latitude != null) {
            obj.put("latitude", this.latitude);
        }
        JSONArray nodes = new JSONArray();
        for (ProjectNode node : projectNodes) {
            if (node == null || node.getElementId() == null) {
                continue;
            }
            nodes.put(node.toJson());
        }
        obj.put("projectNodes", nodes);
        obj.put("nodeConnections", new JSONArray());
        return obj;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public boolean isEnergyEnough() {
        return isEnergyEnough;
    }

    public void setEnergyEnough(boolean energyEnough) {
        isEnergyEnough = energyEnough;
    }

    public float getEnergyNeeded() {
        return energyNeeded;
    }

    public void setEnergyNeeded(float energyNeeded) {
        this.energyNeeded = energyNeeded;
    }

    public String getSeason() {
        return season;
    }

    public void setSeason(String season) {
        this.season = season;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public List<ProjectNode> getProjectNodes() {
        return projectNodes;
    }

    public void setProjectNodes(List<ProjectNode> projectNodes) {
        this.projectNodes = projectNodes != null ? projectNodes : new ArrayList<>();
    }

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        if (id == null) {
            dest.writeByte((byte) 0);
        } else {
            dest.writeByte((byte) 1);
            dest.writeLong(id);
        }
        dest.writeString(name);
        dest.writeByte((byte) (isEnergyEnough ? 1 : 0));
        dest.writeFloat(energyNeeded);
        if (userId == null) {
            dest.writeByte((byte) 0);
        } else {
            dest.writeByte((byte) 1);
            dest.writeLong(userId);
        }
        dest.writeString(updatedAt != null ? updatedAt.toString() : null);
        dest.writeString(season);
        if (latitude == null) {
            dest.writeByte((byte) 0);
        } else {
            dest.writeByte((byte) 1);
            dest.writeDouble(latitude);
        }
    }

}
