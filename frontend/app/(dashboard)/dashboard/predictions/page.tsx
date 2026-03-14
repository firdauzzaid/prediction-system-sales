"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  History,
  BarChart3,
  Calendar,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  Activity,
  Trash2,
} from "lucide-react";
import { usePrediction } from "@/app/hooks/usePrediction";
import { formatCurrency, formatNumber, getStatusColor } from "@/app/lib/utils";

export default function PredictionsPage() {
  const {
    predict,
    loading,
    result,
    error,
    modelInfo,
    history,
    historyLoading,
    clearHistory,
    deleteHistoryItem,
    fetchModelInfo,
  } = usePrediction();

  // State untuk form prediksi baru
  const [formData, setFormData] = useState({
    jumlah_penjualan: 100,
    harga: 50000,
    diskon: 10,
  });

  // State untuk pagination history
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<"all" | "Laris" | "Tidak">(
    "all",
  );
  const [dateRange, setDateRange] = useState<
    "today" | "week" | "month" | "all"
  >("all");
  const itemsPerPage = 5;

  // Fetch model info on mount
  useEffect(() => {
    fetchModelInfo();
  }, []);

  // Filter history berdasarkan status dan date range
  const filteredHistory = history.filter((item) => {
    const matchesStatus =
      filterStatus === "all" || item.result.prediction === filterStatus;

    if (dateRange === "all") return matchesStatus;

    const itemDate = new Date(item.timestamp);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (dateRange === "today") {
      return matchesStatus && itemDate >= today;
    }

    if (dateRange === "week") {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return matchesStatus && itemDate >= weekAgo;
    }

    if (dateRange === "month") {
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return matchesStatus && itemDate >= monthAgo;
    }

    return matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredHistory.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Statistics
  const totalPredictions = filteredHistory.length;
  const larisCount = filteredHistory.filter(
    (h) => h.result.prediction === "Laris",
  ).length;
  const tidakCount = filteredHistory.filter(
    (h) => h.result.prediction === "Tidak",
  ).length;
  const larisPercentage =
    totalPredictions > 0
      ? ((larisCount / totalPredictions) * 100).toFixed(1)
      : "0";
  const tidakPercentage =
    totalPredictions > 0
      ? ((tidakCount / totalPredictions) * 100).toFixed(1)
      : "0";

  // Handle new prediction
  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await predict(formData);
      // Reset ke halaman pertama setelah prediksi baru
      setCurrentPage(1);
    } catch (error) {
      console.error("Prediction failed:", error);
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      "Timestamp",
      "Jumlah Penjualan",
      "Harga",
      "Diskon",
      "Prediction",
      "Probability Laris",
      "Probability Tidak",
    ];
    const csvData = filteredHistory.map((item) => [
      new Date(item.timestamp).toLocaleString(),
      item.input.jumlah_penjualan,
      item.input.harga,
      item.input.diskon,
      item.result.prediction,
      (item.result.probability.Laris * 100).toFixed(1) + "%",
      (item.result.probability.Tidak * 100).toFixed(1) + "%",
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `predictions-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Predictions</h1>
          <p className="text-sm text-gray-600 mt-1">
            Analyze and predict product sales performance
          </p>
        </div>
        <div className="flex gap-2">
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <Trash2 className="w-4 h-4" />
              Clear History
            </button>
          )}
          <button
            onClick={exportToCSV}
            disabled={filteredHistory.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <span className="text-xs text-gray-500">Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalPredictions}</p>
          <p className="text-xs text-gray-600">Total Predictions</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-xs text-gray-500">Laris</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{larisCount}</p>
          <p className="text-xs text-gray-600">{larisPercentage}% of total</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingDown className="w-5 h-5 text-red-600" />
            <span className="text-xs text-gray-500">Tidak</span>
          </div>
          <p className="text-2xl font-bold text-red-600">{tidakCount}</p>
          <p className="text-xs text-gray-600">{tidakPercentage}% of total</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            <span className="text-xs text-gray-500">Accuracy</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">
            {modelInfo?.accuracy
              ? `${(modelInfo.accuracy * 100).toFixed(1)}%`
              : "N/A"}
          </p>
          <p className="text-xs text-gray-600">Model accuracy</p>
        </div>
      </div>

      {/* New Prediction Form */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          New Prediction
        </h2>

        <form
          onSubmit={handlePredict}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Harga (Rp)
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Predicting...
                </>
              ) : (
                "Predict Now"
              )}
            </button>
          </div>
        </form>

        {/* Prediction Result */}
        {result && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Prediction Result:</p>
                <p className="text-2xl font-bold mt-1">
                  <span
                    className={
                      result.prediction === "Laris"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {result.prediction}
                  </span>
                </p>
              </div>
              {result.probability && (
                <div className="text-right">
                  <p className="text-sm text-gray-600">Confidence:</p>
                  <p className="text-lg font-semibold">
                    {(result.probability[result.prediction] * 100).toFixed(1)}%
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}
      </div>

      {/* History Section */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <History className="w-5 h-5 text-gray-600" />
              Prediction History
              {history.length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                  {history.length}
                </span>
              )}
            </h2>

            <div className="flex flex-wrap gap-3">
              {/* Filter by status */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="all">All Status</option>
                <option value="Laris">Laris Only</option>
                <option value="Tidak">Tidak Only</option>
              </select>

              {/* Filter by date */}
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
          </div>
        </div>

        {/* History Table */}
        {historyLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading history...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Input
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prediction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Probability
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-900">
                              {new Date(item.timestamp).toLocaleDateString(
                                "id-ID",
                              )}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(item.timestamp).toLocaleTimeString(
                                "id-ID",
                              )}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="text-xs">
                            <span className="text-gray-500">Sales:</span>{" "}
                            <span className="font-medium">
                              {formatNumber(item.input.jumlah_penjualan)}
                            </span>
                          </p>
                          <p className="text-xs">
                            <span className="text-gray-500">Price:</span>{" "}
                            <span className="font-medium">
                              {formatCurrency(item.input.harga)}
                            </span>
                          </p>
                          <p className="text-xs">
                            <span className="text-gray-500">Discount:</span>{" "}
                            <span className="font-medium">
                              {item.input.diskon}%
                            </span>
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(item.result.prediction)}`}
                        >
                          {item.result.prediction}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500 rounded-full"
                                style={{
                                  width: `${item.result.probability.Laris * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-xs text-gray-600">
                              L:{" "}
                              {(item.result.probability.Laris * 100).toFixed(0)}
                              %
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-red-500 rounded-full"
                                style={{
                                  width: `${item.result.probability.Tidak * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-xs text-gray-600">
                              T:{" "}
                              {(item.result.probability.Tidak * 100).toFixed(0)}
                              %
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => deleteHistoryItem(item.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete from history"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(
                      startIndex + itemsPerPage,
                      filteredHistory.length,
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{filteredHistory.length}</span>{" "}
                  results
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {filteredHistory.length === 0 && (
              <div className="text-center py-12">
                <History className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No prediction history found</p>
                <p className="text-sm text-gray-400 mt-1">
                  Make your first prediction to see history
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Model Info */}
      {modelInfo && (
        <div className="bg-gray-50 rounded-lg p-4 text-sm">
          <div className="flex flex-wrap gap-4">
            <p className="text-gray-600">
              <span className="font-medium">Model:</span>{" "}
              {modelInfo.model_type || "Random Forest"}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Features:</span>{" "}
              {modelInfo.features?.join(", ") ||
                "jumlah_penjualan, harga, diskon"}
            </p>
            {modelInfo.accuracy && (
              <p className="text-gray-600">
                <span className="font-medium">Accuracy:</span>{" "}
                {(modelInfo.accuracy * 100).toFixed(2)}%
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
