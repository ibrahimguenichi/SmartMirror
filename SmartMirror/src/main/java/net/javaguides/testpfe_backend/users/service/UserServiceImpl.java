package net.javaguides.testpfe_backend.users.service;

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
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

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
    public UserResponse uploadProfileImage(Long userId, MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // Get the root directory from environment variable
        String parentDir = "/mnt/c/Users/Dhia/onedrive/bureau/smartmirror";
        if (parentDir == null || parentDir.isBlank()) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Image_root_dir environment variable is not set");
        }
        File directory = new File(parentDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        // Save the file with a unique name (e.g., userId + original extension)
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

        // Update the user's profileImageUrl (store absolute path)
        user.setProfileImageUrl(filePath.toAbsolutePath().toString());
        userRepository.save(user);
        return new UserResponse(user);
    }
}
