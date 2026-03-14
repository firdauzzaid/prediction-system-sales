import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Validasi input
    if (!username || !password) {
      return NextResponse.json(
        { detail: "Username and password are required" },
        { status: 400 },
      );
    }

    // Panggil backend FastAPI untuk login
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { detail: data.detail || "Login failed" },
        { status: response.status },
      );
    }

    // Return response dengan token dari backend
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { detail: "Failed to connect to authentication service" },
      { status: 503 },
    );
  }
}

export async function GET(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json(
      { authenticated: false, user: null },
      { status: 401 },
    );
  }

  try {
    // Verifikasi token ke backend
    const response = await fetch(`${API_BASE_URL}/predict/model-info`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      // Token valid, ambil user info (dalam hal ini dari token)
      // Karena kita tidak punya endpoint /me, kita decode token sederhana
      try {
        // Decode JWT sederhana (tanpa library)
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(atob(base64));

        return NextResponse.json({
          authenticated: true,
          user: { username: payload.sub || "admin" },
        });
      } catch (e) {
        // Jika gagal decode, return authenticated true dengan user default
        return NextResponse.json({
          authenticated: true,
          user: { username: "admin" },
        });
      }
    } else {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 401 },
      );
    }
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      { authenticated: false, user: null, error: "Failed to verify token" },
      { status: 503 },
    );
  }
}
