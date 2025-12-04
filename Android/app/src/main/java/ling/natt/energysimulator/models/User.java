package ling.natt.energysimulator.models;

import java.time.LocalDate;
import java.util.ArrayList;

public class User {
    private Long id;
    private String fullName;
    private String email;
    private LocalDate dateOfBirth;
    private String passwordHash;
    private boolean admin;
    private ArrayList<Project> projects = new ArrayList<>();

    public Long getId() { return id; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public String getDateOfBirth() { return dateOfBirth; }
    public String getPasswordHash() { return passwordHash; }
    public boolean isAdmin() { return admin; }
}
