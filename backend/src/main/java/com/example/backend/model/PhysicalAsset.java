package com.example.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "physical_assets")
public class PhysicalAsset {

    // Table columns
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(name = "asset_condition", nullable = false, length = 50)
    private String condition;

    @Column(length = 50)
    private String location;

    // Default no-args constructor
    public PhysicalAsset() {
    }

    // Parameterized constructor for convenience
    public PhysicalAsset(String name, String category, String condition, String location) {
        this.name = name;
        this.category = category;
        this.condition = condition;
        this.location = location;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getCondition() {
        return condition;
    }

    public void setCondition(String condition) {
        this.condition = condition;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}
