package net.javaguides.testpfe_backend.faceRecognition.dto;

import lombok.Data;

import java.util.List;

@Data
public class FaceEmbeddingResponse {
    private String status;
    private List<Double> embedding;
    private Object backend_response;
}
