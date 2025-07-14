package net.javaguides.testpfe_backend.auth.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.javaguides.testpfe_backend.auth.dto.AuthResponse;
import net.javaguides.testpfe_backend.auth.dto.LoginRequest;
import net.javaguides.testpfe_backend.auth.service.AuthService;
import net.javaguides.testpfe_backend.auth.service.UserDetailsServiceImpl;
import net.javaguides.testpfe_backend.faceRecognition.dto.EmbeddingWithoutUserResponse;
import net.javaguides.testpfe_backend.faceRecognition.service.IFaceRecognitionService;
import net.javaguides.testpfe_backend.users.domain.User;
import net.javaguides.testpfe_backend.users.dto.UserResponse;
import net.javaguides.testpfe_backend.util.JwtUtil;
import org.springframework.http.*;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/auth")
@Slf4j
public class AuthController {
    private final AuthService authService;
    private final IFaceRecognitionService faceRecognitionService;
    private final UserDetailsServiceImpl userDetailsService;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(
            HttpServletRequest request,
            HttpServletResponse response,
            @Valid @RequestBody LoginRequest body
    ) {
        authService.login(request, response, body);
        final UserDetails userDetails = userDetailsService.loadUserByUsername(body.getEmail());
        final String jwtToken = jwtUtil.generateToken(userDetails);
        ResponseCookie cookie = ResponseCookie.from("jwt", jwtToken)
                .httpOnly(true)
                .path("/")
                .maxAge(Duration.ofDays(1))
                .sameSite("Lax")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new AuthResponse(body.getEmail(), jwtToken));
    }

    @PostMapping(
            value = "/face_login",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> faceLogin(HttpServletRequest request,
                                            HttpServletResponse response,
                                            @RequestParam("image") MultipartFile image
                                            ) {
        log.info("Face login started");
        try {
            // Extract file bytes and name
            byte[] imageData = image.getBytes();
            String filename = image.getOriginalFilename() != null ? image.getOriginalFilename() : "face.jpg";

            // Call service to send to FastAPI and save
            EmbeddingWithoutUserResponse embeddingresponse = faceRecognitionService.extractEmbedding(imageData, filename);

            User user = authService.loginWithFace(request, response, embeddingresponse.getEmbedding());
            UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());

            final String jwtToken = jwtUtil.generateToken(userDetails);
            ResponseCookie cookie = ResponseCookie.from("jwt", jwtToken)
                    .httpOnly(true)
                    .path("/")
                    .maxAge(Duration.ofDays(1))
                    .sameSite("Lax")
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(new AuthResponse(user.getEmail(), jwtToken));

        } catch (Exception e) {
            Map<String, String> errorBody = new HashMap<>();
            errorBody.put("error", "Error extracting embedding");
            errorBody.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorBody);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getSession(HttpServletRequest request) {
        return ResponseEntity.ok(authService.getSession(request));
    }

    @GetMapping("is-authenticated")
    public ResponseEntity<Boolean> isAuthenticated(@CurrentSecurityContext(expression = "authentication?.name") String email) {
        log.info("isAuthenticated started");
        return ResponseEntity.ok(email != null);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        authService.logout(request, response);
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Strict")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("Logged out successfully");
    }

    /**
     * We don't have to do anything in this endpoint, the CsrfFilter will handle it.
     * This endpoint should be invoked by the frontend to get the CSRF token.
     */
    @GetMapping("/csrf")
    public ResponseEntity<?> csrf() {return ResponseEntity.ok().build();}


}
