"use client";

import { useState, useEffect } from "react";
import { api } from "../lib/api";
import { PredictionRequest, PredictionResponse, ModelInfo } from "../types";

// Interface untuk riwayat prediksi
export interface PredictionHistory {
  id: string;
  timestamp: string;
  input: {
    jumlah_penjualan: number;
    harga: number;
    diskon: number;
  };
  result: {
    prediction: "Laris" | "Tidak";
    probability: {
      Laris: number;
      Tidak: number;
    };
  };
  user: string;
}

export const usePrediction = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [history, setHistory] = useState<PredictionHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  // Load history from localStorage on mount
  useEffect(() => {
    const loadHistory = () => {
      try {
        const saved = localStorage.getItem("predictionHistory");
        if (saved) {
          setHistory(JSON.parse(saved));
        }
      } catch (err) {
        console.error("Failed to load history:", err);
      } finally {
        setHistoryLoading(false);
      }
    };

    loadHistory();
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem("predictionHistory", JSON.stringify(history));
    }
  }, [history]);

  const predict = async (data: PredictionRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<PredictionResponse>("/predict", data);
      setResult(response.data);

      // Save to history if prediction successful
      if (response.data.success) {
        const newPrediction: PredictionHistory = {
          id: `pred-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
          input: data,
          result: {
            prediction: response.data.prediction,
            probability: response.data.probability || { Laris: 0, Tidak: 0 },
          },
          user: "admin", // You can get this from auth context
        };

        setHistory((prev) => [newPrediction, ...prev].slice(0, 50)); // Keep last 50
      }

      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Prediction failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchModelInfo = async () => {
    try {
      const response = await api.get("/predict/model-info");
      setModelInfo(response.data);
    } catch (err) {
      console.error("Failed to fetch model info:", err);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("predictionHistory");
  };

  const deleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  return {
    predict,
    fetchModelInfo,
    loading,
    result,
    error,
    modelInfo,
    history,
    historyLoading,
    clearHistory,
    deleteHistoryItem,
  };
};
