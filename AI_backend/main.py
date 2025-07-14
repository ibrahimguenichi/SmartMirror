from fastapi import FastAPI, UploadFile, File, HTTPException
from app.face_detector import FaceDetector
from app.api_client import send_embedding, send_embedding_without_user
from app.utils import normalize_embedding
import tempfile

app = FastAPI()

detector = FaceDetector()

@app.post("/api/face-recognition/extract-embedding/")
async def extract_embedding(userId: int, file: UploadFile = File(...)):
    try:
        contents = await file.read()
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
            tmp.write(contents)
            tmp_path = tmp.name

        # Get embedding
        embedding = detector.get_embedding(tmp_path)
        print(f"Embedding extracted: {embedding[:5]}...")

        # Send to Spring Boot backend
        response = send_embedding(userId, embedding.tolist(), "http://localhost:9090/api/face-recognition/save_embedding")
        print(f"Response from Spring Boot: {response}")

        # return {"status": "success", "embeddings": embedding.tolist(), "backend_response": response}
        return {"status": "success", "embedding": embedding.tolist()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/api/face-recognition/embedding-without-user/")
async def preview_embedding(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
            tmp.write(contents)
            tmp_path = tmp.name

        # Get embedding and normalize
        embedding = detector.get_embedding(tmp_path)
        print(f"Preview embedding: {embedding[:5]}...")

        return {"status": "success", "embedding": embedding.tolist()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

