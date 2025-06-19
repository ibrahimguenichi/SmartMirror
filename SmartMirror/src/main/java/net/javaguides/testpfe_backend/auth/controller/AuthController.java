package net.javaguides.testpfe_backend.auth.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.javaguides.testpfe_backend.auth.dto.LoginRequest;
import net.javaguides.testpfe_backend.auth.service.AuthService;
import net.javaguides.testpfe_backend.faceRecognition.dto.EmbeddingWithoutUserResponse;
import net.javaguides.testpfe_backend.faceRecognition.service.IFaceRecognitionService;
import net.javaguides.testpfe_backend.users.dto.UserResponse;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/auth")
@Slf4j
public class AuthController {
    private final AuthService authService;
    private final IFaceRecognitionService faceRecognitionService;

    @PostMapping("/login")
    public ResponseEntity<?> login(
            HttpServletRequest request,
            HttpServletResponse response,
            @Valid @RequestBody LoginRequest body
    ) {
        authService.login(request, response, body);

        return ResponseEntity.ok().build();
    }

    @PostMapping(
            value = "/face_login",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<String> faceLogin(HttpServletRequest request,
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

            UserResponse user = authService.loginWithFace(request, response, embeddingresponse.getEmbedding());

            return ResponseEntity.ok().body(user.toString());

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error extracting embedding: " + e.getMessage());
        }
//        return null;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getSession(HttpServletRequest request) {
        return ResponseEntity.ok(authService.getSession(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        authService.logout(request, response);

        return ResponseEntity.ok().build();
    }

    /**
     * We don't have to do anything in this endpoint, the CsrfFilter will handle it.
     * This endpoint should be invoked by the frontend to get the CSRF token.
     */
    @GetMapping("/csrf")
    public ResponseEntity<?> csrf() {return ResponseEntity.ok().build();}


}
