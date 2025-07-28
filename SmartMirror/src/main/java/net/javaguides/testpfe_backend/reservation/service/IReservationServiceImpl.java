package net.javaguides.testpfe_backend.reservation.service;

import lombok.RequiredArgsConstructor;
import net.javaguides.testpfe_backend.reservation.domain.Reservation;
import net.javaguides.testpfe_backend.reservation.dto.CreateReservationDTO;
import net.javaguides.testpfe_backend.reservation.dto.ReservationResponseDTO;
import net.javaguides.testpfe_backend.reservation.repository.ReservationRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class IReservationServiceImpl implements IReservationService {
    private final ReservationRepository reservationRepository;

    @Override
    public ReservationResponseDTO createReservation(CreateReservationDTO reservationDTO) {
        Reservation reservation = new Reservation(reservationDTO.getActivity(), reservationDTO.getAgeGroup(), reservationDTO.getTask(), reservationDTO.getDate(), reservationDTO.getStartTime(), reservationDTO.getDuration());
        reservationRepository.save(reservation);

        return new ReservationResponseDTO(reservation);
    }
}
