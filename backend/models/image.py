from pydantic import BaseModel

class ImageRequest(BaseModel):
    article_context: str
    section_index: int
    style: str = "Flat Vector Illustration"

class ImageResponse(BaseModel):
    url: str
    prompt: str
