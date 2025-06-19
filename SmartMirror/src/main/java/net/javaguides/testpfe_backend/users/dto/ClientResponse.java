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
        super(client);

        this.role = client.getRole();
    }

    public ClientResponse(Client client, Collection<? extends GrantedAuthority> authorities) {
        super(client, authorities);

        this.role = client.getRole();
    }
}
