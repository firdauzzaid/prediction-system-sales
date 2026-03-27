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
        self.classes_ = ['Tidak', 'Laris']  # Default classes
        self.metadata = {}
        self.load_model()
    
    def load_model(self):
        """Load trained model and artifacts from file"""
        try:
            # Load model utama
            if not os.path.exists(settings.MODEL_FILE_PATH):
                logger.error(f"Model file not found at: {settings.MODEL_FILE_PATH}")
                self.is_model_loaded = False
                return
            
            self.model = joblib.load(settings.MODEL_FILE_PATH)
            logger.info(f"✓ Model loaded from {settings.MODEL_FILE_PATH}")
            logger.info(f"  Model type: {type(self.model).__name__}")
            
            # Load label encoder (optional)
            encoder_path = settings.MODEL_FILE_PATH.replace('model.pkl', 'label_encoder.pkl')
            if os.path.exists(encoder_path):
                self.label_encoder = joblib.load(encoder_path)
                self.classes_ = self.label_encoder.classes_.tolist()
                logger.info(f"✓ Label encoder loaded, classes: {self.classes_}")
            else:
                logger.warning(f"Label encoder not found at {encoder_path}, using default classes")
                # Create dummy label encoder
                from sklearn.preprocessing import LabelEncoder
                self.label_encoder = LabelEncoder()
                self.label_encoder.fit(self.classes_)
            
            # Load scaler (optional)
            scaler_path = settings.MODEL_FILE_PATH.replace('model.pkl', 'scaler.pkl')
            if os.path.exists(scaler_path):
                self.scaler = joblib.load(scaler_path)
                logger.info(f"✓ Scaler loaded")
            else:
                logger.warning(f"Scaler not found at {scaler_path}, using no scaling")
                # Create dummy scaler that does nothing
                from sklearn.preprocessing import StandardScaler
                self.scaler = StandardScaler()
                # Fit with dummy data
                dummy_data = np.array([[0, 0, 0]])
                self.scaler.fit(dummy_data)
            
            # Load metadata (optional)
            metadata_path = settings.MODEL_FILE_PATH.replace('model.pkl', 'metadata.json')
            if os.path.exists(metadata_path):
                with open(metadata_path, 'r') as f:
                    self.metadata = json.load(f)
                logger.info(f"✓ Metadata loaded")
            
            self.is_model_loaded = True
            logger.info("Model loading completed successfully")
            
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            import traceback
            logger.error(traceback.format_exc())
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
        
        try:
            # Preprocess input
            input_df = self.preprocess_input(jumlah_penjualan, harga, diskon)
            
            # Scale features if scaler exists
            if self.scaler:
                input_scaled = self.scaler.transform(input_df)
            else:
                input_scaled = input_df.values
            
            # Make prediction
            prediction = self.model.predict(input_scaled)[0]
            
            # Get probability
            probability = {}
            if hasattr(self.model, 'predict_proba'):
                proba = self.model.predict_proba(input_scaled)[0]
                
                # Map probabilities to class names
                if self.label_encoder:
                    for i, class_name in enumerate(self.label_encoder.classes_):
                        probability[class_name] = float(proba[i])
                else:
                    # Use default classes
                    for i, class_name in enumerate(self.classes_):
                        probability[class_name] = float(proba[i])
            
            # Convert prediction to label
            if self.label_encoder and isinstance(prediction, (int, np.integer)):
                prediction_label = self.label_encoder.inverse_transform([prediction])[0]
            elif isinstance(prediction, (int, np.integer)):
                prediction_label = self.classes_[prediction] if prediction < len(self.classes_) else str(prediction)
            else:
                prediction_label = str(prediction)
            
            logger.info(f"Prediction: {prediction_label}, Probability: {probability}")
            return prediction_label, probability if probability else None
            
        except Exception as e:
            logger.error(f"Error during prediction: {e}")
            raise Exception(f"Prediction failed: {str(e)}")
    
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