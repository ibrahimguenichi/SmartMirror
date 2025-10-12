package net.javaguides.testpfe_backend.reservation.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.javaguides.testpfe_backend.auth.service.AuthService;
import net.javaguides.testpfe_backend.reservation.dto.CreateReservationDTO;
import net.javaguides.testpfe_backend.reservation.dto.ReservationResponseDTO;
import net.javaguides.testpfe_backend.reservation.service.IReservationService;
import net.javaguides.testpfe_backend.util.JwtUtil;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/reservation")
@RequiredArgsConstructor
public class ReservationController {

    private final IReservationService reservationService;
    private final AuthService authService;
    private final JwtUtil jwtUtil;

    @GetMapping
    public List<ReservationResponseDTO> getAllReservations() {
        return reservationService.getAllReservations();
    }

    @PostMapping
    public ResponseEntity<ReservationResponseDTO> addReservation(@Valid @RequestBody CreateReservationDTO data) {
        return ResponseEntity.ok(reservationService.createReservation(data));
    }

    /**
     * Get reservations for the currently authenticated user.
     * Extract user ID from JWT in Authorization header.
     */
    @GetMapping("/my")
    public ResponseEntity<?> getMyReservations(HttpServletRequest request) {
        String token = null;

        // Try to get JWT from Authorization header
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            token = header.substring(7);
        }

        // If not found, get it from cookie
        if (token == null && request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (cookie.getName().equals("jwt")) {
                    token = cookie.getValue();
                    break;
                }
            }
        }

        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("authenticated", false, "message", "User not authenticated"));
        }

        Long userId = jwtUtil.extractUserId(token);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("authenticated", false, "message", "Invalid token"));
        }

        return ResponseEntity.ok(reservationService.getReservationsByUser(userId));
    }

    @GetMapping("/available-times")
    public List<String> getAvailableTimes(@RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return reservationService.getAvailableTimes(date)
            .stream()
            .map(LocalTime::toString)
            .toList();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReservation(@PathVariable Long id) {
        reservationService.deleteReservation(id);
        return ResponseEntity.noContent().build();
    }
}
