package org.example.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "site", schema = "roskis_db")
public class SiteEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "site_id", nullable = false)
    private Long id;

    @Size(max = 100)
    @NotNull
    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Size(max = 200)
    @NotNull
    @Column(name = "location", nullable = false, length = 200)
    private String location;
    @OneToMany(mappedBy = "site")
    private Set<AlertEntity> alerts = new LinkedHashSet<>();
    @OneToMany(mappedBy = "siteEntity")
    private Set<MeasurementEntity> measurements = new LinkedHashSet<>();


}