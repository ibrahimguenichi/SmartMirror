import httpx
from typing import Any, List


async def send_embedding(userId: str, embedding: List[float], url: str) -> Any:
    """Send embedding with userId asynchronously to the given URL."""
    async with httpx.AsyncClient() as client:
        resp = await client.post(url, json={"userId": userId, "embedding": embedding})
        resp.raise_for_status()
        return resp.json()


async def send_embedding_without_user(embedding: List[float], url: str) -> Any:
    """Send embedding without userId asynchronously to the given URL."""
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json={"embedding": embedding})
        response.raise_for_status()
        return response.json()
