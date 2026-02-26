package org.example.model.dto;

import org.example.model.enums.TaskStatus;

import java.util.Date;

public record TaskDto(int alert_id, Date created_at, Enum<TaskStatus> status) {
}