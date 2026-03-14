#!/usr/bin/env python
"""
Machine Learning Module for Sales Prediction
Menggunakan Random Forest Classifier untuk hasil yang stabil
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib
import os
import json
from datetime import datetime
from pathlib import Path
import warnings
warnings.filterwarnings('ignore')

def train_random_forest():
    """
    Train Random Forest model for sales prediction
    """
    print("\n" + "="*60)
    print("RANDOM FOREST CLASSIFIER TRAINING")
    print("="*60)
    
    # Get root directory
    root_dir = Path(__file__).parent.absolute()
    project_root = root_dir.parent
    data_path = project_root / "data" / "sales_data.csv"
    model_dir = project_root / "ml"
    
    print(f"Root directory: {root_dir}")
    print(f"Data path: {data_path}")
    print(f"Model directory: {model_dir}")
    
    # Create model directory if it doesn't exist
    model_dir.mkdir(exist_ok=True)
    
    # Step 1: Load data
    print("\n" + "-"*40)
    print("STEP 1: LOADING DATA")
    print("-"*40)
    
    try:
        df = pd.read_csv(data_path)
        print(f"Data loaded: {len(df)} records")
        print(f"Columns: {list(df.columns)}")
    except Exception as e:
        print(f"Error loading data: {e}")
        return None
    
    # Step 2: Check class distribution
    print("\n" + "-"*40)
    print("STEP 2: CLASS DISTRIBUTION")
    print("-"*40)
    
    class_dist = df['status'].value_counts()
    for status, count in class_dist.items():
        pct = count / len(df) * 100
        print(f"   {status}: {count} samples ({pct:.1f}%)")
    
    # Step 3: Prepare features and target
    print("\n" + "-"*40)
    print("STEP 3: PREPARING FEATURES")
    print("-"*40)
    
    feature_columns = ['jumlah_penjualan', 'harga', 'diskon']
    X = df[feature_columns]
    y = df['status']
    
    print(f"Features shape: {X.shape}")
    print(f"Features: {feature_columns}")
    
    # Encode target
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)
    
    print(f"Target encoding: {dict(zip(label_encoder.classes_, label_encoder.transform(label_encoder.classes_)))}")
    
    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    print(f"Features scaled (mean ≈ 0, std ≈ 1)")
    
    # Step 4: Split data
    print("\n" + "-"*40)
    print("STEP 4: TRAIN-TEST SPLIT")
    print("-"*40)
    
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y_encoded, 
        test_size=0.2, 
        random_state=42,
        stratify=y_encoded
    )
    
    print(f"Training set: {len(X_train)} samples")
    print(f"Testing set: {len(X_test)} samples")
    
    # Step 5: Train Random Forest
    print("\n" + "-"*40)
    print("STEP 5: TRAINING RANDOM FOREST")
    print("-"*40)
    
    rf_model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        class_weight='balanced',
        n_jobs=-1
    )
    
    rf_model.fit(X_train, y_train)
    print("Model training complete")
    
    # Step 6: Evaluate
    print("\n" + "-"*40)
    print("STEP 6: MODEL EVALUATION")
    print("-"*40)
    
    y_pred = rf_model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"Accuracy: {accuracy:.4f}")
    print("\n Classification Report:")
    print(classification_report(y_test, y_pred, target_names=label_encoder.classes_))
    
    # Confusion Matrix
    cm = confusion_matrix(y_test, y_pred)
    print("\n Confusion Matrix:")
    print("                Predicted")
    print("                Tidak  Laris")
    print(f"Actual Tidak     {cm[0,0]:5d}  {cm[0,1]:5d}")
    print(f"       Laris     {cm[1,0]:5d}  {cm[1,1]:5d}")
    
    # Feature Importance
    print("\n" + "-"*40)
    print("STEP 7: FEATURE IMPORTANCE")
    print("-"*40)
    
    importance = pd.DataFrame({
        'feature': feature_columns,
        'importance': rf_model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    for idx, row in importance.iterrows():
        print(f"   {row['feature']}: {row['importance']:.4f} ({row['importance']*100:.1f}%)")
    
    # Step 8: Save model and artifacts
    print("\n" + "-"*40)
    print("STEP 8: SAVING MODEL")
    print("-"*40)
    
    # Save model
    model_path = model_dir / "model.pkl"
    joblib.dump(rf_model, model_path)
    print(f"Model saved to: {model_path}")
    
    # Save label encoder
    encoder_path = model_dir / "label_encoder.pkl"
    joblib.dump(label_encoder, encoder_path)
    print(f"Label encoder saved to: {encoder_path}")
    
    # Save scaler
    scaler_path = model_dir / "scaler.pkl"
    joblib.dump(scaler, scaler_path)
    print(f"Scaler saved to: {scaler_path}")
    
    # Save metadata
    metadata = {
        'model_type': 'RandomForestClassifier',
        'features': feature_columns,
        'classes': label_encoder.classes_.tolist(),
        'accuracy': float(accuracy),
        'training_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'training_samples': len(X_train),
        'test_samples': len(X_test),
        'n_estimators': 100,
        'max_depth': 10,
        'feature_importance': importance.to_dict('records')
    }
    
    metadata_path = model_dir / "metadata.json"
    with open(metadata_path, 'w') as f:
        json.dump(metadata, f, indent=2)
    print(f"Metadata saved to: {metadata_path}")
    
    # Step 9: Sample predictions
    print("\n" + "-"*40)
    print("STEP 9: SAMPLE PREDICTIONS")
    print("-"*40)
    
    test_cases = [
        {"jumlah_penjualan": 500, "harga": 25000, "diskon": 20, "desc": "High sales, medium price, good discount"},
        {"jumlah_penjualan": 50, "harga": 500000, "diskon": 5, "desc": "Low sales, high price, low discount"},
        {"jumlah_penjualan": 200, "harga": 15000, "diskon": 0, "desc": "Medium sales, low price, no discount"},
        {"jumlah_penjualan": 1000, "harga": 100000, "diskon": 30, "desc": "Very high sales, high price, high discount"},
    ]
    
    for i, case in enumerate(test_cases, 1):
        # Create feature array
        features = pd.DataFrame([[case['jumlah_penjualan'], case['harga'], case['diskon']]], 
                               columns=feature_columns)
        features_scaled = scaler.transform(features)
        
        # Predict
        pred_encoded = rf_model.predict(features_scaled)[0]
        pred_label = label_encoder.inverse_transform([pred_encoded])[0]
        
        # Get probability
        proba = rf_model.predict_proba(features_scaled)[0]
        proba_dict = dict(zip(label_encoder.classes_, proba))
        
        print(f"\n{i}. {case['desc']}")
        print(f"   Input: Sales={case['jumlah_penjualan']}, Price={case['harga']:,}, Discount={case['diskon']}%")
        print(f"   Prediction: {pred_label}")
        print(f"   Probability: {proba_dict}")
    
    # Final summary
    print("\n" + "="*60)
    print("TRAINING COMPLETED SUCCESSFULLY")
    print("="*60)
    print(f"Model: Random Forest Classifier")
    print(f"Accuracy: {accuracy:.4f}")
    print(f"Features: {feature_columns}")
    print(f"Model saved: {model_path}")
    print("="*60)
    
    return {
        'model': rf_model,
        'encoder': label_encoder,
        'scaler': scaler,
        'accuracy': accuracy,
        'metadata': metadata
    }

if __name__ == "__main__":
    result = train_random_forest()