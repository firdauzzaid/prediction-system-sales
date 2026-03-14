import SalesSummary from "@/app/components/sales/SalesSummary";
import SalesTable from "@/app/components/sales/SalesTable";
import PredictionForm from "@/app/components/prediction/PredictionForm";

export default function DashboardPage() {
  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Summary Cards */}
      <SalesSummary />

      {/* Prediction Form */}
      <PredictionForm />

      {/* Sales Data Table */}
      <SalesTable />
    </div>
  );
}
