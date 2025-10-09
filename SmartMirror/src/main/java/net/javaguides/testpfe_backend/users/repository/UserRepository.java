package net.javaguides.testpfe_backend.users.repository;

import net.javaguides.testpfe_backend.users.domain.User;
import net.javaguides.testpfe_backend.users.domain.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    public Optional<User> findByEmail(String email);
    List<User> findByUserRole(UserRole role);
}
