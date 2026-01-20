import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load env vars
load_dotenv()

from api import topics, articles, images

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Startup: Initializing Application")
    yield
    print("Shutdown: Cleaning up")

app = FastAPI(
    title="WeCreate AI Backend",
    version="0.1.0",
    lifespan=lifespan
)

# CORS Config
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(topics.router)
app.include_router(articles.router)
app.include_router(images.router)

# Mount Static Files for Images
import os
os.makedirs("/data/images", exist_ok=True)
app.mount("/static/images", StaticFiles(directory="/data/images"), name="images")

@app.get("/")
def read_root():
    return {"message": "Welcome to WeCreate AI API", "status": "running"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
