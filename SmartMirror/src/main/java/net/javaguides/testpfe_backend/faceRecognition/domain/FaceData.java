package net.javaguides.testpfe_backend.faceRecognition.domain;

import com.pgvector.PGvector;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.NoArgsConstructor;
import net.javaguides.testpfe_backend.entity.AbstractEntity;
import net.javaguides.testpfe_backend.users.domain.User;
import org.hibernate.annotations.Array;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;

@Entity
@Table(name = "face_data")
@NoArgsConstructor
public class FaceData extends AbstractEntity {
    @Column
    @JdbcTypeCode(SqlTypes.VECTOR)
    @Array(length = 512) // dimensions
    private float[] embedding;
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToOne
    private User user;

    public FaceData(User user, float[] embedding) {
        this.user = user;
        this.embedding = embedding;
        this.createdAt = LocalDateTime.now();
    }
}
