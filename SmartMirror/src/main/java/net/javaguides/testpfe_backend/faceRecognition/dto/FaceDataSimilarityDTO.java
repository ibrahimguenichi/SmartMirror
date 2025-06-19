package net.javaguides.testpfe_backend.faceRecognition.dto;

import com.pgvector.PGvector;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.ToString;
import org.postgresql.util.PGobject;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@ToString
public class FaceDataSimilarityDTO {
    private Long Id;
    private PGobject Embedding;
    private LocalDateTime CreatedAt;
    private Long userId;
    private Double similarity;
}
