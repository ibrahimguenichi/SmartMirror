package net.javaguides.testpfe_backend.users.repository;

import net.javaguides.testpfe_backend.users.domain.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
}
