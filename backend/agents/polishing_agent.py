from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from services.llm_provider import LLMProvider

class PolishingAgent:
    async def polish_content(self, content: str, style: str = "Conversational", provider: str = "gemini") -> str:
        llm = LLMProvider.get_model(provider, temperature=0.8) # Higher temp for creativity
        
        system_prompt = """You are a professional Editor for WeChat Official Accounts.
        Your goal is to "Humanize" AI-generated text.
        
        Rules for "De-AI":
        1. Remove robotic transitions like "In conclusion", "It is important to note", "Firstly/Secondly".
        2. Use rhetorical questions and conversational hooks.
        3. Vary sentence length. Mix short punchy sentences with longer descriptive ones.
        4. Inject emotion and strong opinions where appropriate.
        5. Use Chinese internet slang or idioms appropriately if the context fits.
        
        Target Style: {style}
        """
        
        user_prompt = f"""
        Original Text:
        {content}
        
        Rewrite this text to sound more human and engaging. Keep the formatting (Markdown).
        """
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("user", user_prompt)
        ])
        
        chain = prompt | llm | StrOutputParser()
        
        return await chain.ainvoke({"style": style})
