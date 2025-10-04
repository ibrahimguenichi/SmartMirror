package net.javaguides.testpfe_backend.users.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.javaguides.testpfe_backend.faceRecognition.domain.FaceData;
import net.javaguides.testpfe_backend.reservation.domain.Reservation;
import net.javaguides.testpfe_backend.util.ApplicationContextProvider;
import net.javaguides.testpfe_backend.entity.AbstractEntity;
import net.javaguides.testpfe_backend.users.dto.CreateUserDTO;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "user_type", discriminatorType = DiscriminatorType.STRING)
public class User extends AbstractEntity implements UserDetails {
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNum;
    private int age;
    @Enumerated(EnumType.STRING)
    private Sexe sexe;
    private String trainingLocation;
    private String profileImageUrl;
    private String password;

    @OneToMany(mappedBy = ("user"))
    private List<Reservation>reservations;

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
    private List<UserConnectedAccount> connectedAccounts = new ArrayList<>();

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private FaceData faceData;

    public User(CreateUserDTO createUserDTO) {
        PasswordEncoder passwordEncoder = ApplicationContextProvider.bean(PasswordEncoder.class);

        this.password = passwordEncoder.encode(createUserDTO.getPassword());
        this.email = createUserDTO.getEmail();
        this.firstName = createUserDTO.getFirstName();
        this.lastName = createUserDTO.getLastName();
        this.phoneNum = createUserDTO.getPhoneNum();
        this.age = createUserDTO.getAge();
        this.sexe = createUserDTO.getSexe();
        this.trainingLocation = createUserDTO.getTrainingLocation();
        this.profileImageUrl = createUserDTO.getImageUrl();
    }

    public User(OAuth2User oauth2User) {
        User user = new User();
        user.email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");

        if (name != null) {
            List<String> names = List.of(name.split(" "));

            if (names.size() > 1) {
                user.firstName = names.get(0);
                user.lastName = names.get(1);
            } else {
                user.firstName = name;
            }
        }
    }

    public void addConnectedAccount(UserConnectedAccount userConnectedAccount) {
        connectedAccounts.add(userConnectedAccount);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
