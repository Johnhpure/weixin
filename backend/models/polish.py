from pydantic import BaseModel

class PolishRequest(BaseModel):
    content: str
    style: str = "Conversational"
    model_provider: str = "gemini"

class PolishResponse(BaseModel):
    polished_content: str
