package net.javaguides.testpfe_backend.faceRecognition.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmbeddingWithoutUserResponse {
    private String status;
    private float[] embedding;
}
