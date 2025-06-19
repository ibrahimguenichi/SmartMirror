import insightface
import numpy as np
import cv2

class FaceDetector:
    def __init__(self):
        self.model = insightface.app.FaceAnalysis(name='buffalo_l')
        self.model.prepare(ctx_id=0)  # Set to -1 for CPU

    def get_embedding(self, image_path):
        img = cv2.imread(image_path)
        faces = self.model.get(img)
        if not faces:
            raise ValueError("No face found")
        return faces[0].embedding
