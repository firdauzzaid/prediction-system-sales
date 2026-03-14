from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from app.models.schemas import SalesResponse, ErrorResponse
from app.api.deps import get_current_active_user
from app.services.data_service import data_service
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/sales", response_model=SalesResponse)
async def get_sales_data(
    limit: Optional[int] = Query(None, description="Limit number of results"),
    current_user = Depends(get_current_active_user)
):
    """
    Get all sales data from CSV
    
    - **limit**: Optional parameter to limit number of results
    - Requires authentication token
    """
    try:
        # Get all sales data
        sales_data = data_service.get_all_sales()
        
        # Apply limit if specified
        if limit and limit > 0:
            sales_data = sales_data[:limit]
        
        # Get summary
        summary = data_service.get_sales_summary()
        
        return SalesResponse(
            success=True,
            data=sales_data,
            total=len(sales_data),
            message="Data retrieved successfully"
        )
    
    except Exception as e:
        logger.error(f"Error in get_sales_data: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

@router.get("/sales/summary")
async def get_sales_summary(current_user = Depends(get_current_active_user)):
    """
    Get summary statistics of sales data
    """
    try:
        summary = data_service.get_sales_summary()
        return {
            "success": True,
            "data": summary,
            "message": "Summary retrieved successfully"
        }
    except Exception as e:
        logger.error(f"Error in get_sales_summary: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

@router.post("/sales/refresh")
async def refresh_sales_data(current_user = Depends(get_current_active_user)):
    """
    Refresh sales data from CSV file
    """
    try:
        result = data_service.refresh_data()
        return {
            "success": True,
            "message": result["message"]
        }
    except Exception as e:
        logger.error(f"Error in refresh_sales_data: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )