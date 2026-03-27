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
    
    # File paths - Gunakan absolute path dengan prioritas environment variable
    CSV_FILE_PATH: str = ""
    MODEL_FILE_PATH: str = ""
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Set paths dengan prioritas: environment variable > absolute path > relative path
        
        # Cek environment variable dulu
        csv_env = os.getenv("CSV_FILE_PATH")
        model_env = os.getenv("MODEL_FILE_PATH")
        
        if csv_env:
            self.CSV_FILE_PATH = csv_env
        else:
            # Fallback ke absolute path untuk Railway
            base_dir = Path("/app")
            if base_dir.exists():
                self.CSV_FILE_PATH = str(base_dir / "data" / "sales_data.csv")
            else:
                # Fallback terakhir ke relative path untuk development lokal
                self.CSV_FILE_PATH = "data/sales_data.csv"
        
        if model_env:
            self.MODEL_FILE_PATH = model_env
        else:
            base_dir = Path("/app")
            if base_dir.exists():
                self.MODEL_FILE_PATH = str(base_dir / "ml" / "model.pkl")
            else:
                self.MODEL_FILE_PATH = "ml/model.pkl"
    
    class Config:
        case_sensitive = True
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()