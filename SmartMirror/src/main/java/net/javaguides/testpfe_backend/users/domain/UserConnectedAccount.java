package net.javaguides.testpfe_backend.users.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.javaguides.testpfe_backend.entity.AbstractEntity;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class UserConnectedAccount extends AbstractEntity {
    private String provider;
    private String providerId;
    private LocalDateTime connectedAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public UserConnectedAccount(String provider, String providerId, User user) {
        this.provider = provider;
        this.providerId = providerId;
        this.connectedAt = LocalDateTime.now();
        this.user = user;
    }
}
