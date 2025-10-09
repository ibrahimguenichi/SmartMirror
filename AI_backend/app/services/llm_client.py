import os
import requests

LLM_API_URL = os.getenv("LLM_API_URL", "http://localhost:11434")

def query_llm(prompt: str, model: str = "mistral") -> str:
    """Send a prompt to the LLM container and return the generated text."""
    url = f"{LLM_API_URL}/api/generate"
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False
    }

    try:
        response = requests.post(url, json=payload, timeout=60)
        response.raise_for_status()
        data = response.json()
        return data.get("response", "").strip()
    except requests.exceptions.RequestException as e:
        print(f"LLM API error: {e}")
        return "Error communicating with LLM."
