package net.javaguides.testpfe_backend.reservation.repository;

import net.javaguides.testpfe_backend.reservation.domain.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
}
