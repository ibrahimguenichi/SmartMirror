package net.javaguides.testpfe_backend.users.bootstrap;

import net.javaguides.testpfe_backend.users.domain.Sexe;
import net.javaguides.testpfe_backend.users.domain.User;
import net.javaguides.testpfe_backend.users.domain.UserRole;
import net.javaguides.testpfe_backend.users.dto.CreateUserDTO;
import net.javaguides.testpfe_backend.users.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class AdminDataLoader implements CommandLineRunner {

    private final UserRepository userRepository;

    public AdminDataLoader(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        boolean adminExists = userRepository.findAll()
                .stream()
                .anyMatch(user -> user.getUserRole() == UserRole.ADMIN);

        if (!adminExists) {
            CreateUserDTO adminDTO = new CreateUserDTO();
            adminDTO.setEmail("admin@example.com");
            adminDTO.setFirstName("Admin");
            adminDTO.setLastName("User");
            adminDTO.setPhoneNum("00000000");
            adminDTO.setAge(30);
            adminDTO.setSexe(Sexe.MALE);
            adminDTO.setTrainingLocation("Head Office");
            adminDTO.setPassword("Admin@123");
            adminDTO.setConfirmPassword("Admin@123");
            adminDTO.setUserRole(UserRole.ADMIN);

            User admin = new User(adminDTO);
            userRepository.save(admin);

            System.out.println("✅ Admin créé avec succès !");
        }
    }
}
