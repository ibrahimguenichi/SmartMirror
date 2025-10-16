import httpx
from typing import Any, List, Optional
from app.config import SPRING_BACKEND_URL, AI_SERVICE_TOKEN

async def send_embedding(userId: str, embedding: List[float], url: str) -> Any:
    """Send embedding with userId asynchronously to the given URL."""
    async with httpx.AsyncClient() as client:
        resp = await client.post(url, json={"userId": userId, "embedding": embedding})
        resp.raise_for_status()

        text = resp.text
        print(f"Backend raw response ({resp.status_code}): {text}")

        # Try parsing JSON safely
        try:
            return resp.json()
        except ValueError:
            return {"status": "ok", "message": text or "No JSON returned"}

async def send_embedding_without_user(embedding: List[float], url: str) -> Any:
    """Send embedding without userId asynchronously to the given URL."""
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json={"embedding": embedding})
        response.raise_for_status()
        return response.json()

async def fetch_ai_profile(userId: str) -> Optional[dict[str, Any]]:
    """Fetch AI profile for a given user from Spring backend using service token."""
    url = f"{SPRING_BACKEND_URL}/users/{userId}/ai-profile"
    headers = {"X-AI-Service-Token": AI_SERVICE_TOKEN} if AI_SERVICE_TOKEN else {}
    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.get(url, headers=headers)
        print("backend res: ", resp)
        if resp.status_code == 200:
            return resp.json()
        return None
