package net.javaguides.testpfe_backend.users.dto;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.javaguides.testpfe_backend.users.domain.Department;
import net.javaguides.testpfe_backend.users.domain.Employee;
import net.javaguides.testpfe_backend.users.domain.Status;
import org.springframework.security.core.GrantedAuthority;

import java.time.LocalDate;
import java.util.Collection;

@Data
@NoArgsConstructor
public class EmployeeResponse extends UserResponse {
    private String position;
    private Department department;
    private LocalDate startDate;
    private Status status;

    public EmployeeResponse(final Employee employee) {
        super(employee);

        this.position = employee.getPosition();
        this.department = employee.getDepartment();
        this.startDate = employee.getStartDate();
        this.status = employee.getStatus();
    }

    public EmployeeResponse(final Employee employee, Collection<? extends GrantedAuthority> authorities) {
        super(employee, authorities);

        this.position = employee.getPosition();
        this.department = employee.getDepartment();
        this.startDate = employee.getStartDate();
        this.status = employee.getStatus();
    }
}
