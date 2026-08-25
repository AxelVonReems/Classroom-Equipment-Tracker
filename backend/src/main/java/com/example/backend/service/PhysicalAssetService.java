package com.example.backend.service;

import java.util.Arrays;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.backend.model.PhysicalAsset;
import com.example.backend.repository.PhysicalAssetRepository;

@Service
public class PhysicalAssetService {

    private final PhysicalAssetRepository repository;

    // Constructor Injection
    public PhysicalAssetService(PhysicalAssetRepository repository) {
        this.repository = repository;
    }

    // Condition validation
    private void validateCondition(String condition) {
        List<String> allowedConditions = Arrays.asList("Good", "Fair", "Poor", "Unknown");

        if (condition == null || !allowedConditions.contains(condition)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid condition. Must be Good, Fair, or Poor.");
        }
    }

    // Get all assets
    public List<PhysicalAsset> getAllAssets() {
        return repository.findAll();
    }

    // Add a new asset
    public PhysicalAsset addAsset(PhysicalAsset asset) {
        validateCondition(asset.getCondition());

        return repository.save(asset);
    }

    // Update an existing asset
    public PhysicalAsset updateAsset(Long id, PhysicalAsset updateAsset) {
        PhysicalAsset asset = repository.findById(id).orElseThrow(
            () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Asset not found")
        );

        validateCondition(updateAsset.getCondition());

        asset.setName(updateAsset.getName());
        asset.setCategory(updateAsset.getCategory());
        asset.setCondition(updateAsset.getCondition());
        asset.setLocation(updateAsset.getLocation());

        return repository.save(asset);
    }

    // Delete an asset
    public void deleteAsset(Long id) {
        repository.deleteById(id);
    }
}
