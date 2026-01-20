import os
import httpx
from typing import List, Dict, Optional
from models.topic import SearchResult

class SearchService:
    def __init__(self):
        self.api_key = os.getenv("TAVILY_API_KEY")
        self.base_url = "https://api.tavily.com/search"

    async def search(self, query: str, max_results: int = 5) -> List[SearchResult]:
        if not self.api_key:
            print("Warning: TAVILY_API_KEY not found. Returning mock data.")
            return self._get_mock_results(query)

        async with httpx.AsyncClient() as client:
            payload = {
                "api_key": self.api_key,
                "query": query,
                "search_depth": "basic",
                "include_images": False,
                "max_results": max_results
            }
            try:
                response = await client.post(self.base_url, json=payload, timeout=10.0)
                response.raise_for_status()
                data = response.json()
                
                results = []
                for result in data.get("results", []):
                    results.append(SearchResult(
                        title=result.get("title", ""),
                        url=result.get("url", ""),
                        content=result.get("content", "")[:300], # Trucate context
                        published_date=result.get("published_date")
                    ))
                return results
            except Exception as e:
                print(f"Search API Error: {e}")
                return []

    def _get_mock_results(self, query: str) -> List[SearchResult]:
        return [
            SearchResult(
                title=f"Why {query} is trending now",
                url="https://example.com/mock1",
                content=f"This is a mock search result describing why {query} is important in 2024. It covers the latest trends and user reactions.",
                published_date="2024-01-20"
            ),
            SearchResult(
                title=f"The complete guide to {query}",
                url="https://example.com/mock2",
                content=f"Comprehensive analysis of {query} focusing on technical details and future outlook.",
                published_date="2024-01-19"
            )
        ]
