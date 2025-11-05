import requests
from app.config import LLM_API_URL
from pathlib import Path

def query_llm(prompt: str, model: str = "Qwen3:1.7B") -> str:
    """
    Send a prompt to the Ollama LLM container and return the generated text.
    """
    url = f"{LLM_API_URL}/api/generate"

    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False,
    }

    print("Sending to LLM:", payload)

    try:
        response = requests.post(url, json=payload, timeout=120)
        response.raise_for_status()
        data = response.json()
        # Ollama puts the text in 'response'
        return data.get("response", "")
    except requests.exceptions.RequestException as e:
        print(f"LLM API error: {e}")
        return "Error communicating with LLM."


def load_fablabs_docs(base_path: str = "fablabs_docs") -> str:
    """Load all text files from fablabs_docs folder and combine into a single context string."""
    base = Path(base_path)
    all_texts = []

    for file in base.rglob("*"):
        if file.is_file() and file.suffix.lower() in [".txt", ".md"]:
            text = file.read_text(encoding="utf-8")
            all_texts.append(text)
    
    combined_context = "\n\n".join(all_texts)
    return combined_context
