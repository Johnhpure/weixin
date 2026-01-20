from fastapi import APIRouter, HTTPException
from models.topic import TopicInput, TopicResponse
from agents.topic_agent import TopicAgent

router = APIRouter(prefix="/api/topics", tags=["topics"])

@router.post("/generate", response_model=TopicResponse)
async def generate_topics(input_data: TopicInput):
    agent = TopicAgent()
    try:
        result = await agent.generate_topics(input_data.keyword, input_data.model_provider)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
