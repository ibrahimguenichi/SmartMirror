package net.javaguides.testpfe_backend.faceRecognition.repository;

import com.pgvector.PGvector;
import net.javaguides.testpfe_backend.faceRecognition.domain.FaceData;
import net.javaguides.testpfe_backend.faceRecognition.dto.FaceDataSimilarityDTO;
import org.postgresql.util.PGobject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@Repository
public interface FaceDataRepository extends JpaRepository<FaceData, Long> {
    Optional<FaceData> findByUserId(long userId);

    @Query(value = """
        SELECT 
            fd.id as id,
            fd.embedding as embedding,
            fd.created_at as createdAt,
            fd.user_id as userId,
            (fd.embedding <=> cast(:embedding AS vector)) as similarity
        FROM face_data fd
        ORDER BY similarity ASC
        LIMIT 1
        """, nativeQuery = true)
    Optional<FaceDataSimilarityProjection> findNearestWithDistance(@Param("embedding") String embedding);

    public interface FaceDataSimilarityProjection {
        Long getId();
        PGobject getEmbedding(); // Or float[] if you have a custom converter
        LocalDateTime getCreatedAt();
        Long getUserId();
        Double getSimilarity();
    }

}
