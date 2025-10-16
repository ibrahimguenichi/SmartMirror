import os
import requests
from app.config import LLM_API_URL

def query_llm(prompt: str, model: str = "llama3.1:8b") -> str:
    """Send a prompt to the LLM container and return the generated text."""
    url = f"{LLM_API_URL}/api/generate"
    
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False
    }
    
    print(payload)

    try:
        response = requests.post(url, json=payload, timeout=60)
        response.raise_for_status()
        data = response.json()
        return data.get("response", "").strip()
    except requests.exceptions.RequestException as e:
        print(f"LLM API error: {e}")
        return "Error communicating with LLM."
