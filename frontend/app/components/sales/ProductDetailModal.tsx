"use client";

import { Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import {
  X,
  Package,
  TrendingUp,
  DollarSign,
  Percent,
  Tag,
  Hash,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { formatCurrency, formatNumber } from "@/app/lib/utils";

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    product_id: string;
    product_name: string;
    jumlah_penjualan: number;
    harga: number;
    diskon: number;
    status: "Laris" | "Tidak";
  } | null;
}

export default function ProductDetailModal({
  isOpen,
  onClose,
  product,
}: ProductDetailModalProps) {
  if (!product) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <DialogTitle
                    as="h3"
                    className="text-lg font-semibold leading-6 text-gray-900 flex items-center gap-2"
                  >
                    <Package className="w-5 h-5 text-blue-600" />
                    Product Details
                  </DialogTitle>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Status Badge */}
                <div className="mb-6 flex justify-center">
                  <span
                    className={`px-4 py-2 text-sm font-semibold rounded-full border ${
                      product.status === "Laris"
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-red-100 text-red-800 border-red-200"
                    }`}
                  >
                    {product.status === "Laris" ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        LARIS
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4" />
                        TIDAK LARIS
                      </div>
                    )}
                  </span>
                </div>

                {/* Product Info Cards */}
                <div className="space-y-4">
                  {/* Product ID & Name */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Tag className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">Product ID</p>
                        <p className="text-sm font-mono font-medium text-gray-900 mb-2">
                          {product.product_id}
                        </p>
                        <p className="text-xs text-gray-500 mb-1">
                          Product Name
                        </p>
                        <p className="text-base font-semibold text-gray-900">
                          {product.product_name}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Sales */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        <span className="text-xs text-gray-500">Penjualan</span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">
                        {formatNumber(product.jumlah_penjualan)}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-xs text-gray-500">Harga</span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">
                        {formatCurrency(product.harga)}
                      </p>
                    </div>

                    {/* Discount */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Percent className="w-4 h-4 text-purple-600" />
                        <span className="text-xs text-gray-500">Diskon</span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">
                        {product.diskon}%
                      </p>
                    </div>

                    {/* Revenue */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Hash className="w-4 h-4 text-orange-600" />
                        <span className="text-xs text-gray-500">
                          Pendapatan
                        </span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">
                        {formatCurrency(
                          product.jumlah_penjualan * product.harga,
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Analysis */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                    <p className="text-xs font-medium text-blue-800 mb-2">
                      📊 Analisis Singkat
                    </p>
                    <p className="text-sm text-gray-700">
                      {product.status === "Laris"
                        ? `Produk ini memiliki penjualan ${formatNumber(product.jumlah_penjualan)} unit dengan harga ${formatCurrency(product.harga)}. ${product.diskon > 0 ? `Diskon ${product.diskon}% membantu meningkatkan penjualan.` : "Tanpa diskon, produk ini tetap laris karena kualitasnya."}`
                        : `Penjualan ${formatNumber(product.jumlah_penjualan)} unit tergolong rendah. ${product.diskon > 0 ? `Meski diskon ${product.diskon}% diberikan,` : "Dengan harga ${formatCurrency(product.harga)} dan tanpa diskon,"} perlu strategi pemasaran lebih lanjut.`}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-lg border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
