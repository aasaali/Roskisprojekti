package org.example.repository;

import org.example.model.entity.MeasurementEntity;
import org.example.model.entity.SiteEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface MeasurementRepository extends JpaRepository<MeasurementEntity, Long> {

    @Query(value = """
        SELECT measurement_id, site_id, fill_percent, measured_at
        FROM (
          SELECT m.*,
                 ROW_NUMBER() OVER (
                   PARTITION BY site_id
                   ORDER BY measured_at DESC, measurement_id DESC) AS row_num
          FROM measurement m
          WHERE m.site_id = :siteId
        ) latest_measurements
        WHERE row_num = 1;
        """, nativeQuery = true)
    Optional<MeasurementEntity> findLatestMeasurement(@Param("siteId") Long siteId);


}
