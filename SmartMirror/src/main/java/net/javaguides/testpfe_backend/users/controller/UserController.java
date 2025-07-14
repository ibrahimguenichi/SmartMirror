package net.javaguides.testpfe_backend.users.controller;

import org.springframework.web.bind.annotation.RequestBody;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.javaguides.testpfe_backend.users.dto.ClientResponse;
import net.javaguides.testpfe_backend.users.dto.CreateClientDTO;
import net.javaguides.testpfe_backend.users.dto.CreateEmployeeDTO;
import net.javaguides.testpfe_backend.users.dto.EmployeeResponse;
import net.javaguides.testpfe_backend.users.service.IUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import net.javaguides.testpfe_backend.users.dto.UserResponse;

@RestController
@RequestMapping("api/users")
@RequiredArgsConstructor
public class UserController {
    private final IUserService userService;

    @PostMapping("client")
    public ResponseEntity<ClientResponse> createClient(@Valid @RequestBody CreateClientDTO createClientDTO) {
        ClientResponse clientResponse = this.userService.createClient(createClientDTO);

        return ResponseEntity.ok(clientResponse);
    }

    @PostMapping("employee")
    public ResponseEntity<EmployeeResponse> createEmployee(@Valid @RequestBody CreateEmployeeDTO createEmployeeDTO) {
        EmployeeResponse employeeResponse = this.userService.createEmployee(createEmployeeDTO);

        return ResponseEntity.ok(employeeResponse);
    }

    @PostMapping("{userId}/profile-image")
    public ResponseEntity<UserResponse> uploadProfileImage(@PathVariable Long userId, @RequestParam("file") MultipartFile file) {
        UserResponse userResponse = userService.uploadProfileImage(userId, file);
        return ResponseEntity.ok(userResponse);
    }
}
