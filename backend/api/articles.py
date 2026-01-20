from models.article import OutlineRequest, OutlineResponse, WriteSectionRequest, WriteSectionResponse
from models.polish import PolishRequest, PolishResponse
from agents.outline_agent import OutlineAgent
from agents.writer_agent import WriterAgent
from agents.polishing_agent import PolishingAgent

router = APIRouter(prefix="/api/articles", tags=["articles"])

@router.post("/outline", response_model=OutlineResponse)
async def generate_outline(req: OutlineRequest):
    agent = OutlineAgent()
    try:
        return await agent.generate_outline(req.topic_title, req.search_summary, req.model_provider)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/write_section", response_model=WriteSectionResponse)
async def write_section(req: WriteSectionRequest):
    agent = WriterAgent()
    try:
        content = await agent.write_section(
            req.section_title, 
            req.section_description, 
            req.context_summary, 
            req.tone, 
            req.model_provider
        )
        return WriteSectionResponse(content=content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/polish", response_model=PolishResponse)
async def polish_content(req: PolishRequest):
    agent = PolishingAgent()
    try:
        res = await agent.polish_content(req.content, req.style, req.model_provider)
        return PolishResponse(polished_content=res)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
