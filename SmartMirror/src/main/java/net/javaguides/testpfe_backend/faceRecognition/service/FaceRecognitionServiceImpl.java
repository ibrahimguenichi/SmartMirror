package net.javaguides.testpfe_backend.faceRecognition.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.javaguides.testpfe_backend.faceRecognition.domain.FaceData;
import net.javaguides.testpfe_backend.faceRecognition.dto.FaceDataSimilarityDTO;
import net.javaguides.testpfe_backend.faceRecognition.dto.FaceDataWithDistanceDTO;
import net.javaguides.testpfe_backend.faceRecognition.dto.FaceEmbeddingResponse;
import net.javaguides.testpfe_backend.faceRecognition.dto.EmbeddingWithoutUserResponse;
import net.javaguides.testpfe_backend.faceRecognition.repository.FaceDataRepository;
import net.javaguides.testpfe_backend.users.domain.User;
import net.javaguides.testpfe_backend.users.repository.UserRepository;
import net.javaguides.testpfe_backend.util.exception.ApiException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
@Slf4j
public class FaceRecognitionServiceImpl implements IFaceRecognitionService {
    private final FaceDataRepository faceDataRepository;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${face.api.url:http://ai:8000/api/face-recognition/extract-embedding/}")
    private String faceApiUrl;

    @Override
    public void saveFaceEmbedding(Long userId, float[] embeddingArray) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> ApiException.builder().statusCode(404).message("User not found").build());

        log.info("Convert to pg vector");

        // check if FaceData already exists for this user (update)
        FaceData faceData = faceDataRepository.findByUserId(userId).orElse(new FaceData(user, embeddingArray));

        log.info("about to save embedding");
        faceDataRepository.save(faceData);
    }

    @Override
    public FaceEmbeddingResponse extractEmbedding(Long userId, byte[] imageData, String filename) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        ByteArrayResource imageResource = new ByteArrayResource(imageData) {
            @Override
            public String getFilename() {
                return filename;
            }
        };

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("userId", userId);
        body.add("file", new HttpEntity<>(imageResource, new HttpHeaders()));

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        ResponseEntity<FaceEmbeddingResponse> response = restTemplate.exchange(
                faceApiUrl + "?userId=" + userId,
                HttpMethod.POST,
                requestEntity,
                FaceEmbeddingResponse.class
        );

        return response.getBody();
    }

    @Override
    public FaceDataWithDistanceDTO findNearestFace(float[] embeddingArray) {
        log.info("Started finding the nearest face");

        String embeddingString = IntStream.range(0, embeddingArray.length)
                .mapToObj(i -> String.valueOf(embeddingArray[i]))
                .collect(Collectors.joining(",", "[", "]"));

        FaceDataRepository.FaceDataSimilarityProjection projection = faceDataRepository
                .findNearestWithDistance(embeddingString)
                .orElseThrow(() -> ApiException.builder()
                        .statusCode(404)
                        .message("No matching face found")
                        .build());

        if (projection == null) {
            log.info("Nearest embedding null");

            return null; // no match found
        }

        // Convert projection to DTO
        FaceDataSimilarityDTO result = new FaceDataSimilarityDTO(
                projection.getId(),
                projection.getEmbedding(),
                projection.getCreatedAt(),
                projection.getUserId(),
                projection.getSimilarity()
        );

        log.info("completed finding the nearest face");
        log.info("embedding id: " + result.getId());
        log.info("embedding: " + result.getEmbedding());
        log.info("userId: " + result.getUserId());
        log.info("similarity: " + result.getSimilarity());
        log.info("createdAt: "  + result.getCreatedAt());

        // Extract fields assuming order: id, embedding, created_at, user_id, distance
        Long id = result.getId();

        LocalDateTime createdAt = result.getCreatedAt();

        Long userId = result.getUserId();

        double DISTANCE_THRESHOLD = 0.8;
        double similarity = result.getSimilarity();
        if (similarity <= DISTANCE_THRESHOLD) {
            // Considered a valid match
            return new FaceDataWithDistanceDTO(id, createdAt, userId, similarity);
        } else {
            // Not a strong enough match
            throw ApiException.builder()
                    .statusCode(401)
                    .message("Face not recognized with sufficient confidence")
                    .build();
        }
    }

    @Override
    public EmbeddingWithoutUserResponse extractEmbedding(byte[] imageData, String filename) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        ByteArrayResource imageResource = new ByteArrayResource(imageData) {
            @Override
            public String getFilename() {
                return filename;
            }
        };

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new HttpEntity<>(imageResource, new HttpHeaders()));

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        String fastApiUrl = "http://ai:8000/api/face-recognition/embedding-without-user/";
        ResponseEntity<Map> response = restTemplate.exchange(
                fastApiUrl,
                HttpMethod.POST,
                requestEntity,
                Map.class
        );

        Map<String, Object> responseBody = response.getBody();

        // Convert the embedding List<Double> to float[]
        List<Double> doubleList = (List<Double>) responseBody.get("embedding");
        float[] embeddingArray = new float[doubleList.size()];
        for (int i = 0; i < embeddingArray.length; i++) {
            embeddingArray[i] = doubleList.get(i).floatValue();
        }

        return new EmbeddingWithoutUserResponse(
                (String) responseBody.get("status"),
                embeddingArray
        );
    }

    // Helper method
    private float[] convertEmbeddingStringToFloatArray(String embeddingStr) {
        String cleanStr = embeddingStr.replace("[", "").replace("]", "");
        String[] parts = cleanStr.split(",");
        float[] embedding = new float[parts.length];
        for (int i = 0; i < parts.length; i++) {
            embedding[i] = Float.parseFloat(parts[i].trim());
        }
        return embedding;
    }
}
