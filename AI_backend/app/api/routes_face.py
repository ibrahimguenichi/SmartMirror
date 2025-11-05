from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.face_service import FaceService
import tempfile
from app.api.api_client import send_embedding
from app.models.face_detector import FaceDetector
from typing import Any, List
from app.config import SPRING_BACKEND_URL

router = APIRouter()
service = FaceService()


@router.post("/extract-embedding/")
async def extract_embedding(userId: int, file: UploadFile = File(...)) -> dict[str, Any]:
    """
    Extract embedding from image and send it to backend with userId.
    """
    detector = FaceDetector()
    try:
        # Save uploaded file temporarily
        contents = await file.read()
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
            tmp.write(contents)
            tmp_path = tmp.name

        # Get embedding
        embedding: List[float] = detector.get_embedding(tmp_path)  # make sure get_embedding returns List[float]

        # Send to Spring Boot backend (convert userId to str if needed)
        response: Any = await send_embedding(str(userId), embedding, f"{SPRING_BACKEND_URL}/face-recognition/save_embedding")
        print(f"Response from Spring Boot: {response}")

        return {"status": "success", "embedding": embedding, "backend_response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/embedding-without-user/")
async def preview_embedding(file: UploadFile = File(...)) -> dict[str, Any]:
    """
    Extract embedding from image and return it.
    """
    try:
        embedding: List[float] = await service.get_embedding_from_file(file)
        return {"status": "success", "embedding": embedding}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
