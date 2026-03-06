package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.model.dto.SiteDto;
import org.example.model.entity.MeasurementEntity;
import org.example.model.entity.SiteEntity;
import org.example.model.mapper.SiteMapper;
import org.example.repository.MeasurementRepository;
import org.example.repository.SiteRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SiteService {

    private final SiteRepository siteRepository;
    private final MeasurementRepository measurementRepository;
    private final SiteMapper siteMapper;

    public List<SiteDto> getAllSites() {
        List<SiteEntity> entities = siteRepository.findAll();

        return entities.stream().map(site -> {
            MeasurementEntity latest = measurementRepository
                    .findLatestMeasurement(site.getId())
                    .orElse(null);

            return siteMapper.toDto(site, latest);
        }).toList();
    }
}