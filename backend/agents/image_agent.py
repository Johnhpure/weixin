from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from services.llm_provider import LLMProvider
from services.image_service import ImageService
from models.image import ImageResponse

class ImageAgent:
    def __init__(self):
        self.service = ImageService()

    async def generate(self, context: str, style: str) -> ImageResponse:
        # 1. Generate Prompt
        llm = LLMProvider.get_model("gemini")
        
        prompt_template = ChatPromptTemplate.from_template(
            """Create a detailed English image generation prompt for DALL-E based on this article section.
            Context: {context}
            Style: {style}
            
            Return ONLY the prompt string.
            """
        )
        
        chain = prompt_template | llm | StrOutputParser()
        image_prompt = await chain.ainvoke({"context": context[:1000], "style": style})
        
        # 2. Generate Image
        url = await self.service.generate_image(image_prompt)
        
        return ImageResponse(url=url, prompt=image_prompt)
