package net.javaguides.testpfe_backend.faceRecognition.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.javaguides.testpfe_backend.faceRecognition.dto.CreateFaceEmbeddingDTO;
import net.javaguides.testpfe_backend.faceRecognition.dto.FaceEmbeddingResponse;
import net.javaguides.testpfe_backend.faceRecognition.service.IFaceRecognitionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("api/face-recognition")
@RequiredArgsConstructor
public class FaceRecognitionController {
    private final IFaceRecognitionService faceRecognitionService;

    @PostMapping(
            value = "/upload_face",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> uploadFaceImage(@RequestParam("image") MultipartFile image, @RequestParam("userId") Long userId) {
        try {
            // Extract file bytes and name
            byte[] imageData = image.getBytes();
            String filename = image.getOriginalFilename() != null ? image.getOriginalFilename() : "face.jpg";

            // Call service to send to FastAPI and save
            log.info("Uploading face image " + filename + " to " + userId);
            FaceEmbeddingResponse response = faceRecognitionService.extractEmbedding(userId, imageData, filename);
            log.info(response.toString());

            List<Double> doubleList = response.getEmbedding();
            float[] embedding = new float[doubleList.size()];
            for (int i = 0; i < doubleList.size(); i++) {
                embedding[i] = doubleList.get(i).floatValue();
            }

            log.info("Embedding: {}", embedding.toString());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error extracting embedding: " + e.getMessage());
        }
    }

    @PostMapping("save_embedding")
    public ResponseEntity<String> saveEmbedding(@RequestBody CreateFaceEmbeddingDTO request) {
        System.out.println("Received embedding for userId: " + request.getUserId());
        System.out.println("Embedding size: " + request.getEmbedding().length);
        try {
            faceRecognitionService.saveFaceEmbedding(request.getUserId(), request.getEmbedding());
            return ResponseEntity.ok("Embedding saved successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to save embedding: " + e.getMessage());
        }
    }
}
