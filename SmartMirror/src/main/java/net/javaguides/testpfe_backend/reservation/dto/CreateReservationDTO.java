package net.javaguides.testpfe_backend.reservation.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import net.javaguides.testpfe_backend.reservation.domain.Activity;
import net.javaguides.testpfe_backend.reservation.domain.AgeGroup;
import net.javaguides.testpfe_backend.reservation.domain.Task;


import java.time.LocalDate;
import java.time.LocalTime;
import java.time.Duration;

@Data
public class CreateReservationDTO {

    @NotNull
    private Activity activity;

    @NotNull
    private AgeGroup ageGroup;

    @NotNull
    private Task task;

    @NotNull
    @FutureOrPresent
    private LocalDate date;

    @NotNull
    @Schema(
            type = "string",
            example = "09:00",
            description = "Start time in ISO-8601 format (HH:mm)"
    )
    private LocalTime startTime;

    @NotNull
    @Schema(
            type = "string",
            example = "PT1H30M",
            description = "Duration in ISO-8601 format (e.g. PT1H30M = 1 hour 30 minutes)"
    )
    private Duration duration;
}
