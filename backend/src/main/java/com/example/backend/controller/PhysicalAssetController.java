package com.example.backend.controller;

import com.example.backend.model.PhysicalAsset;
import com.example.backend.service.PhysicalAssetService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public List<PhysicalAsset> getAllAssets() {
        return service.getAllAssets();
    }

    // POST: http://localhost:8080/api/assets
    @PostMapping
    public PhysicalAsset addAsset(@RequestBody PhysicalAsset asset) {
        return service.addAsset(asset);
    }

    // PUT: http://localhost:8080/api/assets/{id}
    @PutMapping("/{id}")
    public PhysicalAsset updateAsset(@PathVariable Long id, @RequestBody PhysicalAsset asset) {
        return service.updateAsset(id, asset);
    }

    // DELETE: http://localhost:8080/api/assets/{id}
    @DeleteMapping("/{id}")
    public void deleteAsset(@PathVariable Long id) {
        service.deleteAsset(id);
    }
}
