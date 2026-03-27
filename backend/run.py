import uvicorn
import os
import sys
from pathlib import Path

# Tambahkan current directory ke path
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    
    print("="*60)
    print("Starting Mini AI Sales Prediction API")
    print("="*60)
    print(f"Current directory: {current_dir}")
    print(f"Port: {port}")
    
    # Debug environment variables
    print("\n=== Environment Variables ===")
    print(f"CSV_FILE_PATH: {os.getenv('CSV_FILE_PATH', 'NOT SET')}")
    print(f"MODEL_FILE_PATH: {os.getenv('MODEL_FILE_PATH', 'NOT SET')}")
    
    # Debug file locations
    print("\n=== File Location Check ===")
    
    # Cek di root /app
    data_path_root = Path("/app/data/sales_data.csv")
    model_path_root = Path("/app/ml/model.pkl")
    
    if data_path_root.exists():
        print(f"✓ Data file found at: {data_path_root}")
        print(f"  Size: {data_path_root.stat().st_size} bytes")
    else:
        print(f"✗ Data file NOT found at: {data_path_root}")
        
        # Cek alternative locations
        alt_data = current_dir.parent.parent / "data" / "sales_data.csv"
        if alt_data.exists():
            print(f"  But found at: {alt_data}")
    
    if model_path_root.exists():
        print(f"✓ Model file found at: {model_path_root}")
        print(f"  Size: {model_path_root.stat().st_size} bytes")
    else:
        print(f"✗ Model file NOT found at: {model_path_root}")
        
        alt_model = current_dir.parent.parent / "ml" / "model.pkl"
        if alt_model.exists():
            print(f"  But found at: {alt_model}")
    
    print("="*60 + "\n")
    
    # Jalankan uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        reload=False,
        log_level="info"
    )