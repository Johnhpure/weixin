from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from services.llm_provider import LLMProvider

class WriterAgent:
    async def write_section(self, section_title: str, section_brief: str, context: str, tone: str, provider: str = "gemini") -> str:
        llm = LLMProvider.get_model(provider, temperature=0.7)
        
        system_prompt = f"""You are a top-tier Columnist. Write one specific section of an article.
        
        Tone: {tone}
        Style rules:
        - Use short paragraphs.
        - Avoid AI cliches like "In conclusion", "It is worth noting".
        - Be direct, engaging, and flow naturally.
        - Output Markdown format.
        """
        
        user_prompt = f"""
        Section Title: {section_title}
        Section Goal: {section_brief}
        Background Context: {context}
        
        Write the content for this section now.
        """
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("user", user_prompt)
        ])
        
        chain = prompt | llm | StrOutputParser()
        
        return await chain.ainvoke({})
