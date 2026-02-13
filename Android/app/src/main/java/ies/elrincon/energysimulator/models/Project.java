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
    private List<ProjectElement> projectElements = new ArrayList<>();

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
        if (projectObject.has("isEnergyEnough") && !projectObject.isNull("isEnergyEnough"))
            this.isEnergyEnough = projectObject.getBoolean("isEnergyEnough");
        if (projectObject.has("energyNeeded") && !projectObject.isNull("energyNeeded"))
            this.energyNeeded = (float) projectObject.getDouble("energyNeeded");
        if (projectObject.has("userId") && !projectObject.isNull("userId"))
            this.userId = projectObject.getLong("userId");
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
        // not parceling updatedAt or projectElements for simplicity
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

    public void addElement(Element element, int unidades) {
        ProjectElement pe = new ProjectElement(this, element, unidades);
        projectElements.add(pe);
    }

    public void removeElement(ProjectElement pe) {
        projectElements.remove(pe);
        pe.setProject(null);
        pe.setElement(null);
    }

    public JSONObject toJSON() throws JSONException {
        JSONObject obj = new JSONObject();
        if (this.id != null) obj.put("id", this.id);
        if (this.name != null) obj.put("name", this.name);
        if (this.userId != null) obj.put("userId", this.userId);
        // omitimos projectElements y updatedAt en el payload mínimo
        return obj;
    }

    // Getters y Setters
    public List<ProjectElement> getElements() {
        return projectElements;
    }

    public void setElements(List<ProjectElement> projectElements) {
        this.projectElements = projectElements;
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
    }

}
