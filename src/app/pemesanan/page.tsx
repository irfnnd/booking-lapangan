"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Clock,
  MapPin,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock3,
  XCircle,
  Receipt,
  ArrowRight,
  ShieldCheck,
  Building,
  Printer,
  X,
  MessageCircle,
} from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";

type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

type BookingItem = {
  id: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  createdAt: string;
  lapangan: {
    id: string;
    name: string;
    category?: string;
    location: string;
    price: number;
    picture_url?: string | null;
  };
  customer?: {
    name?: string | null;
    email: string;
  };
  payments: {
    status: string;
    amount: number;
  }[];
};

type Stats = {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  totalAmount: number;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));

const formatTime = (value: string) =>
  new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const generateInvoiceNo = (id: string, dateStr: string) => {
  const d = new Date(dateStr);
  const year = d.getFullYear() || 2026;
  const month = String((d.getMonth() || 0) + 1).padStart(2, "0");
  const code = (id || "00000000").replace(/[^a-zA-Z0-9]/g, "").slice(0, 6).toUpperCase();
  return `INV-${year}${month}-${code}`;
};

export default function RiwayatPemesananPage() {
  const { data: session, isPending } = useSession();

  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    totalAmount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");

  // Filters & Modal
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | BookingStatus>("ALL");
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);
  const [menuAkunTerbuka, setMenuAkunTerbuka] = useState(false);

  const fetchRiwayat = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      else setIsRefreshing(true);
      setError("");

      const response = await fetch("/api/pemesanan", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 401) {
          setError("Silakan login terlebih dahulu untuk melihat riwayat pesanan Anda.");
        } else {
          setError(data?.message || "Gagal memuat riwayat pesanan.");
        }
        setBookings([]);
        return;
      }

      const items = (data?.bookings as BookingItem[]) || [];
      setBookings(items);

      if (data?.stats) {
        setStats(data.stats);
      } else {
        let totalAmount = 0;
        let pending = 0;
        let confirmed = 0;
        let cancelled = 0;
        items.forEach((b) => {
          if (b.status === "PENDING") pending++;
          else if (b.status === "CONFIRMED") confirmed++;
          else if (b.status === "CANCELLED") cancelled++;

          const dur = Math.max(
            1,
            Math.ceil(
              (new Date(b.endTime).getTime() - new Date(b.startTime).getTime()) / 3600000
            )
          );
          totalAmount += dur * (b.lapangan?.price || 0);
        });
        setStats({
          total: items.length,
          pending,
          confirmed,
          cancelled,
          totalAmount,
        });
      }
    } catch (err) {
      console.error(err);
      setError("Gagal menghubungi server. Pastikan koneksi internet stabil.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!isPending) {
      void fetchRiwayat();
    }
  }, [isPending, session]);

  // Polling real-time update every 10 seconds to auto-detect admin confirmation
  useEffect(() => {
    if (!session) return;
    const interval = setInterval(() => {
      void fetchRiwayat(true);
    }, 10000);
    return () => clearInterval(interval);
  }, [session]);

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/login";
        },
      },
    });
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchTab = activeTab === "ALL" || b.status === activeTab;
      const q = search.toLowerCase().trim();
      const invoice = generateInvoiceNo(b.id, b.createdAt || b.startTime).toLowerCase();
      const matchSearch =
        !q ||
        b.lapangan?.name?.toLowerCase().includes(q) ||
        b.lapangan?.location?.toLowerCase().includes(q) ||
        invoice.includes(q);

      return matchTab && matchSearch;
    });
  }, [bookings, activeTab, search]);

  return (
    <main className="min-h-screen bg-[#07110d] text-white">
      {/* NAVBAR */}
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
              className="text-sm text-white/70 transition hover:text-white"
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
              href="/pemesanan"
              className="text-sm font-semibold text-lime-400 flex items-center gap-1.5"
            >
              <span>Riwayat Pesanan</span>
              {stats.pending > 0 && (
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
              <div className="relative">
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

      {/* DASHBOARD HERO SECTION */}
      <section className="mx-auto max-w-7xl px-6 pt-10 pb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="rounded-full border border-lime-400/30 bg-lime-400/10 px-3 py-1 text-xs font-semibold text-lime-300">
                Dashboard Pelanggan
              </span>
              <span className="flex items-center gap-1.5 text-xs text-white/50">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Terhubung ke Database
              </span>
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Riwayat <span className="text-lime-400">Pesanan</span>
            </h1>
            <p className="mt-2 text-sm text-white/60 max-w-2xl">
              Pantau status konfirmasi pesanan lapangan Anda secara real-time. Jika admin mengonfirmasi, status pesanan akan langsung diperbarui menjadi <strong className="text-lime-400 font-semibold">Sudah Dikonfirmasi</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => void fetchRiwayat(true)}
              disabled={isRefreshing || loading}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-white/80 transition hover:bg-white/[0.08] hover:text-white disabled:opacity-50 cursor-pointer"
              title="Segarkan data dari database"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 text-lime-400 ${
                  isRefreshing ? "animate-spin" : ""
                }`}
              />
              <span>{isRefreshing ? "Memperbarui..." : "Segarkan Status"}</span>
            </button>

            <Link
              href="/lapangan"
              className="inline-flex items-center gap-2 rounded-full bg-lime-400 px-5 py-2.5 text-xs font-bold text-black transition hover:bg-lime-300 shadow-md shadow-lime-400/10"
            >
              <span>Booking Lapangan Lain</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>


        {/* SEARCH AND TAB FILTER */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-5">
          {/* TABS */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: "ALL", label: "Semua", count: stats.total },
              {
                id: "PENDING",
                label: "Menunggu Konfirmasi",
                count: stats.pending,
              },
              {
                id: "CONFIRMED",
                label: "Sudah Dikonfirmasi",
                count: stats.confirmed,
              },
              {
                id: "CANCELLED",
                label: "Dibatalkan",
                count: stats.cancelled,
              },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition cursor-pointer ${
                    active
                      ? "bg-lime-400 text-black font-semibold shadow-sm shadow-lime-400/20"
                      : "border border-white/10 bg-white/[0.03] text-white/70 hover:border-lime-400/30 hover:text-white"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                      active
                        ? "bg-black/20 text-black font-bold"
                        : "bg-white/10 text-white/60"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* SEARCH BOX */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari lapangan atau invoice..."
              className="w-full rounded-full border border-white/10 bg-white/[0.04] pl-10 pr-4 py-2 text-xs text-white placeholder-white/40 outline-none transition focus:border-lime-400/50"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* CONTENT LIST */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        {/* NOT LOGGED IN WARNING */}
        {!session && !isPending && (
          <div className="rounded-[28px] border border-amber-400/30 bg-amber-400/[0.05] p-8 text-center max-w-2xl mx-auto my-10">
            <Clock3 className="h-12 w-12 text-amber-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white">
              Silakan Masuk ke Akun Anda
            </h3>
            <p className="mt-2 text-sm text-white/60 leading-relaxed">
              Anda perlu login terlebih dahulu agar sistem dapat menampilkan riwayat pesanan dan status konfirmasi lapangan yang telah Anda pesan.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link
                href="/login?redirect=/pemesanan"
                className="rounded-full bg-lime-400 px-6 py-2.5 text-xs font-bold text-black transition hover:bg-lime-300"
              >
                Masuk Sekarang
              </Link>
              <Link
                href="/register"
                className="rounded-full border border-white/20 px-6 py-2.5 text-xs font-semibold text-white transition hover:border-lime-400 hover:text-lime-400"
              >
                Daftar Akun
              </Link>
            </div>
          </div>
        )}

        {/* LOADING STATE */}
        {loading && (
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-12 text-center text-white/60">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-lime-400 border-t-transparent mb-3" />
            <p className="text-sm font-medium">Menghubungkan ke database & memuat data pesanan...</p>
          </div>
        )}

        {/* ERROR STATE */}
        {!loading && error && session && (
          <div className="rounded-[28px] border border-rose-400/30 bg-rose-400/[0.05] p-8 text-center max-w-xl mx-auto">
            <XCircle className="h-10 w-10 text-rose-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-rose-300">{error}</p>
            <button
              onClick={() => void fetchRiwayat()}
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-rose-400/30 bg-rose-400/10 px-4 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-400/20 cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Coba Lagi</span>
            </button>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && session && filteredBookings.length === 0 && (
          <div className="rounded-[28px] border border-white/10 bg-white/[0.02] p-16 text-center max-w-xl mx-auto">
            <Receipt className="h-12 w-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white">
              {search
                ? "Tidak ada pesanan yang sesuai pencarian"
                : activeTab !== "ALL"
                ? `Tidak ada pesanan dengan status ${activeTab}`
                : "Belum Ada Riwayat Pemesanan"}
            </h3>
            <p className="mt-2 text-xs text-white/50 leading-relaxed">
              {search
                ? `Kata kunci "${search}" tidak ditemukan pada riwayat pesanan Anda.`
                : "Anda belum melakukan pemesanan lapangan. Pilih jadwal dan lapangan favorit Anda sekarang!"}
            </p>
            <div className="mt-6">
              <Link
                href="/lapangan"
                className="inline-flex items-center gap-2 rounded-full bg-lime-400 px-6 py-2.5 text-xs font-bold text-black transition hover:bg-lime-300"
              >
                <span>Lihat Daftar Lapangan</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* BOOKING CARDS LIST */}
        {!loading && session && filteredBookings.length > 0 && (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const start = new Date(booking.startTime);
              const end = new Date(booking.endTime);
              const durationHours = Math.max(
                1,
                Math.ceil((end.getTime() - start.getTime()) / 3600000)
              );

              const paidTotal = booking.payments.reduce(
                (sum, p) => sum + (p.status === "PAID" ? p.amount : 0),
                0
              );
              const totalPrice = paidTotal || durationHours * (booking.lapangan?.price || 0);

              const invoiceNo = generateInvoiceNo(
                booking.id,
                booking.createdAt || booking.startTime
              );

              const isConfirmed = booking.status === "CONFIRMED";
              const isPending = booking.status === "PENDING";
              const isCancelled = booking.status === "CANCELLED";

              return (
                <div
                  key={booking.id}
                  className={`overflow-hidden rounded-[26px] border transition-all duration-200 ${
                    isConfirmed
                      ? "border-lime-400/30 bg-[#0b1713] shadow-[0_0_25px_-5px_rgba(163,230,53,0.06)]"
                      : isPending
                      ? "border-amber-400/25 bg-[#14150e]"
                      : "border-white/10 bg-white/[0.02]"
                  }`}
                >
                  {/* TOP BAR: INVOICE & STATUS BANNER */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-6 py-3.5 bg-black/20">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold tracking-wide text-lime-400">
                        {invoiceNo}
                      </span>
                      <span className="text-[11px] text-white/40">
                        Dipesan: {formatDate(booking.createdAt || booking.startTime)}
                      </span>
                    </div>

                    {/* STATUS BADGE */}
                    <div>
                      {isConfirmed && (
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-lime-400/40 bg-lime-400/15 px-3 py-1 text-xs font-bold text-lime-300">
                          <CheckCircle2 className="h-3.5 w-3.5 text-lime-400" />
                          <span>Pesanan Sudah Dikonfirmasi</span>
                        </div>
                      )}

                      {isPending && (
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/15 px-3 py-1 text-xs font-bold text-amber-300">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                          </span>
                          <Clock3 className="h-3.5 w-3.5 text-amber-400" />
                          <span>Menunggu Konfirmasi Admin</span>
                        </div>
                      )}

                      {isCancelled && (
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-400/40 bg-rose-400/15 px-3 py-1 text-xs font-bold text-rose-300">
                          <XCircle className="h-3.5 w-3.5 text-rose-400" />
                          <span>Dibatalkan</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* MAIN BODY: COURT INFO & SCHEDULE */}
                  <div className="p-6 grid gap-6 md:grid-cols-[140px_1fr_auto] items-center">
                    {/* THUMBNAIL */}
                    <div className="relative h-28 w-full md:w-[140px] overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                      {booking.lapangan?.picture_url ? (
                        <img
                          src={booking.lapangan.picture_url}
                          alt={booking.lapangan.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-white/[0.04] text-xs text-white/40">
                          Foto Lapangan
                        </div>
                      )}
                      {booking.lapangan?.category && (
                        <div className="absolute left-2 top-2">
                          <span className="rounded-full bg-black/70 backdrop-blur px-2 py-0.5 text-[10px] font-semibold text-lime-300">
                            {booking.lapangan.category}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* DETAILS */}
                    <div className="space-y-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold text-white hover:text-lime-300 transition">
                          {booking.lapangan?.name || "Lapangan Olahraga"}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-white/60">
                        <MapPin className="h-3.5 w-3.5 text-lime-400 shrink-0" />
                        <span className="truncate">{booking.lapangan?.location || "Lokasi belum ditentukan"}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-white/70">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-lime-400" />
                          <strong className="text-white">{formatDate(booking.startTime)}</strong>
                        </span>

                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-lime-400" />
                          <span>
                            {formatTime(booking.startTime)} - {formatTime(booking.endTime)} ({durationHours} Jam)
                          </span>
                        </span>
                      </div>

                      {/* CONTEXT STATUS ADVICE */}
                      {isConfirmed && (
                        <div className="mt-2 rounded-xl border border-lime-400/20 bg-lime-400/10 px-3 py-1.5 text-[11px] text-lime-200 flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-lime-400 shrink-0" />
                          <span>Admin telah menyetujui pesanan ini. Anda bisa langsung datang ke venue membawa E-Tiket.</span>
                        </div>
                      )}

                      {isPending && (
                        <div className="mt-2 rounded-xl border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-[11px] text-amber-200 flex items-center gap-2">
                          <Clock3 className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                          <span>Pesanan telah tercatat di database dan sedang menunggu approval admin.</span>
                        </div>
                      )}
                    </div>

                    {/* PRICE & ACTIONS */}
                    <div className="flex flex-col md:items-end justify-between gap-3 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-white/40">Total Pembayaran</p>
                        <p className="mt-0.5 text-xl font-bold text-lime-400">
                          {formatRupiah(totalPrice)}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white/90 hover:bg-white/[0.08] hover:text-white transition cursor-pointer"
                        >
                          <Receipt className="h-3.5 w-3.5 text-lime-400" />
                          <span>E-Tiket</span>
                        </button>

                        {booking.lapangan?.id && (
                          <Link
                            href={`/lapangan/${booking.lapangan.id}`}
                            className="inline-flex items-center gap-1.5 rounded-full border border-lime-400/30 bg-lime-400/10 px-4 py-2 text-xs font-semibold text-lime-300 hover:bg-lime-400/20 transition"
                          >
                            <span>Pesan Lagi</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* MODAL E-TIKET / DETAIL PESANAN */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg overflow-hidden rounded-[28px] border border-white/10 bg-[#0c1612] text-white shadow-2xl">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <Receipt className="h-4 w-4 text-lime-400" />
                <h3 className="text-base font-bold">Rincian & E-Tiket Pesanan</h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="rounded-full p-1.5 text-white/50 hover:bg-white/10 hover:text-white transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              {/* STATUS BANNER */}
              <div
                className={`rounded-2xl p-4 border flex items-start gap-3.5 ${
                  selectedBooking.status === "CONFIRMED"
                    ? "border-lime-400/30 bg-lime-400/10 text-lime-200"
                    : selectedBooking.status === "PENDING"
                    ? "border-amber-400/30 bg-amber-400/10 text-amber-200"
                    : "border-rose-400/30 bg-rose-400/10 text-rose-200"
                }`}
              >
                {selectedBooking.status === "CONFIRMED" ? (
                  <CheckCircle2 className="h-6 w-6 text-lime-400 shrink-0 mt-0.5" />
                ) : selectedBooking.status === "PENDING" ? (
                  <Clock3 className="h-6 w-6 text-amber-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-6 w-6 text-rose-400 shrink-0 mt-0.5" />
                )}

                <div>
                  <h4 className="text-sm font-bold text-white">
                    {selectedBooking.status === "CONFIRMED"
                      ? "Pesanan Sudah Dikonfirmasi Admin"
                      : selectedBooking.status === "PENDING"
                      ? "Menunggu Konfirmasi Admin"
                      : "Pesanan Dibatalkan"}
                  </h4>
                  <p className="mt-1 text-xs opacity-80 leading-relaxed">
                    {selectedBooking.status === "CONFIRMED"
                      ? "Pemesanan Anda telah diverifikasi oleh pengelola. Silakan tunjukkan e-tiket ini saat berada di lokasi lapangan."
                      : selectedBooking.status === "PENDING"
                      ? "Pemesanan Anda sudah masuk dalam sistem database. Mohon tunggu konfirmasi admin atau hubungi pihak pengelola jika ada pertanyaan."
                      : "Pemesanan ini tidak aktif karena telah dibatalkan."}
                  </p>
                </div>
              </div>

              {/* TICKET DETAILS GRID */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-3 text-xs">
                <div className="flex justify-between border-b border-white/5 pb-2.5">
                  <span className="text-white/40">Nomor Invoice</span>
                  <span className="font-mono font-bold text-lime-400">
                    {generateInvoiceNo(selectedBooking.id, selectedBooking.createdAt || selectedBooking.startTime)}
                  </span>
                </div>

                <div className="flex justify-between border-b border-white/5 pb-2.5">
                  <span className="text-white/40">Nama Pemesan</span>
                  <span className="font-semibold text-white">
                    {selectedBooking.customer?.name || session?.user?.name || "Pelanggan"}
                  </span>
                </div>

                <div className="flex justify-between border-b border-white/5 pb-2.5">
                  <span className="text-white/40">Email Pemesan</span>
                  <span className="font-medium text-white/80">
                    {selectedBooking.customer?.email || session?.user?.email}
                  </span>
                </div>

                <div className="flex justify-between border-b border-white/5 pb-2.5">
                  <span className="text-white/40">Nama Lapangan</span>
                  <span className="font-bold text-white">{selectedBooking.lapangan?.name}</span>
                </div>

                <div className="flex justify-between border-b border-white/5 pb-2.5">
                  <span className="text-white/40">Lokasi</span>
                  <span className="font-medium text-white/80 text-right max-w-[200px]">
                    {selectedBooking.lapangan?.location}
                  </span>
                </div>

                <div className="flex justify-between border-b border-white/5 pb-2.5">
                  <span className="text-white/40">Hari & Tanggal</span>
                  <span className="font-semibold text-white">
                    {formatDate(selectedBooking.startTime)}
                  </span>
                </div>

                <div className="flex justify-between border-b border-white/5 pb-2.5">
                  <span className="text-white/40">Jam Main</span>
                  <span className="font-semibold text-lime-300">
                    {formatTime(selectedBooking.startTime)} - {formatTime(selectedBooking.endTime)}
                  </span>
                </div>

                <div className="flex justify-between pt-1 text-sm">
                  <span className="font-bold text-white">Total Biaya</span>
                  <span className="font-bold text-lime-400">
                    {formatRupiah(
                      Math.max(
                        1,
                        Math.ceil(
                          (new Date(selectedBooking.endTime).getTime() -
                            new Date(selectedBooking.startTime).getTime()) /
                            3600000
                        )
                      ) * (selectedBooking.lapangan?.price || 0)
                    )}
                  </span>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.05] py-2.5 text-xs font-semibold text-white hover:bg-white/[0.1] transition cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5 text-white/70" />
                  <span>Cetak Tiket</span>
                </button>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `Halo Admin BookingLapangan, saya ingin menanyakan status pesanan saya dengan kode ${generateInvoiceNo(
                      selectedBooking.id,
                      selectedBooking.createdAt || selectedBooking.startTime
                    )} untuk ${selectedBooking.lapangan?.name}. Terima kasih.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-lime-400 py-2.5 text-xs font-bold text-black hover:bg-lime-300 transition"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>Hubungi Admin</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-white/10 mt-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-white/40 md:flex-row md:items-center md:justify-between">
          <p>© 2026 BookingLapangan. Semua hak dilindungi.</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <Link href="/lapangan" className="hover:text-white transition">Lapangan</Link>
            <Link href="/pemesanan" className="text-lime-400 hover:text-lime-300 transition">Riwayat Pesanan</Link>
            <Link href="/admin" className="hover:text-white transition">Admin</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}