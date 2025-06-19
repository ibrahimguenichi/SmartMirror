package net.javaguides.testpfe_backend.faceRecognition.dto;

import com.pgvector.PGvector;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FaceDataWithDistanceDTO {
    private Long id;
    private LocalDateTime createdAt;
    private Long userId;
    private Double distance;
}
