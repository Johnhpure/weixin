from typing import List, Optional
from pydantic import BaseModel, Field

# --- Outline Models ---
class OutlineSection(BaseModel):
    title: str = Field(..., description="Section Title")
    description: str = Field(..., description="Brief guidance on what this section covers")
    key_points: List[str] = Field(default_factory=list, description="Bullet points to cover")

class OutlineRequest(BaseModel):
    topic_title: str
    search_summary: str = ""
    target_audience: str = "General"
    model_provider: str = "gemini"

class OutlineResponse(BaseModel):
    sections: List[OutlineSection]

# --- Writing Models ---
class WriteSectionRequest(BaseModel):
    section_title: str
    section_description: str
    context_summary: str
    tone: str = "Professional yet Engaging"
    model_provider: str = "gemini"

class WriteSectionResponse(BaseModel):
    content: str
    
class FullArticleRequest(BaseModel):
    topic: str
    outline: List[OutlineSection]
    tone: str = "Professional"
    model_provider: str = "gemini"
