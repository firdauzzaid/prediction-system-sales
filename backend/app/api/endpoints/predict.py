from fastapi import APIRouter, Depends, HTTPException
from app.models.schemas import PredictionRequest, PredictionResponse
from app.api.deps import get_current_active_user
from app.services.ml_service import ml_service
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/predict", response_model=PredictionResponse)
async def predict_product_status(
    prediction_request: PredictionRequest,
    current_user = Depends(get_current_active_user)
):
    """
    Predict product status using Random Forest model
    
    - **jumlah_penjualan**: Number of sales (must be > 0)
    - **harga**: Price per unit (must be > 0)
    - **diskon**: Discount percentage (0-100)
    
    Returns prediction of "Laris" or "Tidak" with probability scores
    """
    try:
        # Check if model is loaded
        if not ml_service.is_model_loaded:
            raise HTTPException(
                status_code=503,
                detail="Model not loaded. Please train model first."
            )
        
        # Make prediction
        prediction, probability = ml_service.predict(
            jumlah_penjualan=prediction_request.jumlah_penjualan,
            harga=prediction_request.harga,
            diskon=prediction_request.diskon
        )
        
        logger.info(f"Prediction made: {prediction} for input {prediction_request}")
        
        return PredictionResponse(
            success=True,
            prediction=prediction,
            probability=probability,
            message="Prediction successful"
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in predict_product_status: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )

@router.get("/predict/model-info")
async def get_model_info(current_user = Depends(get_current_active_user)):
    """
    Get information about the loaded Random Forest model
    """
    try:
        return ml_service.get_model_info()
    except Exception as e:
        logger.error(f"Error in get_model_info: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error getting model info: {str(e)}"
        )