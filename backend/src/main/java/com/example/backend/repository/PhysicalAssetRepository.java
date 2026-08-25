package com.example.backend.repository;

import com.example.backend.model.PhysicalAsset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PhysicalAssetRepository extends JpaRepository<PhysicalAsset, Long> {
    
}
