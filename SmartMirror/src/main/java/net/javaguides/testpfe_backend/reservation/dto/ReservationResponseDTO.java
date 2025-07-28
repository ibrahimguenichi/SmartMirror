package net.javaguides.testpfe_backend.reservation.dto;

import lombok.Data;
import net.javaguides.testpfe_backend.reservation.domain.Activity;
import net.javaguides.testpfe_backend.reservation.domain.AgeGroup;
import net.javaguides.testpfe_backend.reservation.domain.Reservation;
import net.javaguides.testpfe_backend.reservation.domain.Task;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.Duration;

@Data
public class ReservationResponseDTO {
    private Long id;
    private Activity activity;
    private AgeGroup ageGroup;
    private Task task;
    private LocalDate date;
    private LocalTime startTime;
    private Duration duration;

    public ReservationResponseDTO(Reservation reservation) {
        this.id = reservation.getId();
        this.activity = reservation.getActivity();
        this.ageGroup = reservation.getAgeGroup();
        this.task = reservation.getTask();
        this.date = reservation.getDate();
        this.startTime = reservation.getStartTime();
        this.duration = reservation.getDuration();
    }
}
