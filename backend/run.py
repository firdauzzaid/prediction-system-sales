import uvicorn
import os
import sys
from pathlib import Path

# Tambahkan current directory ke path
sys.path.insert(0, str(Path(__file__).parent))

if __name__ == "__main__":
    # Get port from environment variable dengan validasi
    port_str = os.getenv("PORT", "8000")
    try:
        port = int(port_str)
    except ValueError:
        print(f"Warning: Invalid PORT value '{port_str}', using default 8000")
        port = 8000
    
    is_production = bool(os.getenv("RAILWAY_ENVIRONMENT")) or bool(os.getenv("RAILWAY"))
    
    print("\n" + "="*60)
    print("Mini AI Sales Prediction API")
    print("="*60)
    print(f"Environment: {'Production' if is_production else 'Development'}")
    print(f"PORT from env: {port_str}")
    print(f"Port used: {port}")
    print(f"Working directory: {Path(__file__).parent}")
    print(f"Python path: {sys.path}")
    
    # Check if data and model files exist
    from pathlib import Path
    data_path = Path("/app/data/sales_data.csv")
    model_path = Path("/app/ml/model.pkl")
    
    print(f"Data file exists: {data_path.exists()} at {data_path}")
    print(f"Model file exists: {model_path.exists()} at {model_path}")
    print("="*60 + "\n")
    
    # Jalankan uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        reload=False,
        log_level="info"
    )