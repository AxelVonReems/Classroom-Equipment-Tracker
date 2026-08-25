package com.example.backend.service;

import com.example.backend.model.PhysicalAsset;
import com.example.backend.repository.PhysicalAssetRepository;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PhysicalAssetService {

    private final PhysicalAssetRepository repository;

    // Constructor Injection
    public PhysicalAssetService(PhysicalAssetRepository repository) {
        this.repository = repository;
    }

    // Get all assets
    public List<PhysicalAsset> getAllAssets() {
        return repository.findAll();
    }

    // Add a new asset
    public PhysicalAsset addAsset(PhysicalAsset asset) {
        return repository.save(asset);
    }

    // Update an existing asset
    public PhysicalAsset updateAsset(Long id, PhysicalAsset updateAsset) {
        PhysicalAsset asset = repository.findById(id).orElseThrow(
            () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Asset not found")
        );

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
