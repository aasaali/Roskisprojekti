package org.example.model.dto;

import java.time.LocalDateTime;

public record MeasurementDto(
        Long binId,
        Double fillLevel,
        Double weight,
        LocalDateTime timestamp
) {
}