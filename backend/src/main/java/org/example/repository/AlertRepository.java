package org.example.repository;

import org.example.model.entity.AlertEntity;
import org.example.model.entity.SiteEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlertRepository extends JpaRepository<AlertEntity, Long> {
}
