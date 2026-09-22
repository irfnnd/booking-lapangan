"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "@/lib/auth-client";

export default function LapanganPage() {
  const { data: session, isPending } = useSession();
  console.log("SESSION USER:", session?.user);

  const [menuAkunTerbuka, setMenuAkunTerbuka] = useState(false);

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/login";
        },
      },
    });
  };

  return (
    <main className="min-h-screen bg-[#07110d] text-white">
      {/* NAVBAR */}
      <nav className="border-b border-white/10 bg-[#07110d]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          
          {/* LOGO */}
          <Link
            href="/"
            className="text-xl font-bold tracking-tight"
          >
            Booking<span className="text-lime-400">Lapangan</span>
          </Link>

          {/* MENU */}
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/"
              className="text-sm font-semibold text-lime-400"
            >
              Home
            </Link>

            <Link
              href="/lapangan"
              className="text-sm text-white/70 transition hover:text-white"
            >
              Lapangan
            </Link>

            <Link
              href="/#tentang"
              className="text-sm text-white/70 transition hover:text-white"
            >
              Tentang
            </Link>
          </div>

          {/* AUTH BUTTON */}
          {!isPending &&
            (session ? (
              <div className="relative">
                {/* FOTO PROFIL */}
                <button
                  type="button"
                  onClick={() => setMenuAkunTerbuka(!menuAkunTerbuka)}
                  className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-lime-400/50 bg-white/[0.06] transition hover:border-lime-400"
                  aria-label="Menu akun"
                >
                  {session?.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt="Foto profil"
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-lime-400 text-sm font-bold text-black">
                      {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </button>

                {/* MENU AKUN */}
                {menuAkunTerbuka && (
                  <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#101a15] shadow-2xl">
                    {/* PROFIL AKUN */}
                    <div className="border-b border-white/10 px-4 py-3">
                      <p className="text-xs text-white/40">
                        Profil Akun
                      </p>

                      <p className="mt-1 truncate text-sm font-semibold text-white">
                        {session.user?.name || "Pengguna"}
                      </p>

                      <p className="mt-1 truncate text-xs text-white/40">
                        {session.user?.email || ""}
                      </p>
                    </div>

                    {/* KELUAR */}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full border-t border-white/10 px-4 py-3 text-left text-sm font-semibold text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                    >
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-lime-400 hover:text-lime-400"
                >
                  Masuk
                </Link>

                <Link
                  href="/register"
                  className="rounded-full bg-lime-400 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-lime-300"
                >
                  Daftar
                </Link>
              </div>
            ))}
        </div>
      </nav>

      {/* CONTENT */}
      <section className="mx-auto flex min-h-[75vh] max-w-7xl items-center justify-center px-6 py-20">
        <div className="max-w-2xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-lime-400">
            Booking Lapangan
          </p>

          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Temukan lapangan
            <br />
            <span className="text-lime-400">
              untuk permainanmu.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-white/60">
            Pesan lapangan olahraga dengan mudah dan cepat.
            Silakan masuk atau daftar terlebih dahulu untuk
            melanjutkan proses booking.
          </p>

          {/* USER SUDAH LOGIN */}
          {!isPending && session && (
            <div className="mt-8">
              <p className="mb-4 text-sm text-white/50">
                Kamu sudah masuk sebagai pengguna.
              </p>

              <button
                onClick={handleLogout}
                className="rounded-full bg-red-500 px-7 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                Keluar
              </button>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-white/40 md:flex-row md:items-center md:justify-between">
          <p>
            © 2026 BookingLapangan. Semua hak dilindungi.
          </p>

          <p>
            Booking lapangan olahraga dengan mudah.
          </p>
        </div>
      </footer>
    </main>
  );
}