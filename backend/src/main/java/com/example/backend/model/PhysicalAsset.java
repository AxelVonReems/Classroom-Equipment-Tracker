package com.example.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "physical_assets")
public class PhysicalAsset {

    // Table columns
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required and cannot be empty")
    @Size(min = 3, max = 100, message = "Name must be between 3 and 100 characters")
    @Column(nullable = false, length = 100)
    private String name;

    @NotBlank(message = "Category is required and cannot be empty")
    @Size(min = 3, max = 100, message = "Category must be between 3 and 100 characters")
    @Column(nullable = false, length = 50)
    private String category;

    @NotBlank(message = "Condition is required")
    @Pattern(regexp = "^(Good|Fair|Poor|Unknown)$", message = "Condition must be Good, Fair, Poor, or Unknown")
    @Column(name = "asset_condition", nullable = false, length = 50)
    private String condition = "Unknown";

    @Size(max = 50, message = "Location must not exceed 50 characters")
    @Column(length = 50)
    private String location;

    // Default no-args constructor
    public PhysicalAsset() {
    }

    // Parameterized constructor
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
