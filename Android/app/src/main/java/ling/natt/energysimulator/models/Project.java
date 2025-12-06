package ling.natt.energysimulator.models;

import android.os.Build;
import android.os.Parcel;
import android.os.Parcelable;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class Project implements Parcelable {

    private long id;

    private String name;
    private String description;
    private LocalDateTime updatedAt;
    private boolean isEnergyEnough;
    private float energyNeeded;

    private long user;

    private List<ProjectElement> projectElements = new ArrayList<>();

    public Project(String name, long user, LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
        this.name = name;
        this.user = user;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            this.updatedAt = LocalDateTime.now();
        }
    }

    public Project(org.json.JSONObject projectObject) throws org.json.JSONException {
        this.id = projectObject.has("id") ? projectObject.getLong("id") : null;
        this.name = projectObject.has("name") ? projectObject.getString("name") : null;
        this.user = projectObject.has("user") ? projectObject.getLong("user") : null;
    }

    // Parcelable constructor
    protected Project(Parcel in) {
        if (in.readByte() == 0) {
            id = Long.parseLong(null);
        } else {
            id = in.readLong();
        }
        name = in.readString();
        description = in.readString();
        isEnergyEnough = in.readByte() != 0;
        energyNeeded = in.readFloat();
        user = in.readLong();
        updatedAt = LocalDateTime.now();

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

    public void addElement(Element element, int unidades) {
        ProjectElement pe = new ProjectElement(this, element, unidades);
        projectElements.add(pe);
    }

    public void removeElement(ProjectElement pe) {
        projectElements.remove(pe);
        pe.setProject(null);
        pe.setElement(null);
    }

    public org.json.JSONObject toJSON() throws org.json.JSONException {
        org.json.JSONObject obj = new org.json.JSONObject();
        if (this.id != null) obj.put("id", this.id);
        if (this.name != null) obj.put("name", this.name);
        if (this.description != null) obj.put("description", this.description);
        return obj;
    }

    // Getters and Setters
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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
        dest.writeString(description);
        dest.writeByte((byte) (isEnergyEnough ? 1 : 0));
        dest.writeFloat(energyNeeded);
        dest.writeParcelable(user, flags);
    }

}
