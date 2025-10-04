package net.javaguides.testpfe_backend.reservation.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.javaguides.testpfe_backend.entity.AbstractEntity;
import net.javaguides.testpfe_backend.reservation.dto.CreateReservationDTO;
import net.javaguides.testpfe_backend.users.domain.Client;
import net.javaguides.testpfe_backend.users.domain.User;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Reservation extends AbstractEntity {
    @Enumerated(EnumType.STRING)
    private Activity activity;
    @Enumerated(EnumType.STRING)
    private AgeGroup ageGroup;
    @Enumerated(EnumType.STRING)
    private Task task;
    private LocalDate date;
    private LocalTime startTime;
    private Duration duration;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user ;

    public Reservation(CreateReservationDTO dto) {
        this.activity = dto.getActivity();
        this.ageGroup = dto.getAgeGroup();
        this.task = dto.getTask();
        this.date = dto.getDate();
        this.startTime = dto.getStartTime();
        this.duration = dto.getDuration();
    }
}
