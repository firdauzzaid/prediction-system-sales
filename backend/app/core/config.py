import os

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
    
    # File paths
    # ROOT_DIR: Path = Path(__file__).parent.parent.parent.parent
    # CSV_FILE_PATH: str = str(ROOT_DIR / "data" / "sales_data.csv")
    # MODEL_FILE_PATH: str = str(ROOT_DIR / "ml" / "model.pkl")

    CSV_FILE_PATH: str = os.getenv("CSV_FILE_PATH", "data/sales_data.csv")
    MODEL_FILE_PATH: str = os.getenv("MODEL_FILE_PATH", "ml/model.pkl")
    
    class Config:
        case_sensitive = True

settings = Settings()