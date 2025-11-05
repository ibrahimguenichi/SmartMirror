package net.javaguides.testpfe_backend.users.controller;
import net.javaguides.testpfe_backend.users.dto.*;
import org.springframework.security.access.prepost.PreAuthorize;
import net.javaguides.testpfe_backend.users.dto.AiProfileResponse;
import net.javaguides.testpfe_backend.config.ApplicationProperties;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.javaguides.testpfe_backend.users.service.IUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("api/users")
@RequiredArgsConstructor
public class UserController {
    private final IUserService userService;
    private final ApplicationProperties applicationProperties;

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

    @GetMapping()
    @PreAuthorize("hasAuthority('ADMIN')") // Seul l’admin peut accéder
    public List<UserResponse> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("{userId}/ai-profile")
    public ResponseEntity<AiProfileResponse> getAiProfile(
            @PathVariable Long userId,
            @RequestHeader(value = "X-AI-Service-Token", required = false) String token
    ) {
        String expected = applicationProperties.getAiServiceToken();
        if (expected == null || token == null || !expected.equals(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        AiProfileResponse res = userService.getAiProfileById(userId);
        return ResponseEntity.ok(res);
    }
}
