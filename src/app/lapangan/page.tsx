"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "@/lib/auth-client";
import { isLapanganAvailable } from "@/lib/lapangan";

type Lapangan = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  location: string;
  price: number;
  picture_url: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};

const fallbackImage =
  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=900&q=80";

export default function LapanganPage() {
  const { data: session, isPending } = useSession();

  const [search, setSearch] = useState("");
  const [kategoriAktif, setKategoriAktif] = useState("Semua");
  const [menuAkunTerbuka, setMenuAkunTerbuka] = useState(false);

  const [daftarLapangan, setDaftarLapangan] = useState<Lapangan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // AMBIL DATA DARI DATABASE
  // =========================
  useEffect(() => {
    const fetchLapangan = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch("/api/lapangan", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error || "Gagal memuat data lapangan"
          );
        }

        if (!Array.isArray(data)) {
          throw new Error("Format data lapangan tidak valid.");
        }

        setDaftarLapangan(data);
      } catch (err) {
        console.error("Error mengambil data lapangan:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Gagal memuat data lapangan dari server."
        );

        setDaftarLapangan([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLapangan();
  }, []);

  // =========================
  // KATEGORI DINAMIS
  // =========================
  const kategori = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        daftarLapangan
          .map((lapangan) => lapangan.category)
          .filter(Boolean)
      )
    );

    return ["Semua", ...uniqueCategories];
  }, [daftarLapangan]);

  // =========================
  // FILTER + SEARCH
  // =========================
  const lapanganTerfilter = useMemo(() => {
    return daftarLapangan.filter((lapangan) => {
      const cocokKategori =
        kategoriAktif === "Semua" ||
        lapangan.category === kategoriAktif;

      const kataKunci = search.toLowerCase().trim();

      const cocokSearch =
        lapangan.name.toLowerCase().includes(kataKunci) ||
        lapangan.category.toLowerCase().includes(kataKunci) ||
        lapangan.location.toLowerCase().includes(kataKunci);

      return cocokKategori && cocokSearch;
    });
  }, [daftarLapangan, search, kategoriAktif]);

  // =========================
  // JUMLAH LAPANGAN AKTIF
  // =========================
  const lapanganTersediaCount = daftarLapangan.filter((lapangan) =>
    isLapanganAvailable(lapangan.status)
  ).length;

  // =========================
  // FORMAT RUPIAH
  // =========================
  const formatRupiah = (nominal: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(nominal);
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/";
        },
      },
    });
  };

  return (
    <main className="min-h-screen bg-[#07110d] text-white">
      {/* =========================
          NAVBAR
      ========================= */}
      <nav className="border-b border-white/10 bg-[#07110d]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          {/* LOGO */}
          <Link
            href="/"
            className="text-xl font-bold tracking-tight"
          >
            Booking
            <span className="text-lime-400">Lapangan</span>
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
              className="text-sm font-semibold text-lime-400"
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

          {/* AUTH */}
          {!isPending &&
            (session ? (
              <div className="relative">
                {/* FOTO PROFIL */}
                <button
                  type="button"
                  onClick={() =>
                    setMenuAkunTerbuka(!menuAkunTerbuka)
                  }
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
                      {session?.user?.name
                        ?.charAt(0)
                        .toUpperCase() || "U"}
                    </div>
                  )}
                </button>

                {/* MENU AKUN */}
                {menuAkunTerbuka && (
                  <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#101a15] shadow-2xl">
                    {/* PROFIL */}
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

      {/* =========================
          HEADER
      ========================= */}
      <section className="mx-auto max-w-7xl px-6 pb-8 pt-14">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-lime-400">
            Cari Lapangan
          </p>

          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Temukan lapangan
            <br />
            <span className="text-lime-400">
              untuk permainanmu.
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-white/60">
            Pilih lapangan olahraga yang sesuai dengan
            kebutuhanmu. Cari berdasarkan nama, jenis olahraga,
            atau lokasi.
          </p>
        </div>

        {/* SEARCH */}
        <div className="mt-10">
          <div className="relative max-w-3xl">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nama lapangan, olahraga, atau lokasi..."
              className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 pr-12 text-white outline-none placeholder:text-white/35 transition focus:border-lime-400/60 focus:bg-white/[0.08]"
            />

            <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-white/40">
              🔍
            </div>
          </div>
        </div>

        {/* CATEGORY */}
        <div className="mt-6 flex flex-wrap gap-3">
          {kategori.map((item) => {
            const aktif = kategoriAktif === item;

            return (
              <button
                key={item}
                type="button"
                onClick={() => setKategoriAktif(item)}
                className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                  aktif
                    ? "bg-lime-400 text-black"
                    : "border border-white/10 bg-white/[0.04] text-white/60 hover:bg-white/[0.08] hover:text-white"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </section>

      {/* =========================
          DAFTAR LAPANGAN
      ========================= */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              Lapangan tersedia
            </h2>

            <p className="mt-2 text-sm text-white/45">
              {lapanganTersediaCount} Tersedia ·{" "}
              {lapanganTerfilter.length} ditemukan
            </p>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {/* LOADING */}
        {isLoading ? (
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-16 text-center text-white/60">
            Memuat data lapangan dari database...
          </div>
        ) : lapanganTerfilter.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {lapanganTerfilter.map((lapangan) => {
              const tersedia = isLapanganAvailable(lapangan.status);
              const statusLabel = tersedia ? "Tersedia" : "Tidak Tersedia";

              return (
                <article
                  key={lapangan.id}
                  className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] transition duration-300 hover:-translate-y-1 hover:border-lime-400/30 hover:bg-white/[0.06]"
                >
                  {/* GAMBAR */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={
                        lapangan.picture_url || fallbackImage
                      }
                      alt={lapangan.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                    {/* KATEGORI */}
                    <div className="absolute left-4 top-4">
                      <span className="rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-lime-300 backdrop-blur">
                        {lapangan.category}
                      </span>
                    </div>

                    {/* STATUS */}
                    <div className="absolute right-4 top-4">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur ${
                          tersedia
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-amber-500/20 text-amber-300"
                        }`}
                      >
                        {statusLabel}
                      </span>
                    </div>
                  </div>

                  {/* INFORMASI */}
                  <div className="p-5">
                    <h3 className="text-xl font-bold">
                      {lapangan.name}
                    </h3>

                    <p className="mt-2 flex items-center gap-2 text-sm text-white/50">
                      <span>📍</span>
                      {lapangan.location}
                    </p>

                    {/* DESKRIPSI */}
                    {lapangan.description && (
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/45">
                        {lapangan.description}
                      </p>
                    )}

                    <div className="mt-5 flex items-end justify-between gap-4">
                      <div>
                        <p className="text-xs text-white/40">
                          Mulai dari
                        </p>

                        <p className="mt-1 text-lg font-bold text-lime-400">
                          {formatRupiah(lapangan.price)}
                        </p>

                        <p className="text-xs text-white/40">
                          / jam
                        </p>
                      </div>
                      {tersedia ? (
                        <Link
                          href={`/lapangan/${lapangan.id}`}
                          className="rounded-full bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-lime-400 hover:text-black"
                        >
                          Pesan
                        </Link>
                      ):(
                        <button
                        type="button"
                        disabled
                        className="cursor-not-allowed rounded-full bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/40"
                        >
                          Tidak Tersedia
                        </button>
                      )
                      }
                </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* DATA KOSONG */
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-16 text-center">
            <div className="text-4xl">🔍</div>

            <h3 className="mt-4 text-xl font-bold">
              Lapangan tidak ditemukan
            </h3>

            <p className="mt-2 text-sm text-white/45">
              Coba gunakan kata kunci atau kategori olahraga
              yang berbeda.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setKategoriAktif("Semua");
              }}
              className="mt-6 rounded-full bg-lime-400 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-lime-300"
            >
              Reset Pencarian
            </button>
          </div>
        )}
      </section>

      {/* =========================
          FOOTER
      ========================= */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-white/40 md:flex-row md:items-center md:justify-between">
          <p>© 2026 BookingLapangan. Semua hak dilindungi.</p>

          <p>Booking lapangan olahraga dengan mudah.</p>
        </div>
      </footer>
    </main>
  );
}