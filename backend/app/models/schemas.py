from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Login schemas
class LoginRequest(BaseModel):
    username: str
    password: str

# Sales data schemas
class SalesData(BaseModel):
    product_id: str
    product_name: str
    jumlah_penjualan: int
    harga: float
    diskon: float
    status: str
    
    class Config:
        from_attributes = True

class SalesResponse(BaseModel):
    success: bool
    data: Optional[List[SalesData]] = None
    message: Optional[str] = None
    total: Optional[int] = None

# Prediction schemas
class PredictionRequest(BaseModel):
    jumlah_penjualan: int = Field(..., gt=0, description="Jumlah penjualan harus lebih dari 0")
    harga: float = Field(..., gt=0, description="Harga harus lebih dari 0")
    diskon: float = Field(..., ge=0, le=100, description="Diskon antara 0-100 persen")
    
    @validator('jumlah_penjualan')
    def validate_jumlah_penjualan(cls, v):
        if v <= 0:
            raise ValueError('Jumlah penjualan harus lebih dari 0')
        return v
    
    @validator('harga')
    def validate_harga(cls, v):
        if v <= 0:
            raise ValueError('Harga harus lebih dari 0')
        return v
    
    @validator('diskon')
    def validate_diskon(cls, v):
        if v < 0 or v > 100:
            raise ValueError('Diskon harus antara 0-100 persen')
        return v

class PredictionResponse(BaseModel):
    success: bool
    prediction: Optional[str] = None
    probability: Optional[Dict[str, float]] = None  # String keys, float values
    message: Optional[str] = None

# Error response schema
class ErrorResponse(BaseModel):
    detail: str
    status_code: int