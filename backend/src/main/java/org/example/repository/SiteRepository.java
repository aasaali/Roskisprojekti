package org.example.repository;

import org.example.model.entity.SiteEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SiteRepository extends JpaRepository<SiteEntity, Long> {
}
