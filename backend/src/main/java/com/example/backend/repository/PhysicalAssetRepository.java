package com.example.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.model.PhysicalAsset;

@Repository
public interface PhysicalAssetRepository extends JpaRepository<PhysicalAsset, Long> {
    List<PhysicalAsset> findAllByOrderByIdAsc();
}
