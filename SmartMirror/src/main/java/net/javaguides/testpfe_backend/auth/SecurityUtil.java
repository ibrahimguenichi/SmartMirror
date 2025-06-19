package net.javaguides.testpfe_backend.auth;

import lombok.extern.slf4j.Slf4j;
import net.javaguides.testpfe_backend.util.exception.ApiException;
import net.javaguides.testpfe_backend.users.domain.User;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;

import java.util.Optional;

@Slf4j
public class SecurityUtil {
    private static final SecurityContextRepository securityContextRepository = new HttpSessionSecurityContextRepository();

    /**
     * Get the authenticated user from the SecurityContextHolder
     * @throws net.javaguides.testpfe_backend.util.exception.ApiException if the user is not found in the SecurityContextHolder
     */
    public static User getAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User) {
            return (User) principal;
        } else {
            log.error("User requested but not found in SecurityContext");
            throw ApiException.builder().statusCode(401).message("Authentication required").build();
        }
    }

    public static Optional<User> getOptionalAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User) {
            return Optional.of((User) principal);
        } else {
            return Optional.empty();
        }
    }
}
