package org.example.controller;

import org.example.model.dto.MeasurementDto;
import org.example.service.MeasurementService;
import org.springframework.web.bind.annotation.*;
/**
 * Tämä nyt on vedetty vaan tänne RestControllerina
 * */
@RestController
@RequestMapping("/api/measurements")
public class MeasurementController {
    private final MeasurementService service;

    public MeasurementController(MeasurementService service) {
        this.service = service;
    }

    @PostMapping
    public void receive(@RequestBody MeasurementDto dto) {
        service.processTelemetry(dto);
    }
}