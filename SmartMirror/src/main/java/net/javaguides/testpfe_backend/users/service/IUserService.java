package net.javaguides.testpfe_backend.users.service;

import net.javaguides.testpfe_backend.users.domain.User;
import net.javaguides.testpfe_backend.users.dto.*;

public interface IUserService {
    UserResponse createUser(CreateUserDTO createUserDTO);
    ClientResponse createClient(CreateClientDTO createClientDTO);
    EmployeeResponse createEmployee(CreateEmployeeDTO createEmployeeDTO);
}
