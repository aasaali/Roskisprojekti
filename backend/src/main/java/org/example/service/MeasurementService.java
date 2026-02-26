package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.model.dto.MeasurementDto;
import org.example.model.entity.AlertEntity;
import org.example.model.entity.MeasurementEntity;
import org.example.model.entity.SiteEntity;
import org.example.model.entity.TaskEntity;
import org.example.model.enums.AlertState;
import org.example.model.enums.AlertType;
import org.example.repository.AlertRepository;
import org.example.repository.MeasurementRepository;
import org.example.repository.SiteRepository;
import org.example.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MeasurementService {
    private final SiteRepository siteRepository;
    private final MeasurementRepository measurementRepository;
    private final AlertRepository alertRepository;
    private final TaskRepository taskRepository;

    @Transactional
    public void processTelemetry(MeasurementDto dto) {


    }


}