import insightface
import cv2
import numpy as np
from typing import List


class FaceDetector:
    def __init__(self) -> None:
        self.model: insightface.app.FaceAnalysis = insightface.app.FaceAnalysis(name="buffalo_l")
        self.model.prepare(ctx_id=0)  # Set to -1 for CPU

    def get_embedding(self, image_path: str) -> List[float]:
        """
        Returns the face embedding for the first detected face in the image.
        Raises ValueError if no face is found.
        """
        img = cv2.imread(image_path)
        if img is None:
            raise ValueError(f"Image not found or cannot be read: {image_path}")

        faces = self.model.get(img)
        if not faces:
            raise ValueError("No face found")

        embedding: np.ndarray = faces[0].embedding  # type: ignore
        return embedding.tolist()
