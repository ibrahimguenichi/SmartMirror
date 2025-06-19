package net.javaguides.testpfe_backend.users.dto;

import jakarta.annotation.Nullable;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.javaguides.testpfe_backend.users.domain.Sexe;
import net.javaguides.testpfe_backend.users.domain.User;
import org.springframework.security.core.GrantedAuthority;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Data
@NoArgsConstructor
public class UserResponse {
    private Long id;
    @Nullable
    private String firstName;
    @Nullable
    private String lastName;
    private String email;
    private String phoneNum;
    private Sexe sexe;
    private String trainingLocation;
    @Nullable
    private String profileImageUrl;
    private List<ConnectedAccountResponse> connectedAccounts = new ArrayList<>();
    private List<String> authorities = new ArrayList<>();

    public UserResponse(User user) {
        this.id = user.getId();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.email = user.getEmail();
        this.phoneNum = user.getPhoneNum();
        this.sexe = user.getSexe();
        this.trainingLocation = user.getTrainingLocation();
        this.profileImageUrl = user.getProfileImageUrl();
        user.getConnectedAccounts().forEach((provider) -> {
            this.connectedAccounts.add(new ConnectedAccountResponse(provider.getProvider(), provider.getConnectedAt()));
        });
    }

    public UserResponse(User user, Collection<? extends GrantedAuthority> authorities) {
        this.id = user.getId();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.email = user.getEmail();
        this.phoneNum = user.getPhoneNum();
        this.sexe = user.getSexe();
        this.trainingLocation = user.getTrainingLocation();
        this.profileImageUrl = user.getProfileImageUrl();
        user.getConnectedAccounts().forEach((provider) -> {
            this.connectedAccounts.add(new ConnectedAccountResponse(provider.getProvider(), provider.getConnectedAt()));
        });
        authorities.forEach(authority -> {
            this.authorities.add(authority.getAuthority());
        });
    }

    public record ConnectedAccountResponse(String provider, LocalDateTime connectedAt) {}
}
