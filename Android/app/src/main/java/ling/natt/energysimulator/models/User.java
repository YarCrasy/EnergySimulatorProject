package ling.natt.energysimulator.models;

import android.os.Parcel;
import android.os.Parcelable;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class User implements Parcelable {
    private Long id;
    private String fullName;
    private String email;
    private String dateOfBirth;
    private String passwordHash;
    private boolean admin;
    private ArrayList<Project> projects = new ArrayList<>();

    public User(JSONObject userObject) throws JSONException {
        this.id = userObject.getLong("id");
        this.fullName = userObject.getString("fullName");
        this.email = userObject.getString("email");
        this.dateOfBirth = userObject.getString("dateOfBirth");
        this.passwordHash = userObject.getString("passwordHash");
        this.admin = userObject.getBoolean("admin");
    }

    protected User(Parcel in) {
        if (in.readByte() == 0) {
            id = null;
        } else {
            id = in.readLong();
        }
        fullName = in.readString();
        email = in.readString();
        dateOfBirth = in.readString();
        passwordHash = in.readString();
        admin = in.readByte() != 0;
    }

    public static final Creator<User> CREATOR = new Creator<User>() {
        @Override
        public User createFromParcel(Parcel in) {
            return new User(in);
        }

        @Override
        public User[] newArray(int size) {
            return new User[size];
        }
    };

    public Long getId() { return id; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public String getDateOfBirth() { return dateOfBirth; }
    public String getPasswordHash() { return passwordHash; }
    public boolean isAdmin() { return admin; }

    public void setEmail(String email) { this.email = email; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public JSONObject toJSON() throws JSONException {
        JSONObject userObject = new JSONObject();
        userObject.put("id", id);
        userObject.put("fullName", fullName);
        userObject.put("email", email);
        userObject.put("dateOfBirth", dateOfBirth);
        userObject.put("passwordHash", passwordHash);
        userObject.put("admin", admin);
        return userObject;

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
        dest.writeString(fullName);
        dest.writeString(email);
        dest.writeString(dateOfBirth);
        dest.writeString(passwordHash);
        dest.writeByte((byte) (admin ? 1 : 0));
    }

    public ArrayList<Project> getProjects() {
        return projects;
    }

    public void setProjects(ArrayList<Project> projects) {
        this.projects = projects;
    }
}
