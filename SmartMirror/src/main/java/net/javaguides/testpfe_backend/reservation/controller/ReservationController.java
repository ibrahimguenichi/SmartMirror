package net.javaguides.testpfe_backend.reservation.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.javaguides.testpfe_backend.auth.service.AuthService;
import net.javaguides.testpfe_backend.reservation.dto.CreateReservationDTO;
import net.javaguides.testpfe_backend.reservation.dto.ReservationResponseDTO;
import net.javaguides.testpfe_backend.reservation.service.IReservationService;
import net.javaguides.testpfe_backend.users.domain.User;
import net.javaguides.testpfe_backend.users.dto.UserResponse;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalTime;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("api/reservation")
@RequiredArgsConstructor
public class ReservationController {
    
    private final IReservationService reservationService;
    private final AuthService authService;
    @GetMapping
    public List<ReservationResponseDTO> getAllReservations() {
        return reservationService.getAllReservations();
    }

    @PostMapping()
    ResponseEntity<ReservationResponseDTO> addReservation(@Valid @RequestBody CreateReservationDTO data) {
        return ResponseEntity.ok(reservationService.createReservation(data));
    }
    @GetMapping("/my")
    public List<ReservationResponseDTO> getMyReservations(HttpServletRequest request) {
        // Récupérer le UserResponse
        UserResponse currentUser = authService.getSession(request);

        // Passer l'ID à ton service pour récupérer les réservations
        return reservationService.getReservationsByUser(currentUser.getId());
    }


    @GetMapping("/available-times")
    public List<String> getAvailableTimes(@RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return reservationService.getAvailableTimes(date)
                .stream()
                .map(LocalTime::toString) // Transformer en String "HH:mm"
                .toList();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReservation(@PathVariable Long id) {
        reservationService.deleteReservation(id);
       // return ResponseEntity.ok("Reservation deleted successfully");
        return ResponseEntity.noContent().build();
    }

}
