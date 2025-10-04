package net.javaguides.testpfe_backend.reservation.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import net.javaguides.testpfe_backend.reservation.domain.Reservation;
import net.javaguides.testpfe_backend.reservation.domain.Activity;
import net.javaguides.testpfe_backend.reservation.domain.AgeGroup;
import net.javaguides.testpfe_backend.reservation.domain.Task;
import net.javaguides.testpfe_backend.reservation.dto.CreateReservationDTO;
import net.javaguides.testpfe_backend.reservation.dto.ReservationResponseDTO;
import net.javaguides.testpfe_backend.reservation.repository.ReservationRepository;
import net.javaguides.testpfe_backend.users.domain.User;
import net.javaguides.testpfe_backend.users.repository.UserRepository;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IReservationServiceImpl implements IReservationService {

    private final ReservationRepository reservationRepository;
    private final JavaMailSender mailSender;
    private final UserRepository userRepository;

    @Override
    public ReservationResponseDTO createReservation(CreateReservationDTO reservationDTO) {
        // Vérifier si le créneau est déjà pris
        boolean exists = reservationRepository.existsByDateAndStartTime(
                reservationDTO.getDate(), reservationDTO.getStartTime()
        );

        if (exists) {
            throw new IllegalArgumentException("Ce créneau est déjà réservé !");
        }

        // Création de la réservation
        Reservation reservation = new Reservation(reservationDTO);

        User user = userRepository.findById(reservationDTO.getClientId()).orElseThrow();

        reservation.setUser(user);
        reservationRepository.save(reservation);

        // Envoi d'un mail simple à l'admin
        try {
            sendMailToAdmin(reservation);
        } catch (Exception e) {
            e.printStackTrace(); // À gérer proprement en production
        }

        return new ReservationResponseDTO(reservation);
    }
    @Override
    public List<ReservationResponseDTO> getReservationsByUser(Long userId) {
        return reservationRepository.findByUserId(userId)
                .stream()
                .map(ReservationResponseDTO::new)
                .toList();
    }

    @Override
    public List<ReservationResponseDTO> getAllReservations() {
        return reservationRepository.findAll()
                .stream()
                .map(ReservationResponseDTO::new)
                .toList();
    }

    @Override
    public List<LocalTime> getAvailableTimes(LocalDate date) {
        List<LocalTime> allTimes = List.of(
                LocalTime.of(9, 0),
                LocalTime.of(10, 0),
                LocalTime.of(11, 0),
                LocalTime.of(12, 0),
                LocalTime.of(13, 0),
                LocalTime.of(14, 0),
                LocalTime.of(15, 0),
                LocalTime.of(16, 0),
                LocalTime.of(17, 0)
        );

        List<LocalTime> bookedTimes = reservationRepository.findByDate(date)
                .stream()
                .map(Reservation::getStartTime)
                .toList();

        return allTimes.stream()
                .filter(time -> !bookedTimes.contains(time))
                .toList();
    }

    @Override
    public void deleteReservation(Long id) {
        if (!reservationRepository.existsById(id)) {
            throw new IllegalArgumentException("Reservation not found with id: " + id);
        }
        reservationRepository.deleteById(id);
    }

    // -------------------------------
    // Méthode pour envoyer un mail simple à l'admin
    // -------------------------------
    private void sendMailToAdmin(Reservation reservation) throws Exception {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        String adminEmail = "dhia.elair@esprit.tn"; // Email de l’admin
        helper.setTo(adminEmail);
        helper.setSubject("Nouvelle réservation ajoutée");

        // Texte du mail
        String text = "Une nouvelle réservation a été ajoutée :\n" +
                "client: " + reservation.getUser().getFirstName() + ' ' + reservation.getUser().getLastName() +
                "Activité : " + reservation.getActivity() + "\n" +
                "Tâche : " + reservation.getTask() + "\n" +
                "Date : " + reservation.getDate() + "\n" +
                "Heure : " + reservation.getStartTime();

        helper.setText(text);

        mailSender.send(message);
    }
}
