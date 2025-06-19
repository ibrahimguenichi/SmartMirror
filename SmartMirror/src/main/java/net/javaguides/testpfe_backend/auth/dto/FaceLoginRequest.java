package net.javaguides.testpfe_backend.auth.dto;

import lombok.Data;

@Data
public class FaceLoginRequest {
    private float[] embeddings;
}
