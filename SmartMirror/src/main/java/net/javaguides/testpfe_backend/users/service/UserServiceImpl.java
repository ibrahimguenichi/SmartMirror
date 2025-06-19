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
}
