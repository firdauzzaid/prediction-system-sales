"use client";

import { useState, useEffect } from "react";
import { usePrediction } from "@/app/hooks/usePrediction";
import { TrendingUp, DollarSign, Percent, Zap, Loader2 } from "lucide-react";
import { cn, getStatusBadgeColor } from "@/app/lib/utils";

const DEFAULT_VALUES = {
  jumlah_penjualan: 100,
  harga: 50000,
  diskon: 10,
};

export default function PredictionForm() {
  const [formData, setFormData] = useState(DEFAULT_VALUES);
  const { predict, fetchModelInfo, loading, result, error, modelInfo } =
    usePrediction();

  useEffect(() => {
    fetchModelInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await predict(formData);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Form Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <Zap className="w-5 h-5 text-yellow-500" />
          <h3 className="font-semibold text-gray-900">
            Product Status Prediction
          </h3>
        </div>

        {modelInfo && !modelInfo.model_loaded && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ ML model is not loaded. Please check backend configuration.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Jumlah Penjualan
            </label>
            <input
              type="number"
              value={formData.jumlah_penjualan}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  jumlah_penjualan: parseInt(e.target.value) || 0,
                })
              }
              min="1"
              step="1"
              required
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:bg-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the number of units sold
            </p>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <DollarSign className="w-4 h-4 text-green-600" />
              Harga (per item)
            </label>
            <input
              type="number"
              value={formData.harga}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  harga: parseInt(e.target.value) || 0,
                })
              }
              min="1"
              step="1000"
              required
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:bg-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the price per unit in Rupiah
            </p>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <Percent className="w-4 h-4 text-purple-600" />
              Diskon (%)
            </label>
            <input
              type="number"
              value={formData.diskon}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  diskon: parseInt(e.target.value) || 0,
                })
              }
              min="0"
              max="100"
              step="1"
              required
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:bg-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter discount percentage (0-100)
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !modelInfo?.model_loaded}
            className={cn(
              "w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition",
              "hover:bg-blue-700 focus:ring-4 focus:ring-blue-300",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "flex items-center justify-center gap-2",
            )}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Predicting...
              </>
            ) : (
              "Predict Status"
            )}
          </button>
        </form>
      </div>

      {/* Result Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-6">Prediction Result</h3>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {result ? (
          <div className="text-center">
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Predicted Status</p>
              <div
                className={cn(
                  "inline-flex items-center px-6 py-3 rounded-full text-2xl font-bold text-white",
                  getStatusBadgeColor(result.prediction),
                )}
              >
                {result.prediction}
              </div>
            </div>

            {result.probability && (
              <div>
                <p className="text-sm text-gray-600 mb-3">Probability</p>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(result.probability).map(([status, prob]) => (
                    <div
                      key={status}
                      className={cn(
                        "p-3 rounded-lg",
                        status === "Laris" ? "bg-green-50" : "bg-red-50",
                      )}
                    >
                      <p className="text-xs text-gray-600 mb-1">{status}</p>
                      <p className="text-lg font-bold text-gray-900">
                        {(prob * 100).toFixed(1)}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-gray-400 mt-6">
              Prediction based on ML model trained with historical sales data
            </p>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 py-12">
            <Zap className="w-12 h-12 mb-3 opacity-50" />
            <p>Fill the form and click Predict to see results</p>
          </div>
        )}
      </div>
    </div>
  );
}
