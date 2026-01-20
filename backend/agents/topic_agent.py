import json
from typing import List
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import ValidationError

from services.search_service import SearchService
from services.llm_provider import LLMProvider
from models.topic import TopicResponse, TopicIdea, SearchResult

class TopicAgent:
    def __init__(self):
        self.search_service = SearchService()

    async def generate_topics(self, keyword: str, provider: str = "gemini") -> TopicResponse:
        # 1. Search Web
        search_results = await self.search_service.search(keyword)
        
        # 2. Prepare Context
        context_text = "\n\n".join([f"Title: {r.title}\nContent: {r.content}" for r in search_results])
        if not context_text:
            context_text = "No recent external information found. Rely on internal knowledge."

        # 3. Setup LLM & Prompt
        llm = LLMProvider.get_model(provider, temperature=0.8)
        
        system_prompt = """You are a professional WeChat Official Account Editor-in-Chief. 
        Your goal is to brainstorm viral article topics based on a keyword and recent web search results.
        
        Output format must be a JSON object with this key: 'topics': [ {'title': '...', 'rationale': '...', 'angle': '...'} ]
        
        The 'title' should be catchy, click-baity but professional, typical Chinese WeChat style.
        The 'angle' can be: 'Deep Analysis', 'Emotional', 'Financial/Career', 'News Report'.
        """
        
        user_prompt = f"""
        Keyword: {keyword}
        
        Recent Search Context:
        {context_text}
        
        Task: Generate 5 unique topic ideas compatible with the keyword and context.
        """
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("user", user_prompt)
        ])
        
        # 4. Chain Execution
        chain = prompt | llm | JsonOutputParser()
        
        try:
            result = await chain.ainvoke({})
            # Parse result into Pydantic models
            topics_data = result.get("topics", [])
            topics = [TopicIdea(**t) for t in topics_data]
            
            # Generate a brief summary of the search context
            summary = self._generate_summary(context_text, llm) # Optional: separate call or simple string
            
            return TopicResponse(
                search_summary=summary,
                sources=search_results,
                topics=topics
            )
            
        except Exception as e:
            print(f"Topic Generation Error: {e}")
            # Fallback
            return TopicResponse(
                search_summary="Error generating topics.",
                sources=search_results,
                topics=[]
            )

    def _generate_summary(self, context: str, llm) -> str:
        # Simple placeholder for now to save tokens/time, or implemented if needed
        return "Based on search results regarding " + context[:50] + "..."
