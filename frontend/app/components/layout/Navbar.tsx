"use client";

import { useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { useEffect } from "react";
import { Menu, Clock, Bell } from "lucide-react";
import Sidebar from "./Sidebar";
import Breadcrumb from "./Breadcrumb";

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  if (!isAuthenticated) return null;

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <nav className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-10 lg:pl-64">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left section - Mobile menu */}
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden mr-4 p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Dynamic Breadcrumb */}
              <Breadcrumb />
            </div>

            {/* Right section - Status bar */}
            <div className="flex items-center space-x-4">
              {/* Clock */}
              <div className="hidden md:flex items-center space-x-1 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>
                  {currentTime.toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {/* Notification bell (placeholder) */}
              <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Divider */}
              <div className="h-8 w-px bg-gray-200 hidden md:block"></div>

              {/* Simple user indicator - tanpa username (sudah di sidebar) */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">A</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16 lg:pl-64" />
    </>
  );
}
