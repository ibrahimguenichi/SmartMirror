package net.javaguides.testpfe_backend.auth.service;

import lombok.RequiredArgsConstructor;
import net.javaguides.testpfe_backend.users.domain.User;
import net.javaguides.testpfe_backend.users.repository.UserRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws BadCredentialsException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Cannot find user with email: " + email));

        return user;
    }
}
