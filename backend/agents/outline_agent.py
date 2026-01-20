from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from services.llm_provider import LLMProvider
from models.article import OutlineSection, OutlineResponse

class OutlineAgent:
    async def generate_outline(self, topic: str, context: str, provider: str = "gemini") -> OutlineResponse:
        llm = LLMProvider.get_model(provider, temperature=0.7)
        
        system_prompt = """You are an expert Content Architect for WeChat Official Accounts.
        Your task is to structure a viral article based on a topic and context.
        
        Create a 3-5 section outline.
        Structure:
        1. Hook/Intro (Catchy opening)
        2. Body Paragraphs (Deep dive/Analysis)
        3. Conclusion/Call to Action
        
        Output JSON format: 
        { "sections": [ {"title": "...", "description": "...", "key_points": ["point1", "point2"]} ] }
        """
        
        user_prompt = f"""
        Topic: {topic}
        Context Info: {context}
        
        Generate a compelling outline.
        """
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("user", user_prompt)
        ])
        
        chain = prompt | llm | JsonOutputParser()
        
        try:
            result = await chain.ainvoke({})
            sections_data = result.get("sections", [])
            sections = [OutlineSection(**s) for s in sections_data]
            return OutlineResponse(sections=sections)
        except Exception as e:
            print(f"Outline Gen Error: {e}")
            # Fallback
            return OutlineResponse(sections=[
                OutlineSection(title="Introduction", description="Introduce the topic", key_points=[]),
                OutlineSection(title="Main Analysis", description="Analyze the core details", key_points=[]),
                OutlineSection(title="Conclusion", description="Wrap up", key_points=[])
            ])
