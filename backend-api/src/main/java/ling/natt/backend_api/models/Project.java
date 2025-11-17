package ling.natt.backend_api.models;

import java.sql.Date;

@Entity
@Table(name = "projects")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public int id;
    public int userId;
    public String name;
    public Date updatedAt;
    public boolean isEnergyEnough;
    public float energyNeeded;
}
