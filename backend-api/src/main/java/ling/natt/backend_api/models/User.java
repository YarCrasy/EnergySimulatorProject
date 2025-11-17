package ling.natt.backend_api.models;

import java.sql.Date;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public int id;
    public String fullName;
    public Date dateOfBirth;
    public String email;
    public String passwordHash;
    public boolean isAdmin = false;
}