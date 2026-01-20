import os
import uuid
from fastapi import UploadFile
from pathlib import Path

# Placeholder for real generation
import httpx 

class ImageService:
    def __init__(self):
        self.storage_path = Path("/data/images") # Map to docker volume or local folder
        self.storage_path.mkdir(parents=True, exist_ok=True)
        # In Docker, we map /data to ./data locally.
        # Nginx or FastAPI StaticFiles will serve this path.
        self.public_url_base = "http://localhost:8000/static/images"

    async def generate_image(self, prompt: str) -> str:
        """
        Mock generation or call DALL-E.
        Returning a placeholder for now to save tokens/cost during dev.
        """
        print(f"Generating Image for prompt: {prompt}")
        
        # 1. Real Logic (Commented out for safety/cost)
        # response = await openai.images.generate(...)
        # image_url = response.data[0].url
        # image_content = download(image_url)
        
        # 2. Mock Logic: Download a random placeholder
        filename = f"{uuid.uuid4()}.jpg"
        file_path = self.storage_path / filename
        
        # Determine category based on prompt keywords for a better mock
        category = "tech"
        if "nature" in prompt.lower(): category = "nature"
        
        mock_url = f"https://placehold.co/600x400/png?text={category}"
        
        async with httpx.AsyncClient() as client:
            resp = await client.get(mock_url)
            with open(file_path, "wb") as f:
                f.write(resp.content)
                
        return f"{self.public_url_base}/{filename}"

    async def save_upload(self, file: UploadFile) -> str:
        filename = f"{uuid.uuid4()}_{file.filename}"
        file_path = self.storage_path / filename
        with open(file_path, "wb") as f:
            f.write(await file.read())
        return f"{self.public_url_base}/{filename}"
