package net.javaguides.testpfe_backend.users.dto;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import net.javaguides.testpfe_backend.users.domain.ClientRole;
import net.javaguides.testpfe_backend.users.domain.Sexe;
import net.javaguides.testpfe_backend.util.validators.PasswordMatch;
import net.javaguides.testpfe_backend.util.validators.Unique;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.URL;

@Data
@NoArgsConstructor
@AllArgsConstructor
@PasswordMatch(password = "password", confirmPassword = "confirmPassword")
public class CreateClientDTO{
    @Email
    @Unique(columnName = "email", tableName = "users", message = "User with this email already exist")
    private String email;
    @NotBlank(message = "First name cannot be blank")
    private String firstName;
    @NotBlank(message = "Last name cannot be blank")
    private String lastName;
    @NotBlank(message = "Phone number cannot be blank")
    private String phoneNum;
    @NotNull
    @Min(10)
    @Max(100)
    private int age;
    @Enumerated(EnumType.STRING)
    @NotNull
    private Sexe sexe;
    @NotBlank(message = "Training location cannot be blank")
    private String trainingLocation;
    @NotNull
    @Length(min = 8)
    @NotBlank(message = "Password cannot be blank")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*\\W).*$", message = "Must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.")
    private String password;
    private String confirmPassword;
    private String imageUrl;

    @NotNull
    @Enumerated(EnumType.STRING)
    private ClientRole role;
}
