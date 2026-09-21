"use client";

import { useState } from "react";
import { signUp } from "@/lib/auth-client";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak sama.");
      return;
    }

    if (password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }

    setLoading(true);

    try {
      const result = await signUp.email({
        name,
        email,
        password,
      });

      if (result.error) {
        setError(
          result.error.message || "Pendaftaran gagal. Silakan coba lagi."
        );
        setLoading(false);
        return;
      }

      setSuccess("Pendaftaran berhasil. Mengarahkan ke halaman lapangan...");

      setTimeout(() => {
        window.location.href = "/lapangan";
      }, 1000);
    } catch (error) {
      console.error(error);
      setError("Terjadi kesalahan. Silakan coba lagi.");
      setLoading(false);
    }
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
        padding: "20px",
        boxSizing: "border-box",
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
          Daftar
        </h1>

        <p
          style={{
            marginBottom: "25px",
            color: "#374151",
            fontSize: "15px",
            fontWeight: "500",
          }}
        >
          Buat akun Booking Lapangan
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
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              marginBottom: "15px",
              padding: "10px",
              background: "#dcfce7",
              color: "#166534",
              borderRadius: "6px",
              fontWeight: "500",
              fontSize: "14px",
            }}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleRegister}>
          {/* NAMA */}
          <div style={{ marginBottom: "18px" }}>
            <label
              htmlFor="name"
              style={{
                display: "block",
                marginBottom: "6px",
                color: "#111827",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Nama
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama"
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

          {/* EMAIL */}
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

          {/* PASSWORD */}
          <div style={{ marginBottom: "18px" }}>
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
              placeholder="Minimal 8 karakter"
              required
              minLength={8}
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

          {/* KONFIRMASI PASSWORD */}
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="confirmPassword"
              style={{
                display: "block",
                marginBottom: "6px",
                color: "#111827",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Konfirmasi Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi password"
              required
              minLength={8}
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

          {/* BUTTON DAFTAR */}
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
            {loading ? "Mendaftarkan..." : "Daftar"}
          </button>
        </form>

        {/* LINK KE LOGIN */}
        <p
          style={{
            marginTop: "20px",
            textAlign: "center",
            color: "#374151",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          Sudah punya akun?{" "}
          <a
            href="/login"
            style={{
              color: "#2563eb",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            Login
          </a>  
        </p>
      </div>
    </main>
  );
}