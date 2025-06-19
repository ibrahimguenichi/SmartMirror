package net.javaguides.testpfe_backend.faceRecognition.service;

import net.javaguides.testpfe_backend.faceRecognition.dto.FaceDataWithDistanceDTO;
import net.javaguides.testpfe_backend.faceRecognition.dto.FaceEmbeddingResponse;
import net.javaguides.testpfe_backend.faceRecognition.dto.EmbeddingWithoutUserResponse;

public interface IFaceRecognitionService {
    void saveFaceEmbedding(Long userId, float[] embeddingArray);
    FaceEmbeddingResponse extractEmbedding(Long userId, byte[] imageData, String filename);
    FaceDataWithDistanceDTO findNearestFace(float[] embeddingArray);
    EmbeddingWithoutUserResponse extractEmbedding(byte[] imageData, String filename);
}
