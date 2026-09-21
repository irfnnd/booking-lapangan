"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth-client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const result = await signIn.email({
      email,
      password,
    });

    if (result.error) {
      setError(result.error.message || "Email atau password salah.");
      setLoading(false);
      return;
    }

    window.location.href = "/";
  }

  async function handleGoogleLogin() {
    setError("");

    await signIn.social({
      provider: "google",
      callbackURL: "/lapangan",
    });
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
        color: "#111827",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "30px",
          background: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1
          style={{
            marginBottom: "10px",
            color: "#111827",
            fontSize: "28px",
            fontWeight: "700",
          }}
        >
          Login
        </h1>

        <p
          style={{
            marginBottom: "25px",
            color: "#374151",
            fontSize: "15px",
            fontWeight: "500",
          }}
        >
          Masuk ke akun Booking Lapangan
        </p>

        {error && (
          <div
            style={{
              marginBottom: "15px",
              padding: "10px",
              background: "#fee2e2",
              color: "#b91c1c",
              borderRadius: "6px",
              fontWeight: "500",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "18px" }}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                marginBottom: "6px",
                color: "#111827",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email"
              required
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "11px",
                color: "#111827",
                background: "#ffffff",
                border: "1px solid #9ca3af",
                borderRadius: "6px",
                outline: "none",
                fontSize: "14px",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                marginBottom: "6px",
                color: "#111827",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              required
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "11px",
                color: "#111827",
                background: "#ffffff",
                border: "1px solid #9ca3af",
                borderRadius: "6px",
                outline: "none",
                fontSize: "14px",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              border: "none",
              borderRadius: "6px",
              background: "#111827",
              color: "#ffffff",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "15px",
              fontWeight: "600",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            margin: "24px 0",
          }}
        >
          <div
            style={{
              flex: 1,
              height: "1px",
              background: "#d1d5db",
            }}
          />

          <span
            style={{
              color: "#6b7280",
              fontSize: "13px",
              fontWeight: "500",
            }}
          >
            atau
          </span>

          <div
            style={{
              flex: 1,
              height: "1px",
              background: "#d1d5db",
            }}
          />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          style={{
            width: "100%",
            padding: "12px",
            border: "1px solid #9ca3af",
            borderRadius: "6px",
            background: "#ffffff",
            color: "#111827",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <span
            style={{
              fontSize: "18px",
              fontWeight: "700",
            }}
          >
            G
          </span>
          Lanjut dengan Google
        </button>

        <p
          style={{
            marginTop: "20px",
            textAlign: "center",
            color: "#374151",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          Belum punya akun?{" "}
          <a
            href="/register"
            style={{
              color: "#2563eb",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            Daftar
          </a>
        </p>
      </div>
    </main>
  );
}