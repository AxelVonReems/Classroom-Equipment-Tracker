package com.example.backend.controller;

import com.example.backend.model.PhysicalAsset;
import com.example.backend.service.PhysicalAssetService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;

@RestController
@RequestMapping("/api/assets")
@CrossOrigin(origins = "http://localhost:5173")
public class PhysicalAssetController {

    private final PhysicalAssetService service;

    public PhysicalAssetController(PhysicalAssetService service) {
        this.service = service;
    }

    // GET: http://localhost:8080/api/assets
    @GetMapping
    public Page<PhysicalAsset> getAllAssets(
        @RequestParam(required = false) String search,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        return service.getAllAssets(search, page, size);
    }

    // GET: http://localhost:8080/api/assets/{id}
    @GetMapping("/{id}")
    public PhysicalAsset getAsset(@PathVariable Long id) {
        return service.getAsset(id);
    }

    // POST: http://localhost:8080/api/assets
    @PostMapping
    public PhysicalAsset addAsset(@Valid @RequestBody PhysicalAsset asset) {
        return service.addAsset(asset);
    }

    // PUT: http://localhost:8080/api/assets/{id}
    @PutMapping("/{id}")
    public PhysicalAsset updateAsset(@PathVariable Long id, @Valid @RequestBody PhysicalAsset asset) {
        return service.updateAsset(id, asset);
    }

    // DELETE: http://localhost:8080/api/assets/{id}
    @DeleteMapping("/{id}")
    public void deleteAsset(@PathVariable Long id) {
        service.deleteAsset(id);
    }
}
