from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from jose import JWTError

from app.core.config import settings
from app.api.endpoints import login, sales, predict
from app.utils.error_handlers import (
    validation_exception_handler,
    jwt_error_handler,
    general_exception_handler
)
from app.services.data_service import data_service
from app.services.ml_service import ml_service

import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

# Create FastAPI app - INI YANG DICARI OLEH UVICORN
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="""
    Mini AI Sales Prediction System API
    
    Features:
    - Authentication with JWT
    - Sales data management
    - ML-based product status prediction
    """,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://prediction-system-sales-production.up.railway.app", "https://prediction-system-sales.vercel.app"],  # React/Next.js default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add exception handlers
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(JWTError, jwt_error_handler)
app.add_exception_handler(Exception, general_exception_handler)

# Include routers
app.include_router(login.router, prefix="/api", tags=["Authentication"])
app.include_router(sales.router, prefix="/api", tags=["Sales Data"])
app.include_router(predict.router, prefix="/api", tags=["Prediction"])

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Mini AI Sales Prediction API",
        "version": settings.VERSION,
        "docs": "/api/docs",
        "redoc": "/api/redoc"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "data_service": "loaded" if not data_service.df.empty else "empty",
        "ml_service": "loaded" if ml_service.is_model_loaded else "not_loaded"
    }

@app.on_event("startup")
async def startup_event():
    """Actions to run on application startup"""
    logger.info("Starting up Mini AI Sales Prediction API...")
    logger.info(f"Data file path: {settings.CSV_FILE_PATH}")
    logger.info(f"Model file path: {settings.MODEL_FILE_PATH}")

    # Check if data is loaded
    if data_service.df.empty:
        logger.warning("Data is empty. Please check CSV file.")
    else:
        logger.info(f"Data loaded: {len(data_service.df)} records")

    # Check if model is loaded
    if not ml_service.is_model_loaded:
        logger.warning("Model not loaded. Please train model first.")
    else:
        logger.info("Model loaded successfully")

@app.on_event("shutdown")
async def shutdown_event():
    """Actions to run on application shutdown"""
    logger.info("Shutting down Mini AI Sales Prediction API...")