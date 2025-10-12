from fastapi import APIRouter, Body
from app.services.llm_client import query_llm

router = APIRouter()

@router.post("/chat")
def chat(prompt: str = Body(..., embed=True)):
    """Send a chat message to the local LLM."""
    response = query_llm(prompt)
    return {"response": response}
