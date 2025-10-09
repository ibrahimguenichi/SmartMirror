package net.javaguides.testpfe_backend.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import net.javaguides.testpfe_backend.users.domain.UserRole;

@Getter
@AllArgsConstructor
public class AuthResponse {
    private String email;
    private String token;
    private UserRole userRole;
}
