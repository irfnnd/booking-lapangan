"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Receipt, ShieldCheck } from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";

interface CustomerNavbarProps {
  hasPendingBooking?: boolean;
}

export default function CustomerNavbar({ hasPendingBooking }: CustomerNavbarProps) {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const [menuAkunTerbuka, setMenuAkunTerbuka] = useState(false);
  const [hasPending, setHasPending] = useState(hasPendingBooking ?? false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Auto-sync hasPendingProp if passed
  useEffect(() => {
    if (hasPendingBooking !== undefined) {
      setHasPending(hasPendingBooking);
    }
  }, [hasPendingBooking]);

  // Fetch pending booking status if user is logged in and prop was not explicitly passed
  useEffect(() => {
    if (!session || hasPendingBooking !== undefined) return;

    let cancelled = false;
    fetch("/api/pemesanan", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        if (
          data.stats?.pending > 0 ||
          (Array.isArray(data.bookings) &&
            data.bookings.some((b: any) => b.status === "PENDING"))
        ) {
          setHasPending(true);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [session, hasPendingBooking]);

  // Click outside listener for profile dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMenuAkunTerbuka(false);
      }
    };

    if (menuAkunTerbuka) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuAkunTerbuka]);

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/login";
        },
      },
    });
  };

  const isHomeActive = pathname === "/";
  const isLapanganActive = pathname.startsWith("/lapangan") && !pathname.includes("/manage");
  const isPemesananActive = pathname.startsWith("/pemesanan");

  return (
    <nav className="border-b border-white/10 bg-[#07110d]/95 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        {/* LOGO */}
        <Link href="/" className="text-xl font-bold tracking-tight">
          Booking<span className="text-lime-400">Lapangan</span>
        </Link>

        {/* MENU */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className={`text-sm transition ${
              isHomeActive
                ? "font-semibold text-lime-400"
                : "text-white/70 hover:text-white"
            }`}
          >
            Home
          </Link>

          <Link
            href="/lapangan"
            className={`text-sm transition ${
              isLapanganActive
                ? "font-semibold text-lime-400"
                : "text-white/70 hover:text-white"
            }`}
          >
            Lapangan
          </Link>

          <Link
            href="/pemesanan"
            className={`text-sm flex items-center gap-1.5 transition ${
              isPemesananActive
                ? "font-semibold text-lime-400"
                : "text-white/70 hover:text-white"
            }`}
          >
            <span>Riwayat Pesanan</span>
            {hasPending && (
              <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </Link>

          <Link
            href="/#tentang"
            className="text-sm text-white/70 transition hover:text-white"
          >
            Tentang
          </Link>
        </div>

        {/* AUTH / PROFILE */}
        {!isPending &&
          (session ? (
            <div className="relative" ref={dropdownRef}>
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

              {menuAkunTerbuka && (
                <div className="absolute right-0 top-12 z-50 w-60 overflow-hidden rounded-2xl border border-white/10 bg-[#101a15] shadow-2xl">
                  <div className="border-b border-white/10 px-4 py-3">
                    <p className="text-xs text-white/40">Profil Akun</p>
                    <p className="mt-1 truncate text-sm font-semibold text-white">
                      {session.user?.name || "Pengguna"}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-white/40">
                      {session.user?.email || ""}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/pemesanan"
                      onClick={() => setMenuAkunTerbuka(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-lime-400 hover:bg-white/[0.04] transition"
                    >
                      <Receipt className="h-4 w-4" />
                      <span>Riwayat Pesanan</span>
                    </Link>

                    <Link
                      href="/admin"
                      onClick={() => setMenuAkunTerbuka(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-white/70 hover:bg-white/[0.04] hover:text-white transition"
                    >
                      <ShieldCheck className="h-4 w-4 text-white/50" />
                      <span>Panel Admin</span>
                    </Link>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full border-t border-white/10 px-4 py-3 text-left text-xs font-semibold text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                  >
                    Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login?redirect=/pemesanan"
                className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:border-lime-400 hover:text-lime-400"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-lime-400 px-5 py-2 text-sm font-semibold text-black transition hover:bg-lime-300"
              >
                Daftar
              </Link>
            </div>
          ))}
      </div>
    </nav>
  );
}
