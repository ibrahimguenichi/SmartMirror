package net.javaguides.testpfe_backend.reservation.service;

import net.javaguides.testpfe_backend.reservation.dto.CreateReservationDTO;
import net.javaguides.testpfe_backend.reservation.dto.ReservationResponseDTO;

public interface IReservationService {
    public ReservationResponseDTO createReservation(CreateReservationDTO reservationDTO);
}
