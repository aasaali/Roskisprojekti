package org.example.model.mapper;

import org.example.model.dto.SiteDto;
import org.example.model.entity.MeasurementEntity;
import org.example.model.entity.SiteEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.time.LocalDateTime;
import java.time.ZoneId;

@Mapper(componentModel = "spring")
public interface SiteMapper {

    @Mapping(target = "id", source = "site.id")
    @Mapping(target = "fillPercent", expression = "java(latest != null ? latest.getFillPercent().intValue() : 0)")
    @Mapping(target = "status", expression = "java(determineStatus(latest))")
    @Mapping(target = "lastUpdated", expression = "java(latest != null ? java.time.LocalDateTime.ofInstant(latest.getMeasuredAt(), java.time.ZoneId.systemDefault()) : java.time.LocalDateTime.now())")
    SiteDto toDto(SiteEntity site, MeasurementEntity latest);

    default String determineStatus(MeasurementEntity latest) {
        if (latest == null) return "OK";
        double fill = latest.getFillPercent().doubleValue();
        if (fill >= 90.0) return "KRIITTINEN";
        if (fill >= 70.0) return "VAROITUS";
        return "OK";
    }
}