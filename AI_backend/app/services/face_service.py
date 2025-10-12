import tempfile
from pathlib import Path
from typing import Any, Dict

from app.api.api_client import send_embedding
from app.models.face_detector import FaceDetector
from fastapi import UploadFile


class FaceService:
    def __init__(self) -> None:
        self.detector = FaceDetector()

    async def extract_embedding(self, userId: int, file: UploadFile) -> Dict[str, Any]:
        """
        Extract embedding from uploaded file and send it to backend.
        Returns a dict with status, embedding, and backend response.
        """
        contents = await file.read()
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
            tmp.write(contents)
            tmp_path = tmp.name

        try:
            embedding = self.detector.get_embedding(tmp_path)  # List[float]
            backend_response = await send_embedding(
                str(userId),           # Convert int -> str
                embedding,             # Already a list[float], no tolist() needed
                "http://localhost:8080/api/face-recognition/save_embedding"
            )
        finally:
            Path(tmp_path).unlink(missing_ok=True)

        return {
            "status": "success",
            "embedding": embedding,
            "backend_response": backend_response
        }

    async def preview_embedding(self, file: UploadFile) -> Dict[str, Any]:
        """
        Extract embedding from file without sending it to backend.
        """
        contents = await file.read()
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
            tmp.write(contents)
            tmp_path = tmp.name

        try:
            embedding = self.detector.get_embedding(tmp_path)
        finally:
            Path(tmp_path).unlink(missing_ok=True)

        return {
            "status": "success",
            "embedding": embedding
        }

    async def get_embedding_from_file(self, file: UploadFile) -> list[float]:
        """
        Helper: read image, extract embedding, return list of floats.
        """
        contents = await file.read()
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
            tmp.write(contents)
            tmp_path = tmp.name

        try:
            embedding = self.detector.get_embedding(tmp_path)
        finally:
            Path(tmp_path).unlink(missing_ok=True)

        return embedding
