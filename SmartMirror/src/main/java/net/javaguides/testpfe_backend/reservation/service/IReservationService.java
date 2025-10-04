package net.javaguides.testpfe_backend.reservation.service;

import net.javaguides.testpfe_backend.reservation.dto.CreateReservationDTO;
import net.javaguides.testpfe_backend.reservation.dto.ReservationResponseDTO;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface IReservationService {
    public ReservationResponseDTO createReservation(CreateReservationDTO reservationDTO);
    List<ReservationResponseDTO> getAllReservations();
    List<LocalTime> getAvailableTimes(LocalDate date);
    void deleteReservation(Long id);
    List<ReservationResponseDTO> getReservationsByUser(Long userId);
}
