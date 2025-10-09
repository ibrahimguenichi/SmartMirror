package net.javaguides.testpfe_backend.users.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import net.javaguides.testpfe_backend.users.domain.Client;
import net.javaguides.testpfe_backend.users.domain.ClientRole;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

@Data
@NoArgsConstructor
public class ClientResponse extends UserResponse{
    private ClientRole role;
    public ClientResponse(Client client) {
        super(client); // initialise les champs hérités de UserResponse
        this.role = client.getClientType(); // initialise le rôle spécifique au Client
    }

    }


