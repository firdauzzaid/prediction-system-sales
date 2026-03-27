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
    
    # File paths - otomatis menyesuaikan environment
    @property
    def CSV_FILE_PATH(self) -> str:
        """Get CSV file path - data di root folder"""
        # Cek apakah di environment Railway
        if os.path.exists("/app"):
            return "/app/data/sales_data.csv"
        # Untuk development lokal
        else:
            root_dir = Path(__file__).parent.parent.parent.parent
            return str(root_dir / "data" / "sales_data.csv")
    
    @property
    def MODEL_FILE_PATH(self) -> str:
        """Get model file path - ml di root folder"""
        if os.path.exists("/app"):
            return "/app/ml/model.pkl"
        else:
            root_dir = Path(__file__).parent.parent.parent.parent
            return str(root_dir / "ml" / "model.pkl")
    
    class Config:
        case_sensitive = True

settings = Settings()