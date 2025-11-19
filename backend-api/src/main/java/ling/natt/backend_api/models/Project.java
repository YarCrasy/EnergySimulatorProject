package ling.natt.backend_api.models;

import java.sql.Date;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

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
