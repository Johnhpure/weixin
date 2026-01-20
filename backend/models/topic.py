from typing import List, Optional
from pydantic import BaseModel, Field

class TopicInput(BaseModel):
    keyword: str
    mode: str = "creative"  # creative or imitation
    model_provider: Optional[str] = "gemini" # gemini or openai

class SearchResult(BaseModel):
    title: str
    url: str
    content: str
    published_date: Optional[str] = None

class TopicIdea(BaseModel):
    title: str = Field(..., description="The main headline for the article")
    rationale: str = Field(..., description="Why this topic is good / viral")
    angle: str = Field(..., description="The writing angle (e.g. Technology Analysis, Emotional)")
    
class TopicResponse(BaseModel):
    search_summary: str
    sources: List[SearchResult]
    topics: List[TopicIdea]
