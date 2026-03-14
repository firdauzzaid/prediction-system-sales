"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  TrendingUp,
  LogOut,
  BarChart2,
  User,
} from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";
import { cn } from "@/app/lib/utils";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Sales Data", href: "/dashboard/sales", icon: ShoppingCart },
  { name: "Predictions", href: "/dashboard/predictions", icon: TrendingUp },
] as const;

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar - Ubah background jadi gradasi biru */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-30 h-full w-64 transition-transform duration-300 lg:translate-x-0",
          "bg-gradient-to-b from-blue-900 to-blue-800 text-white",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo - Sesuaikan dengan warna */}
        <div className="flex h-16 items-center justify-center border-b border-blue-700/50">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-white/10 rounded-lg">
              <BarChart2 className="h-5 w-5 text-blue-200" />
            </div>
            <span className="text-lg font-semibold text-white">
              Sales Predictor
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex h-[calc(100%-4rem)] flex-col justify-between p-4">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose?.();
                  }}
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                      : "text-blue-100/80 hover:bg-blue-700/50 hover:text-white",
                  )}
                >
                  <Icon
                    className={cn(
                      "mr-3 h-5 w-5 transition-colors",
                      isActive ? "text-white" : "text-blue-300",
                    )}
                  />
                  <span>{item.name}</span>

                  {/* Active indicator */}
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* User Info & Logout - Background lebih gelap */}
          <div className="pt-4 border-t border-blue-700/50">
            <div className="mb-3 flex items-center space-x-3 rounded-lg bg-blue-950/50 p-3 backdrop-blur-sm">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.username || "Admin User"}
                </p>
                <p className="text-xs text-blue-300 truncate">Administrator</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-blue-100/80 transition-all duration-200 hover:bg-red-500/20 hover:text-red-300 group"
            >
              <LogOut className="mr-3 h-5 w-5 text-blue-300 group-hover:text-red-300" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}
