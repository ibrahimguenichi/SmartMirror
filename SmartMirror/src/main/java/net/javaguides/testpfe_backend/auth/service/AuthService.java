package net.javaguides.testpfe_backend.auth.service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.javaguides.testpfe_backend.auth.SecurityUtil;
import net.javaguides.testpfe_backend.auth.dto.LoginRequest;
import net.javaguides.testpfe_backend.faceRecognition.dto.FaceDataWithDistanceDTO;
import net.javaguides.testpfe_backend.faceRecognition.service.IFaceRecognitionService;
import net.javaguides.testpfe_backend.users.domain.User;
import net.javaguides.testpfe_backend.users.dto.UserResponse;
import net.javaguides.testpfe_backend.users.repository.UserRepository;
import net.javaguides.testpfe_backend.util.exception.ApiException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextHolderStrategy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository = new HttpSessionSecurityContextRepository();
    SecurityContextLogoutHandler logoutHandler = new SecurityContextLogoutHandler();
    private final IFaceRecognitionService faceRecognitionService;
    private final UserDetailsService userDetailsService;

    /**
     * Sets the cookie for the user if the username and password are correct
     */
    public void login(HttpServletRequest request,
                      HttpServletResponse response,
                      LoginRequest body
    ) throws AuthenticationException {
        UsernamePasswordAuthenticationToken token = UsernamePasswordAuthenticationToken.unauthenticated(body.getEmail(), body.getPassword());
        Authentication authentication = authenticationManager.authenticate(token);
        SecurityContextHolderStrategy securityContextHolderStrategy = SecurityContextHolder.getContextHolderStrategy();
        SecurityContext context = securityContextHolderStrategy.createEmptyContext();
        context.setAuthentication(authentication);
        securityContextHolderStrategy.setContext(context);
        securityContextRepository.saveContext(context, request, response);
    }

    @Transactional
    public UserResponse getSession(HttpServletRequest request) {
        User user = SecurityUtil.getAuthenticatedUser();
        Collection<? extends GrantedAuthority> authorities = SecurityContextHolder.getContext().getAuthentication().getAuthorities();

        return new UserResponse(user, authorities);
    }

    public void logout(HttpServletRequest request, HttpServletResponse response) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        this.logoutHandler.logout(request, response, authentication);
    }

    public User loginWithFace(HttpServletRequest request,
                              HttpServletResponse response,
                              float[] embedding
    ) {
        log.info("login With Face");
        // find matching user
        FaceDataWithDistanceDTO faceData = faceRecognitionService.findNearestFace(embedding);

        if (faceData == null) {
            throw ApiException.builder()
                    .statusCode(401)
                    .message("Face not recognized")
                    .build();
        }

        // Load User from database
        User user = userRepository.findById(faceData.getUserId())
                .orElseThrow(() -> ApiException.builder().statusCode(404).message("User not found").build());

        // 3. Create Authentication token manually
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        // 4. Set it in the SecurityContext
        SecurityContextHolderStrategy securityContextHolderStrategy = SecurityContextHolder.getContextHolderStrategy();
        SecurityContext context = securityContextHolderStrategy.createEmptyContext();
        context.setAuthentication(authentication);
        securityContextHolderStrategy.setContext(context);

        // 5. Persist the context (for session-based auth)
        securityContextRepository.saveContext(context, request, response);

        return user;
    }

}
