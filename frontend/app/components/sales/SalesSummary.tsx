"use client";

import { useSales } from "@/app/hooks/useSales";
import { Package, TrendingUp, DollarSign, Percent } from "lucide-react";
import { formatCurrency, formatNumber } from "@/app/lib/utils";

const summaryCards = [
  {
    title: "Total Products",
    icon: Package,
    color: "blue",
    getValue: (summary: any) => formatNumber(summary?.total_products || 0),
  },
  {
    title: "Laris Products",
    icon: TrendingUp,
    color: "green",
    getValue: (summary: any) => formatNumber(summary?.total_laris || 0),
  },
  {
    title: "Avg Price",
    icon: DollarSign,
    color: "purple",
    getValue: (summary: any) => formatCurrency(summary?.avg_harga || 0),
  },
  {
    title: "Avg Discount",
    icon: Percent,
    color: "orange",
    getValue: (summary: any) => `${(summary?.avg_diskon || 0).toFixed(1)}%`,
  },
];

export default function SalesSummary() {
  const { summary, loading } = useSales();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm p-6 animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-300 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {summaryCards.map((card, index) => {
        const Icon = card.icon;
        const colorClasses = {
          blue: "bg-blue-50 text-blue-600",
          green: "bg-green-50 text-green-600",
          purple: "bg-purple-50 text-purple-600",
          orange: "bg-orange-50 text-orange-600",
        };

        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {card.getValue(summary)}
                </p>
              </div>
              <div
                className={`p-3 rounded-lg ${colorClasses[card.color as keyof typeof colorClasses]}`}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
