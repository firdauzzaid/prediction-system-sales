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
    
    # File paths - default values, will be overridden by env vars if set
    CSV_FILE_PATH: str = ""
    MODEL_FILE_PATH: str = ""
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        
        # Ambil dari environment variable
        csv_env = os.getenv("CSV_FILE_PATH")
        model_env = os.getenv("MODEL_FILE_PATH")
        
        if csv_env:
            self.CSV_FILE_PATH = csv_env
            print(f"Using CSV_FILE_PATH from env: {self.CSV_FILE_PATH}")
        else:
            # Fallback ke absolute path untuk Railway
            self.CSV_FILE_PATH = "/app/data/sales_data.csv"
            print(f"CSV_FILE_PATH not in env, using default: {self.CSV_FILE_PATH}")
        
        if model_env:
            self.MODEL_FILE_PATH = model_env
            print(f"Using MODEL_FILE_PATH from env: {self.MODEL_FILE_PATH}")
        else:
            # Fallback ke absolute path untuk Railway
            self.MODEL_FILE_PATH = "/app/ml/model.pkl"
            print(f"MODEL_FILE_PATH not in env, using default: {self.MODEL_FILE_PATH}")
        
        # Verifikasi file exists
        print(f"\n=== File Verification ===")
        if Path(self.CSV_FILE_PATH).exists():
            print(f"✓ Data file exists: {self.CSV_FILE_PATH}")
        else:
            print(f"✗ Data file NOT found: {self.CSV_FILE_PATH}")
        
        if Path(self.MODEL_FILE_PATH).exists():
            print(f"✓ Model file exists: {self.MODEL_FILE_PATH}")
        else:
            print(f"✗ Model file NOT found: {self.MODEL_FILE_PATH}")
        print("="*30)
    
    class Config:
        case_sensitive = True

settings = Settings()