import joblib
import pandas as pd
import numpy as np
from typing import Dict, Tuple, Optional
from app.core.config import settings
import logging
import json
import os

logger = logging.getLogger(__name__)

class MLService:
    def __init__(self):
        self.model = None
        self.label_encoder = None
        self.scaler = None
        self.is_model_loaded = False
        self.feature_names = ['jumlah_penjualan', 'harga', 'diskon']
        self.classes_ = ['Tidak', 'Laris']
        self.metadata = {}
        self.load_model()
    
    def load_model(self):
        """Load trained model and artifacts from file"""
        try:
            # Load model
            self.model = joblib.load(settings.MODEL_FILE_PATH)
            
            # Load label encoder
            encoder_path = settings.MODEL_FILE_PATH.replace('model.pkl', 'label_encoder.pkl')
            self.label_encoder = joblib.load(encoder_path)
            self.classes_ = self.label_encoder.classes_.tolist()
            
            # Load scaler
            scaler_path = settings.MODEL_FILE_PATH.replace('model.pkl', 'scaler.pkl')
            self.scaler = joblib.load(scaler_path)
            
            # Load metadata
            metadata_path = settings.MODEL_FILE_PATH.replace('model.pkl', 'metadata.json')
            if os.path.exists(metadata_path):
                with open(metadata_path, 'r') as f:
                    self.metadata = json.load(f)
            
            self.is_model_loaded = True
            logger.info(f"Model successfully loaded from {settings.MODEL_FILE_PATH}")
            logger.info(f"Model type: {type(self.model).__name__}")
            logger.info(f"Classes: {self.classes_}")
            
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            self.is_model_loaded = False
    
    def preprocess_input(self, jumlah_penjualan: int, harga: float, diskon: float) -> pd.DataFrame:
        """Preprocess input data for prediction with feature names"""
        input_data = pd.DataFrame([[jumlah_penjualan, harga, diskon]], 
                                  columns=self.feature_names)
        return input_data
    
    def predict(self, jumlah_penjualan: int, harga: float, diskon: float) -> Tuple[str, Optional[Dict[str, float]]]:
        """
        Make prediction for a single product using Random Forest
        
        Returns:
            Tuple of (prediction_label, probability_dict)
        """
        if not self.is_model_loaded:
            raise Exception("Model not loaded. Please check if model file exists.")
        
        # Preprocess input with feature names
        input_df = self.preprocess_input(jumlah_penjualan, harga, diskon)
        
        # Scale features using saved scaler
        input_scaled = self.scaler.transform(input_df)
        
        # Make prediction
        prediction = self.model.predict(input_scaled)[0]
        
        # Get probability
        probability = {}
        if hasattr(self.model, 'predict_proba'):
            proba = self.model.predict_proba(input_scaled)[0]
            
            # Map probabilities to class names using label encoder
            for i, class_name in enumerate(self.classes_):
                probability[class_name] = float(proba[i])
        
        # Convert prediction to label
        if isinstance(prediction, (int, np.integer)):
            prediction_label = self.label_encoder.inverse_transform([prediction])[0]
        else:
            prediction_label = str(prediction)
        
        logger.info(f"Prediction: {prediction_label}, Probability: {probability}")
        
        return prediction_label, probability if probability else None
    
    def get_model_info(self) -> Dict:
        """Get model information including metadata"""
        if not self.is_model_loaded:
            return {
                "success": False,
                "message": "Model not loaded",
                "model_loaded": False
            }
        
        return {
            "success": True,
            "model_loaded": True,
            "model_type": type(self.model).__name__,
            "features": self.feature_names,
            "classes": self.classes_,
            "accuracy": self.metadata.get('accuracy'),
            "training_date": self.metadata.get('training_date'),
            "training_samples": self.metadata.get('training_samples'),
            "test_samples": self.metadata.get('test_samples'),
            "feature_importance": self.metadata.get('feature_importance')
        }

# Create singleton instance
ml_service = MLService()