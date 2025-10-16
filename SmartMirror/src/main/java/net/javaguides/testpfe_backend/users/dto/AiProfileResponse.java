package net.javaguides.testpfe_backend.users.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiProfileResponse {
    private String userId;
    private String fullName;
    private String ageGroup;
    private String role;
    private String team;
    private String language;
    private String userNotes;
}


