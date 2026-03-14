import pandas as pd
from typing import List, Dict
from app.models.schemas import SalesData
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class DataService:
    def __init__(self):
        self.df = None
        self.load_data()
    
    def load_data(self):
        """Load data from CSV file"""
        try:
            self.df = pd.read_csv(settings.CSV_FILE_PATH)
            logger.info(f"Successfully loaded data from {settings.CSV_FILE_PATH}")
            logger.info(f"Data shape: {self.df.shape}")
        except Exception as e:
            logger.error(f"Error loading data: {str(e)}")
            self.df = pd.DataFrame()  # Empty DataFrame as fallback
    
    def get_all_sales(self) -> List[Dict]:
        """Get all sales data as list of dictionaries"""
        if self.df.empty:
            return []
        
        # Convert DataFrame to list of dicts
        records = self.df.to_dict('records')
        return records
    
    def get_sales_summary(self) -> Dict:
        """Get summary statistics of sales data"""
        if self.df.empty:
            return {}
        
        summary = {
            'total_products': len(self.df),
            'total_laris': len(self.df[self.df['status'] == 'Laris']),
            'total_tidak': len(self.df[self.df['status'] == 'Tidak']),
            'avg_penjualan': float(self.df['jumlah_penjualan'].mean()),
            'avg_harga': float(self.df['harga'].mean()),
            'avg_diskon': float(self.df['diskon'].mean())
        }
        return summary
    
    def refresh_data(self):
        """Refresh data from CSV file"""
        self.load_data()
        return {"message": "Data refreshed successfully"}

# Create singleton instance
data_service = DataService()