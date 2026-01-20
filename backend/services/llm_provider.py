import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI
from langchain_core.language_models import BaseChatModel

class LLMProvider:
    @staticmethod
    def get_model(provider: str = "gemini", temperature: float = 0.7) -> BaseChatModel:
        if provider == "openai":
            api_key = os.getenv("OPENAI_API_KEY")
            base_url = os.getenv("OPENAI_BASE_URL", None) # Support custom endpoints (DeepSeek etc)
            if not api_key:
                raise ValueError("OPENAI_API_KEY is not set")
            return ChatOpenAI(
                model="gpt-3.5-turbo", # Default, can be configurable
                temperature=temperature,
                api_key=api_key,
                base_url=base_url
            )
        
        # Default to Gemini
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            # Fallback for dev without keys? No, better functionality requires keys.
            print("Warning: GEMINI_API_KEY is not set.")
        
        return ChatGoogleGenerativeAI(
            model="gemini-pro",
            temperature=temperature,
            google_api_key=api_key,
            convert_system_message_to_human=True 
        )
