package net.javaguides.testpfe_backend.reservation.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.javaguides.testpfe_backend.reservation.dto.CreateReservationDTO;
import net.javaguides.testpfe_backend.reservation.dto.ReservationResponseDTO;
import net.javaguides.testpfe_backend.reservation.service.IReservationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/reservation")
@RequiredArgsConstructor
public class ReservationController {
    private final IReservationService reservationService;

    @PostMapping()
    ResponseEntity<ReservationResponseDTO> addReservation(@Valid @RequestBody CreateReservationDTO data) {
        return ResponseEntity.ok(reservationService.createReservation(data));
    }
}
