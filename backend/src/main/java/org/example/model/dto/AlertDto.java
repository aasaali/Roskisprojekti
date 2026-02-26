package org.example.model.dto;

import org.example.model.enums.AlertState;
import org.example.model.enums.AlertType;

import java.sql.Date;

public record AlertDto(int bin_id, Enum<AlertType> alert_type, Date alert_time, Enum<AlertState> state, Date closed_at) {
}