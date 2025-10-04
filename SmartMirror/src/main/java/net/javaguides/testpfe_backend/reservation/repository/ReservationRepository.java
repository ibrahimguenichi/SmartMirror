package net.javaguides.testpfe_backend.reservation.repository;

import net.javaguides.testpfe_backend.reservation.domain.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    boolean existsByDateAndStartTime(LocalDate date, LocalTime startTime);
    List<Reservation> findByDate(LocalDate date);
    List<Reservation> findByUserId(Long userId);
}
