package net.javaguides.testpfe_backend.users.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import net.javaguides.testpfe_backend.users.domain.Client;
import net.javaguides.testpfe_backend.users.domain.Employee;
import net.javaguides.testpfe_backend.users.domain.User;
import net.javaguides.testpfe_backend.users.dto.*;
import net.javaguides.testpfe_backend.users.repository.ClientRepository;
import net.javaguides.testpfe_backend.users.repository.EmployeeRepository;
import net.javaguides.testpfe_backend.users.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements IUserService {
    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    public UserResponse createUser(CreateUserDTO createUserDTO) {
        User user = new User(createUserDTO);
        userRepository.save(user);

        return new UserResponse(user);
    }

    @Override
    public ClientResponse createClient(CreateClientDTO createClientDTO) {
        Client client = new Client(createClientDTO);
        clientRepository.save(client);

        return new ClientResponse(client);
    }

    @Override
    public EmployeeResponse createEmployee(CreateEmployeeDTO createEmployeeDTO) {
        Employee employee = new Employee(createEmployeeDTO);
        employeeRepository.save(employee);

        return new EmployeeResponse(employee);
    }
    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
        return new UserResponse(user);
    }

    @Override
    public UserResponse uploadProfileImage(Long userId, MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // Chemin vers le dossier static
        String parentDir = "src/main/resources/static/uploads";

        File directory = new File(parentDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
        }

        String filename = "user_" + userId + extension;
        Path filePath = Paths.get(parentDir, filename);

        try {
            file.transferTo(filePath);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to save profile image");
        }

        // URL relative pour le front / Swagger
        user.setProfileImageUrl("/uploads/" + filename);
        userRepository.save(user);

        return new UserResponse(user);
    }
    @Override
    public AiProfileResponse getAiProfileById(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        String fullName = (user.getFirstName() != null ? user.getFirstName() : "")
            + (user.getLastName() != null ? (" " + user.getLastName()) : "");

        String ageGroup;
        int age = user.getAge();
        if (age < 18) ageGroup = "<18";
        else if (age <= 25) ageGroup = "18-25";
        else if (age <= 35) ageGroup = "26-35";
        else if (age <= 50) ageGroup = "36-50";
        else ageGroup = "50+";

        return AiProfileResponse.builder()
            .userId(String.valueOf(user.getId()))
            .fullName(fullName.trim())
            .ageGroup(ageGroup)
            .role(user.getUserRole() != null ? user.getUserRole().name().toLowerCase() : "member")
            .team("unassigned")
            .language("fr")
            .userNotes("")
            .build();
    }
}
