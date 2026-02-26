package org.example.repository;

import org.example.model.entity.MeasurementEntity;
import org.example.model.entity.SiteEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MeasurementRepository extends JpaRepository<MeasurementEntity, Long> {
}
