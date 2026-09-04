package com.example.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;

import com.example.backend.model.PhysicalAsset;

@Repository
public interface PhysicalAssetRepository extends JpaRepository<PhysicalAsset, Long> {
    @Query(
        "SELECT p FROM PhysicalAsset p WHERE " +
        "LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
        "LOWER(p.category) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
        "LOWER(p.location) LIKE LOWER(CONCAT('%', :searchTerm, '%'))"
    )

    Page<PhysicalAsset> searchAssets(@Param("searchTerm") String searchParam, Pageable pageable);
}
