import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "RunPod SDK Studio & Serverless Playground"
    VERSION: str = "1.0.0"
    DEBUG: bool = True
    RUNPOD_API_KEY: str = os.getenv("RUNPOD_API_KEY", "")
    # Default to Mock Mode if no live API key is provided
    MOCK_MODE: bool = os.getenv("MOCK_MODE", "true").lower() == "true" or not os.getenv("RUNPOD_API_KEY")

    class Config:
        env_file = ".env"

settings = Settings()
