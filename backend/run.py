import uvicorn
import os
import sys
from pathlib import Path

# Tambahkan parent directory ke path
sys.path.insert(0, str(Path(__file__).parent))

if __name__ == "__main__":
    # Get root directory (parent of backend)
    root_dir = Path(__file__).parent.parent
    backend_dir = Path(__file__).parent
    
    print(f"Root directory: {root_dir}")
    print(f"Backend directory: {backend_dir}")
    
    # Create necessary directories if they don't exist (di root)
    data_dir = root_dir / "data"
    ml_dir = root_dir / "ml"
    
    data_dir.mkdir(exist_ok=True)
    ml_dir.mkdir(exist_ok=True)
    
    print(f"Data directory: {data_dir}")
    print(f"ML directory: {ml_dir}")
    
    # Check if data exists (di root/data)
    data_path = data_dir / "sales_data.csv"
    if not data_path.exists():
        print(f"\n  Warning: {data_path} not found!")
        print("   Please run: python backend/data/generate_sample_data.py")
    else:
        print(f"\n Data file found: {data_path}")
    
    # Check if model exists (di root/ml)
    model_path = ml_dir / "model.pkl"
    if not model_path.exists():
        print(f"Warning: {model_path} not found!")
        print("Please run: python backend/ml/train_model.py")
    else:
        print(f"Model file found: {model_path}")
    
    print("\n" + "="*60)
    print("Starting Mini AI Sales Prediction API")
    print("="*60)
    print(f"Docs: http://localhost:8000/api/docs")
    print(f"Redoc: http://localhost:8000/api/redoc")
    print(f"Health: http://localhost:8000/health")
    print("="*60 + "\n")
    
    # Jalankan uvicorn dengan parameter yang benar
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )