import os
from pathlib import Path
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Mini AI Sales Prediction API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # JWT Settings
    SECRET_KEY: str = "ee548c32-9749-4507-8a50-093efd29516e"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Dummy user (for testing)
    DUMMY_USERNAME: str = "admin"
    DUMMY_PASSWORD: str = "password"
    
    # File paths - data dan ml di root
    # Prioritas: environment variable > absolute path Railway > local development path
    CSV_FILE_PATH: str = os.getenv(
        "CSV_FILE_PATH", 
        "/app/data/sales_data.csv" if Path("/app").exists() 
        else str(Path(__file__).parent.parent.parent.parent / "data" / "sales_data.csv")
    )
    MODEL_FILE_PATH: str = os.getenv(
        "MODEL_FILE_PATH",
        "/app/ml/model.pkl" if Path("/app").exists()
        else str(Path(__file__).parent.parent.parent.parent / "ml" / "model.pkl")
    )
    
    class Config:
        case_sensitive = True

settings = Settings()