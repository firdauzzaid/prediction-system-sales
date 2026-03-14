#!/usr/bin/env python
"""
Sample Data Generator for Sales Prediction System
Membuat data dummy penjualan untuk testing
"""

import pandas as pd
import numpy as np
import os
import random
from datetime import datetime, timedelta

def generate_sample_data(output_path="data/sales_data.csv", n_samples=500):
    """
    Generate sample sales data for testing
    
    Parameters:
    - output_path: path to save CSV file
    - n_samples: number of samples to generate
    """
    
    print("\n" + "="*60)
    print("📊 SAMPLE DATA GENERATOR")
    print("="*60)
    
    # Set random seed for reproducibility
    np.random.seed(42)
    random.seed(42)
    
    print(f"\n🔧 Generating {n_samples} sample records...")
    
    # Generate product IDs and names
    product_categories = [
        "Elektronik", "Fashion", "Makanan", "Minuman", 
        "Kesehatan", "Rumah Tangga", "Olahraga", "Buku",
        "Mainan", "Otomotif", "Pertanian", "Kecantikan"
    ]
    
    product_prefix = {
        "Elektronik": "ELEC",
        "Fashion": "FASH",
        "Makanan": "FOOD",
        "Minuman": "DRNK",
        "Kesehatan": "HLTH",
        "Rumah Tangga": "HOME",
        "Olahraga": "SPRT",
        "Buku": "BOOK",
        "Mainan": "TOY",
        "Otomotif": "AUTO",
        "Pertanian": "FARM",
        "Kecantikan": "BEAU"
    }
    
    product_ids = []
    product_names = []
    
    for i in range(1, n_samples + 1):
        category = random.choice(product_categories)
        prefix = product_prefix[category]
        product_id = f"{prefix}{i:04d}"
        product_name = f"{category} {i}"
        
        product_ids.append(product_id)
        product_names.append(product_name)
    
    # Generate features with realistic distributions
    # Jumlah penjualan: distribusi normal dengan range 10-1000
    jumlah_penjualan = np.random.normal(300, 200, n_samples).astype(int)
    jumlah_penjualan = np.clip(jumlah_penjualan, 10, 1000)
    
    # Harga: distribusi log-normal (banyak produk murah, sedikit mahal)
    harga = np.random.lognormal(mean=11, sigma=1.5, size=n_samples).astype(int)
    harga = np.clip(harga, 10000, 2000000)  # Rp 10.000 - Rp 2.000.000
    # Bulatkan ke ribuan terdekat
    harga = (harga / 1000).astype(int) * 1000
    
    # Diskon: 0%, 5%, 10%, 15%, 20%, 25%, 30%, 40%, 50%
    diskon_options = [0, 5, 10, 15, 20, 25, 30, 40, 50]
    diskon_weights = [0.2, 0.1, 0.15, 0.1, 0.15, 0.1, 0.1, 0.05, 0.05]
    diskon = np.random.choice(diskon_options, n_samples, p=diskon_weights)
    
    # Create status based on realistic business rules
    status = []
    
    print("\n📈 Applying business rules for status classification...")
    
    for i in range(n_samples):
        # Logic bisnis untuk menentukan Laris / Tidak
        score = 0
        
        # Rule 1: Penjualan tinggi
        if jumlah_penjualan[i] > 500:
            score += 3
        elif jumlah_penjualan[i] > 300:
            score += 2
        elif jumlah_penjualan[i] > 150:
            score += 1
        
        # Rule 2: Harga terjangkau
        if harga[i] < 100000:
            score += 2
        elif harga[i] < 300000:
            score += 1
        elif harga[i] > 1000000:
            score -= 1
        
        # Rule 3: Diskon menarik
        if diskon[i] >= 30:
            score += 2
        elif diskon[i] >= 15:
            score += 1
        elif diskon[i] == 0:
            score -= 1
        
        # Rule 4: Kombinasi spesial
        if jumlah_penjualan[i] > 200 and diskon[i] > 20:
            score += 2
        if harga[i] < 150000 and jumlah_penjualan[i] > 150:
            score += 2
        if harga[i] > 1000000 and diskon[i] < 10:
            score -= 2
        
        # Tentukan status berdasarkan score
        if score >= 3:
            status.append('Laris')
        else:
            status.append('Tidak')
    
    # Create DataFrame
    df = pd.DataFrame({
        'product_id': product_ids,
        'product_name': product_names,
        'jumlah_penjualan': jumlah_penjualan,
        'harga': harga,
        'diskon': diskon,
        'status': status
    })
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # Save to CSV
    df.to_csv(output_path, index=False)
    
    # Print statistics
    print("\n" + "="*60)
    print("✅ DATA GENERATED SUCCESSFULLY")
    print("="*60)
    print(f"📁 File saved to: {os.path.abspath(output_path)}")
    print(f"📊 Total records: {len(df)}")
    print(f"📊 Total columns: {len(df.columns)}")
    print(f"📋 Columns: {', '.join(df.columns)}")
    
    print("\n📈 Data Statistics:")
    print(f"   Laris: {sum(s == 'Laris' for s in status)} products ({sum(s == 'Laris' for s in status)/n_samples*100:.1f}%)")
    print(f"   Tidak: {sum(s == 'Tidak' for s in status)} products ({sum(s == 'Tidak' for s in status)/n_samples*100:.1f}%)")
    
    print("\n📊 Feature Ranges:")
    print(f"   Jumlah Penjualan: {df['jumlah_penjualan'].min()} - {df['jumlah_penjualan'].max()}")
    print(f"   Harga: Rp {df['harga'].min():,.0f} - Rp {df['harga'].max():,.0f}")
    print(f"   Diskon: {df['diskon'].min()}% - {df['diskon'].max()}%")
    
    print("\n📊 Sample Data (First 5 rows):")
    print(df.head())
    
    print("\n📊 Data Info:")
    print(df.info())
    
    print("\n📊 Statistical Summary:")
    print(df.describe())
    
    return df

def generate_extended_data(output_path="data/sales_data_extended.csv", n_samples=1000):
    """
    Generate extended dataset with additional features
    (Optional, for more advanced analysis)
    """
    
    df = generate_sample_data(output_path, n_samples)
    
    # Add timestamp
    base_date = datetime(2024, 1, 1)
    dates = [base_date + timedelta(days=random.randint(0, 365)) for _ in range(n_samples)]
    df['tanggal_transaksi'] = dates
    
    # Add profit margin (simulated)
    df['modal'] = df['harga'] * (0.5 + np.random.random(n_samples) * 0.3)
    df['keuntungan'] = df['harga'] - df['modal']
    df['margin_keuntungan'] = (df['keuntungan'] / df['harga'] * 100).round(1)
    
    return df

def generate_very_small_data(output_path="data/sales_data_sample.csv", n_samples=50):
    """
    Generate very small dataset for quick testing
    """
    return generate_sample_data(output_path, n_samples)

if __name__ == "__main__":
    import sys
    
    # Parse command line arguments
    n_samples = 500
    if len(sys.argv) > 1:
        try:
            n_samples = int(sys.argv[1])
        except:
            pass
    
    # Generate main dataset
    df = generate_sample_data("data/sales_data.csv", n_samples)
    
    # Also generate a small sample for quick testing
    generate_very_small_data("data/sales_data_sample.csv", 50)
    
    print("\n" + "="*60)
    print("🎉 ALL DATA GENERATED SUCCESSFULLY!")
    print("="*60)
    print("Files created:")
    print("  1. data/sales_data.csv - Main dataset (500 records)")
    print("  2. data/sales_data_sample.csv - Sample dataset (50 records)")
    print("\nNext steps:")
    print("  - Train ML model: python ml/train_model.py")
    print("  - Start backend: python run.py")
    print("="*60)