// Auth Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  username: string;
}

// Sales Types
export interface SalesData {
  product_id: string;
  product_name: string;
  jumlah_penjualan: number;
  harga: number;
  diskon: number;
  status: "Laris" | "Tidak";
}

export interface SalesResponse {
  success: boolean;
  data: SalesData[];
  total: number;
  message?: string;
}

export interface SalesSummary {
  total_products: number;
  total_laris: number;
  total_tidak: number;
  avg_penjualan: number;
  avg_harga: number;
  avg_diskon: number;
}

// Prediction Types
export interface PredictionRequest {
  jumlah_penjualan: number;
  harga: number;
  diskon: number;
}

export interface PredictionResponse {
  success: boolean;
  prediction: "Laris" | "Tidak";
  probability?: {
    Laris: number;
    Tidak: number;
  };
  message?: string;
}

export interface ModelInfo {
  success: boolean;
  model_loaded: boolean;
  model_type?: string;
  features?: string[];
  accuracy?: number;
  training_date?: string;
  training_samples?: number;
  test_samples?: number;
}

export interface ApiError {
  detail: string;
  status_code?: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page?: number;
  limit?: number;
  message?: string;
}
