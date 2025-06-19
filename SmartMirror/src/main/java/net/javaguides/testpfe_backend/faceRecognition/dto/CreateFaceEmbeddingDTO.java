package net.javaguides.testpfe_backend.faceRecognition.dto;

import lombok.Getter;

@Getter
public class CreateFaceEmbeddingDTO {
    private Long userId;
    private float[] embedding;
}
