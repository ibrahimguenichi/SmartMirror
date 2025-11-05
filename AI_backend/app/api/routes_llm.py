from fastapi import APIRouter, Body
from app.services.llm_client import load_fablabs_docs, query_llm
from app.api.api_client import fetch_ai_profile

router = APIRouter()

fablabs_context = load_fablabs_docs()

@router.post("/chat")
async def chat(prompt: str = Body(..., embed=True), userId: str | None = Body(None, embed=True)):
    """Send a chat message to the local LLM. Optionally enrich with user profile."""
    enriched_prompt = prompt
    if userId:
        profile = await fetch_ai_profile(userId)
        print('profile: ', profile)
        if profile:
            user_block = (
                f"\n\n[USER]\n"
                f"user_id={profile.get('userId')}\n"
                f"full_name={profile.get('fullName')}\n"
                f"age_group={profile.get('ageGroup')}\n"
                f"role={profile.get('role')}\n"
                f"team={profile.get('team')}\n"
                f"language={profile.get('language')}\n"
                f"user_notes={profile.get('userNotes')}\n"
                f"[/USER]\n\n"
            )
            # enriched_prompt = f"[CONTEXT]\n{fablabs_context}\n[/CONTEXT]\n\n[${user_block}]\n{prompt}"
            enriched_prompt = user_block + prompt

    response = query_llm(enriched_prompt)
    return {"response": response}
