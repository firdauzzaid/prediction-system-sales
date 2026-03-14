"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  login as authLogin,
  logout as authLogout,
  getUser,
  isAuthenticated,
  verifyToken,
} from "../lib/auth";
import { LoginRequest, User } from "../types";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Cek apakah user sudah login
        if (isAuthenticated()) {
          // Verifikasi token ke backend
          const isValid = await verifyToken();
          if (isValid) {
            setUser(getUser());
          } else {
            // Token tidak valid, logout
            authLogout();
          }
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const handleLogin = async (data: LoginRequest) => {
    setError(null);
    try {
      const response = await authLogin(data);
      setUser({ username: data.username });

      // Redirect ke dashboard
      router.push("/dashboard");

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      throw err;
    }
  };

  const handleLogout = () => {
    authLogout();
    setUser(null);
    router.push("/login");
  };

  return {
    user,
    loading,
    error,
    login: handleLogin,
    logout: handleLogout,
    isAuthenticated: isAuthenticated(),
  };
};
