"use client";

import { useState, useEffect } from "react";
import { api } from "../lib/api";
import { SalesData, SalesSummary } from "../types";

export const useSales = () => {
  const [sales, setSales] = useState<SalesData[]>([]);
  const [summary, setSummary] = useState<SalesSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSales = async () => {
    try {
      const response = await api.get("/sales");
      setSales(response.data.data || []);
    } catch (err) {
      setError("Failed to fetch sales data");
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await api.get("/sales/summary");
      setSummary(response.data.data);
    } catch (err) {
      console.error("Failed to fetch summary:", err);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    try {
      await api.post("/sales/refresh");
      await Promise.all([fetchSales(), fetchSummary()]);
    } catch (err) {
      setError("Failed to refresh data");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchSales(), fetchSummary()]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    sales,
    summary,
    loading,
    error,
    refreshing,
    refreshData,
  };
};
