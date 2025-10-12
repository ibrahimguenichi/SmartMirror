package net.javaguides.testpfe_backend.users.service;

import net.javaguides.testpfe_backend.users.domain.User;
import net.javaguides.testpfe_backend.users.dto.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IUserService {
    UserResponse createUser(CreateUserDTO createUserDTO);
    ClientResponse createClient(CreateClientDTO createClientDTO);
    EmployeeResponse createEmployee(CreateEmployeeDTO createEmployeeDTO);
    UserResponse uploadProfileImage(Long userId, MultipartFile file);
    List<UserResponse> getAllUsers();
    UserResponse getUserById(Long id);
}
