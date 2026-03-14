#!/usr/bin/env python
"""
Script to display evaluation results of the trained model
"""

import joblib
import pandas as pd
import numpy as np
import json
import os

def load_model_info():
    """
    Load and display model information
    """
    print("\n" + "="*60)
    print("MODEL EVALUATION RESULTS")
    print("="*60)
    
    model_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Load metadata
    metadata_path = os.path.join(model_dir, 'metadata.json')
    if os.path.exists(metadata_path):
        with open(metadata_path, 'r') as f:
            metadata = json.load(f)
        
        print("\n Model Metadata:")
        print(f"   Model Type: {metadata['model_type']}")
        print(f"   Features: {', '.join(metadata['features'])}")
        print(f"   Classes: {metadata['classes']}")
        print(f"   Accuracy: {metadata['accuracy']:.4f}")
        print(f"   Training Date: {metadata['training_date']}")
        print(f"   Training Samples: {metadata['training_samples']}")
        print(f"   Test Samples: {metadata['test_samples']}")
    
    # Load model
    model_path = os.path.join(model_dir, 'model.pkl')
    if os.path.exists(model_path):
        model = joblib.load(model_path)
        print(f"\n Model loaded: {type(model).__name__}")
        
        if hasattr(model, 'get_params'):
            print("\n Model Parameters:")
            params = model.get_params()
            for key, value in list(params.items())[:10]:  # Show first 10 params
                print(f"   {key}: {value}")
    
    # Load label encoder
    encoder_path = os.path.join(model_dir, 'label_encoder.pkl')
    if os.path.exists(encoder_path):
        encoder = joblib.load(encoder_path)
        print(f"\n Label Encoding:")
        print(f"   Classes: {encoder.classes_.tolist()}")
        print(f"   Mapping: {dict(zip(encoder.classes_, encoder.transform(encoder.classes_)))}")
    
    print("\n" + "="*60)
    print("Model evaluation complete")
    print("="*60)

if __name__ == "__main__":
    load_model_info()