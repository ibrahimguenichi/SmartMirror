package net.javaguides.testpfe_backend.auth.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.javaguides.testpfe_backend.auth.dto.AuthResponse;
import net.javaguides.testpfe_backend.auth.dto.LoginRequest;
import net.javaguides.testpfe_backend.faceRecognition.dto.FaceDataWithDistanceDTO;
import net.javaguides.testpfe_backend.faceRecognition.service.IFaceRecognitionService;
import net.javaguides.testpfe_backend.users.domain.User;
import net.javaguides.testpfe_backend.users.dto.UserResponse;
import net.javaguides.testpfe_backend.users.repository.UserRepository;
import net.javaguides.testpfe_backend.util.JwtUtil;
import net.javaguides.testpfe_backend.util.exception.ApiException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final IFaceRecognitionService faceRecognitionService;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;

    /**
     * Login with email/password and return AuthResponse with JWT
     */
    public AuthResponse login(LoginRequest request) throws AuthenticationException {
        // Authenticate user
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // Load UserDetails
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        User user = (User) userDetails;

        // Generate JWT token including user ID and role
        String jwtToken = jwtUtil.generateToken(userDetails, user.getId(), user.getUserRole());

        return new AuthResponse(user.getEmail(), jwtToken, user.getUserRole());
    }

    /**
     * Login with face embedding and return the User
     */
    @Transactional
    public User loginWithFace(float[] embedding) {
        log.info("Login with face");

        // Find nearest face match
        FaceDataWithDistanceDTO faceData = faceRecognitionService.findNearestFace(embedding);
        if (faceData == null) {
            throw ApiException.builder()
                .statusCode(401)
                .message("Face not recognized")
                .build();
        }

        // Load User from DB
        return userRepository.findById(faceData.getUserId())
            .orElseThrow(() -> ApiException.builder()
                .statusCode(404)
                .message("User not found")
                .build());
    }

    /**
     * Get user by ID
     */
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> ApiException.builder()
                .statusCode(404)
                .message("User not found")
                .build());
        return new UserResponse(user);
    }
}
