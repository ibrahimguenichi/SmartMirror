package net.javaguides.testpfe_backend.users.domain;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.javaguides.testpfe_backend.users.dto.CreateClientDTO;
import net.javaguides.testpfe_backend.users.dto.CreateUserDTO;

@Entity
@Getter
@Setter
@DiscriminatorValue("CLIENT")
@NoArgsConstructor
@AllArgsConstructor
public class Client extends User {
    private ClientRole clientType;

    public Client(CreateClientDTO dto) {
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

        this.clientType = dto.getRole();
    }
}
