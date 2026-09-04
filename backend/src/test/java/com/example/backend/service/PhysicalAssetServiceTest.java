package com.example.backend.service;

import com.example.backend.model.PhysicalAsset;
import com.example.backend.repository.PhysicalAssetRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class PhysicalAssetServiceTest {

    @Mock
    private PhysicalAssetRepository repository;

    @InjectMocks
    private PhysicalAssetService service;

    // Test text normalization
    @Test
    void addAsset_ShouldNormalizeTextBeforeSaving() {
        PhysicalAsset messyAsset = new PhysicalAsset();
        messyAsset.setName("  cOmPUter MoNItor  ");
        messyAsset.setCategory("  eLEctronics ");
        messyAsset.setCondition("Good");
        messyAsset.setLocation("   ");

        when(repository.save(any(PhysicalAsset.class))).thenReturn(messyAsset);

        service.addAsset(messyAsset);

        ArgumentCaptor<PhysicalAsset> assetCaptor = ArgumentCaptor.forClass(PhysicalAsset.class);
        verify(repository).save(assetCaptor.capture());

        PhysicalAsset capturedAsset = assetCaptor.getValue();

        assertEquals("Computer Monitor", capturedAsset.getName());
        assertEquals("Electronics", capturedAsset.getCategory());
        assertEquals("Good", capturedAsset.getCondition(), "Condition should remain untouched");
        assertNull(capturedAsset.getLocation(), "Empty location should be converted to null");
    }

    // Test error handling
    @Test
    void updateAsset_ShouldThrowException_WhenAssetNotFound() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        PhysicalAsset updateData = new PhysicalAsset();
        updateData.setName("New Name");

        ResponseStatusException exception = assertThrows(
            ResponseStatusException.class, () -> {
                service.updateAsset(99L, updateData);
            }
        );

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode(), "Status should be strictly 404");
    }

    // Test search routing path
    @Test
    void getAllAssets_ShouldCallSearchQuery_WhenSearchTermIsProvided() {
        Page<PhysicalAsset> emptyPage = Page.empty();
        when(repository.searchAssets(anyString(),any(Pageable.class))).thenReturn(emptyPage);

        service.getAllAssets("Desk", 0, 10);

        verify(repository).searchAssets(eq("Desk"), any(Pageable.class));
    }
}