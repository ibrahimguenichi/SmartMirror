package net.javaguides.testpfe_backend.auth.controller;

import jakarta.servlet.http.HttpServletRequest;
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
import net.javaguides.testpfe_backend.users.dto.CreateUserDTO;
import net.javaguides.testpfe_backend.users.dto.UserResponse;
import net.javaguides.testpfe_backend.users.repository.UserRepository;
import net.javaguides.testpfe_backend.users.service.IUserService;
import net.javaguides.testpfe_backend.util.JwtUtil;
import org.springframework.http.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.Duration;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
@Slf4j
public class AuthController {

    private final AuthService authService;
    private final IFaceRecognitionService faceRecognitionService;
    private final UserDetailsServiceImpl userDetailsService;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final IUserService userService;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody CreateUserDTO createUserDTO) {
        try {
            // 1️⃣ Check if the user already exists
            if (userDetailsService.loadUserByUsername(createUserDTO.getEmail()) != null) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "User with this email already exists"));
            }

            // 2️⃣ Create the user
            UserResponse newUser = userService.createUser(createUserDTO);

            // 3️⃣ Generate JWT token for the new user
            User user = userRepository.findById(newUser.getId()).orElseThrow();
            String jwtToken = jwtUtil.generateToken(userDetailsService.loadUserByUsername(user.getEmail()), user.getId(), user.getUserRole());

            // 4️⃣ Optionally set JWT as HttpOnly cookie
            ResponseCookie cookie = ResponseCookie.from("jwt", jwtToken)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(Duration.ofDays(10))
                .sameSite("Lax")
                .build();

            // 5️⃣ Return response with JWT
            return ResponseEntity.status(HttpStatus.CREATED)
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new AuthResponse(user.getEmail(), jwtToken, user.getUserRole()));

        } catch (Exception e) {
            log.error("Registration failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to register user", "message", e.getMessage()));
        }
    }


    /**
     * Login endpoint with email and password.
     * Returns JWT token with user ID and role.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest requestBody) {
        try {
            // Authenticate user
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(requestBody.getEmail(), requestBody.getPassword())
            );

            // Load user details
            final UserDetails userDetails = userDetailsService.loadUserByUsername(requestBody.getEmail());
            User user = (User) userDetails;
            
            // Debug logging
            log.info("Login attempt for email: {}", requestBody.getEmail());
            log.info("Found user: ID={}, Email={}, Role={}", user.getId(), user.getEmail(), user.getUserRole());

            // Generate JWT including user ID and role
            final String jwtToken = jwtUtil.generateToken(userDetails, user.getId(), user.getUserRole());

            // Optional: set JWT as HttpOnly cookie
            ResponseCookie cookie = ResponseCookie.from("jwt", jwtToken)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(Duration.ofDays(10))
                .sameSite("Lax")
                .build();

            return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new AuthResponse(user.getEmail(), jwtToken, user.getUserRole()));

        } catch (Exception e) {
            log.error("Login failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Invalid credentials"));
        }
    }

    /**
     * Face recognition login.
     * Issues JWT token with user ID and role if face matches.
     */
    @PostMapping(value = "/face_login", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> faceLogin(@RequestParam("image") MultipartFile image) {
        log.info("Face login started");
        try {
            byte[] imageData = image.getBytes();
            String filename = image.getOriginalFilename() != null ? image.getOriginalFilename() : "face.jpg";

            // Extract embedding and find user
            EmbeddingWithoutUserResponse embeddingResponse = faceRecognitionService.extractEmbedding(imageData, filename);
            User user = authService.loginWithFace(embeddingResponse.getEmbedding());
            UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());

            // Generate JWT including user ID and role
            final String jwtToken = jwtUtil.generateToken(userDetails, user.getId(), user.getUserRole());

            ResponseCookie cookie = ResponseCookie.from("jwt", jwtToken)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(Duration.ofDays(10))
                .sameSite("Lax")
                .build();

            return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new AuthResponse(user.getEmail(), jwtToken, user.getUserRole()));

        } catch (Exception e) {
            log.error("Face login error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error processing face login", "message", e.getMessage()));
        }
    }

    /**
     * Returns details of the currently authenticated user.
     * Uses Spring Security's authentication context.
     */
    @GetMapping("/me")
    public ResponseEntity<?> getSession(HttpServletRequest request) {
        try {
            // Get authentication from Spring Security context
            String header = request.getHeader("Authorization");
            String token = null;
            
            // 1. Try to get JWT from Authorization header
            if (header != null && header.startsWith("Bearer ")) {
                token = header.substring(7);
            }
            
            // 2. Try to get JWT from cookies if not in header
            if (token == null && request.getCookies() != null) {
                for (jakarta.servlet.http.Cookie cookie : request.getCookies()) {
                    if ("jwt".equals(cookie.getName())) {
                        token = cookie.getValue();
                        break;
                    }
                }
            }
            
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
            }

            // Extract user ID from token
            Long userId = jwtUtil.extractUserId(token);
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
            }
            
            // Debug logging
            log.info("Auth/me request - Extracted userId from token: {}", userId);
            
            // Return user data
            var userData = authService.getUserById(userId);
            log.info("Auth/me response - Returning user: ID={}, Email={}, Role={}", 
                userData.getId(), userData.getEmail(), userData.getUserRole());
            return ResponseEntity.ok(userData);
        } catch (Exception e) {
            log.error("Error in /auth/me: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        }
    }

    /**
     * Checks if user is authenticated.
     */
    @GetMapping("/is-authenticated")
    public ResponseEntity<Boolean> isAuthenticated(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        boolean authenticated = header != null && header.startsWith("Bearer ");
        return ResponseEntity.ok(authenticated);
    }

    /**
     * Logout endpoint (clears JWT cookie).
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
            .httpOnly(true)
            .secure(false)
            .path("/")
            .maxAge(0)
            .sameSite("None")
            .build();

        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, cookie.toString())
            .body("Logged out successfully");
    }

    /**
     * CSRF endpoint (optional, placeholder).
     */
    @GetMapping("/csrf")
    public ResponseEntity<?> csrf() {
        return ResponseEntity.ok().build();
    }
}
