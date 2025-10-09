package net.javaguides.testpfe_backend.users.domain;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.javaguides.testpfe_backend.users.dto.CreateEmployeeDTO;
import net.javaguides.testpfe_backend.users.dto.CreateUserDTO;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@DiscriminatorValue("EMPLOYEE")
@NoArgsConstructor
@AllArgsConstructor
public class Employee extends User{
    private String position;
    @Enumerated(EnumType.STRING)
    private Department department;
    private LocalDate startDate;
    @Enumerated(EnumType.STRING)
    private Status status;

    public Employee(CreateEmployeeDTO dto) {
        super(new CreateUserDTO(
                dto.getEmail(),
                dto.getFirstName(),
                dto.getLastName(),
                dto.getPhoneNum(),
                dto.getAge(),
                dto.getSexe(),
                dto.getTrainingLocation(),
                dto.getPassword(),
                dto.getConfirmPassword(),
                dto.getImageUrl(),
                UserRole.USER

        ));

        this.position = dto.getPosition();
        this.department = dto.getDepartment();
        this.startDate = dto.getStartDate();
        this.status = Status.ACTIVE;
    }
}
