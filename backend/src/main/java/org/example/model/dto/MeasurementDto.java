package org.example.model.dto;


public record MeasurementDto(
        Long binId,
        Double fillLevel,
        Double weight,
        Long timestamp
) {
}