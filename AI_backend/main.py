from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes_face import router as face_router
from app.api.routes_health import router as health_router
from app.api.routes_llm import router as llm_router

app = FastAPI(title="Smart Mirror AI Backend", version="1.0")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(face_router, prefix="/api/face-recognition", tags=["Face Recognition"])
app.include_router(health_router, prefix="/api", tags=["Health"])
app.include_router(llm_router, prefix="/llm", tags=["LLM"])

@app.get("/")
async def root():
    return {"message": "Smart Mirror AI Backend is running 🚀"}
