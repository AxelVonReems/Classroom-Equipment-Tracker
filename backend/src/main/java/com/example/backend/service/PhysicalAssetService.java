package com.example.backend.service;

import java.util.Arrays;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
    public Page<PhysicalAsset> getAllAssets(String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());

        if (search != null && !search.trim().isEmpty()) {
            return repository.searchAssets(search.trim(), pageable);
        }

        return repository.findAll(pageable);
    }

    // Get one asset
    public PhysicalAsset getAsset(Long id) {
        return repository.findById(id).orElseThrow(
            () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Asset with ID "  + id + " not found")
        );
    }

    // Add a new asset
    public PhysicalAsset addAsset(PhysicalAsset asset) {
        validateCondition(asset.getCondition());

        asset.setName(normalizeText(asset.getName()));
        asset.setCategory(normalizeText(asset.getCategory()));
        asset.setLocation(normalizeText(asset.getCondition()));

        return repository.save(asset);
    }

    // Update an existing asset
    public PhysicalAsset updateAsset(Long id, PhysicalAsset updateAsset) {
        PhysicalAsset existingAsset = repository.findById(id).orElseThrow(
            () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Asset not found")
        );

        validateCondition(updateAsset.getCondition());

        existingAsset.setName(normalizeText(updateAsset.getName()));
        existingAsset.setCategory(normalizeText(updateAsset.getCategory()));
        existingAsset.setCondition(normalizeText(updateAsset.getCondition()));
        existingAsset.setLocation(normalizeText(updateAsset.getLocation()));

        return repository.save(existingAsset);
    }

    // Delete an asset
    public void deleteAsset(Long id) {
        repository.deleteById(id);
    }

    // Text Normalization Helper
    private String normalizeText(String text) {
        if (text == null || text.trim().isEmpty()) {
            return null;
        }

        String trimmed = text.trim();

        return trimmed.substring(0, 1).toUpperCase() + trimmed.substring(1).toLowerCase();
    }
}
