export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("id-ID").format(value);
};

export const formatPercentage = (value: number): string => {
  return `${value}%`;
};

export const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(" ");
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "Laris":
      return "bg-green-100 text-green-800 border-green-200";
    case "Tidak":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const getStatusBadgeColor = (status: string): string => {
  switch (status) {
    case "Laris":
      return "bg-green-500";
    case "Tidak":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};
