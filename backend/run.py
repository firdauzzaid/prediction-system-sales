import uvicorn
import os
import sys
from pathlib import Path

# Tambahkan current directory ke path
sys.path.insert(0, str(Path(__file__).parent))

if __name__ == "__main__":
    # Get port from environment variable (Railway will set this)
    port = int(os.getenv("PORT", 8000))
    
    # Get root directory (parent of backend)
    root_dir = Path(__file__).parent.parent
    backend_dir = Path(__file__).parent
    
    print("="*60)
    print("Mini AI Sales Prediction API")
    print("="*60)
    print(f"Root directory: {root_dir}")
    print(f"Backend directory: {backend_dir}")
    print(f"Environment PORT: {os.getenv('PORT', 'not set')}")
    print(f"Using port: {port}")
    
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
        print(f"\n Warning: {data_path} not found!")
        print("   Please run: python backend/data/generate_sample_data.py")
    else:
        print(f"\n Data file found: {data_path}")
        print(f"  Size: {data_path.stat().st_size} bytes")
    
    # Check if model exists (di root/ml)
    model_path = ml_dir / "model.pkl"
    if not model_path.exists():
        print(f"\n Warning: {model_path} not found!")
        print("   Please run: python backend/ml/train_model.py")
    else:
        print(f"\n Model file found: {model_path}")
        print(f"  Size: {model_path.stat().st_size} bytes")
    
    print("\n" + "="*60)
    print("Starting Mini AI Sales Prediction API")
    print("="*60)
    print(f"API Docs: http://localhost:{port}/api/docs")
    print(f"Health Check: http://localhost:{port}/health")
    print("="*60 + "\n")
    
    # Jalankan uvicorn dengan port dari environment
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        reload=False,  # False untuk production
        log_level="info",
        access_log=True  # Enable access logs for debugging
    )