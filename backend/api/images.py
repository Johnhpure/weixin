from fastapi import APIRouter, HTTPException
from fastapi.staticfiles import StaticFiles
from models.image import ImageRequest, ImageResponse
from agents.image_agent import ImageAgent

router = APIRouter(prefix="/api/images", tags=["images"])

@router.post("/generate", response_model=ImageResponse)
async def generate_image_api(req: ImageRequest):
    agent = ImageAgent()
    try:
        return await agent.generate(req.article_context, req.style)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
