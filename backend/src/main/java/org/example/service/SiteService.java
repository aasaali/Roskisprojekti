package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.model.dto.SiteDto;
import org.example.model.entity.SiteEntity;
import org.example.repository.SiteRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SiteService {

    private final SiteRepository siteRepository;

    public List<SiteDto> getAllSites() {
        List<SiteEntity> entities = siteRepository.findAll();

        return entities.stream().map(entity -> new SiteDto(
                entity.getId(),
                entity.getName(),
                entity.getLocation(),
                0,             
                "OK",            
                LocalDateTime.now()
        )).toList();
    }
}