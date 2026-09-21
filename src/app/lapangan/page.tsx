"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "@/lib/auth-client";

type Lapangan = {
  id: number;
  nama: string;
  olahraga: string;
  lokasi: string;
  harga: number;
  rating: number;
  image: string;
};

const daftarLapangan: Lapangan[] = [
  {
    id: 1,
    nama: "Arena Futsal Premium",
    olahraga: "Futsal",
    lokasi: "Padang, Sumatera Barat",
    harga: 120000,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    nama: "Victory Badminton",
    olahraga: "Badminton",
    lokasi: "Padang, Sumatera Barat",
    harga: 75000,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    nama: "Sport Center Basketball",
    olahraga: "Basket",
    lokasi: "Kota Padang",
    harga: 150000,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    nama: "Champion Mini Soccer",
    olahraga: "Mini Soccer",
    lokasi: "Kuranji, Padang",
    harga: 200000,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    nama: "Smash Badminton Hall",
    olahraga: "Badminton",
    lokasi: "Lubuk Begalung",
    harga: 85000,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 6,
    nama: "Galaxy Futsal",
    olahraga: "Futsal",
    lokasi: "Nanggalo, Padang",
    harga: 100000,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=900&q=80",
  },
];

const kategori = [
  "Semua",
  "Futsal",
  "Badminton",
  "Basket",
  "Mini Soccer",
];

export default function LapanganPage() {
  const { data: session, isPending } = useSession();

  const [search, setSearch] = useState("");
  const [kategoriAktif, setKategoriAktif] = useState("Semua");

  const lapanganTerfilter = useMemo(() => {
    return daftarLapangan.filter((lapangan) => {
      const cocokKategori =
        kategoriAktif === "Semua" ||
        lapangan.olahraga === kategoriAktif;

      const kataKunci = search.toLowerCase();

      const cocokSearch =
        lapangan.nama.toLowerCase().includes(kataKunci) ||
        lapangan.olahraga.toLowerCase().includes(kataKunci) ||
        lapangan.lokasi.toLowerCase().includes(kataKunci);

      return cocokKategori && cocokSearch;
    });
  }, [search, kategoriAktif]);

  const formatRupiah = (nominal: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(nominal);
  };

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

          {/* AUTH BUTTON */}
          {!isPending &&
            (session ? (
              <button
                onClick={handleLogout}
                className="rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                Keluar
              </button>
            ) : (
              <Link
                href="/login"
                className="rounded-full bg-lime-400 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-lime-300"
              >
                Masuk
              </Link>
            ))}
        </div>
      </nav>

      {/* HEADER */}
      <section className="mx-auto max-w-7xl px-6 pb-8 pt-14">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-lime-400">
            Cari Lapangan
          </p>

          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Temukan lapangan
            <br />
            <span className="text-lime-400">untuk permainanmu.</span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-white/60">
            Pilih lapangan olahraga yang sesuai dengan kebutuhanmu.
            Cari berdasarkan nama, jenis olahraga, atau lokasi.
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

      {/* DAFTAR LAPANGAN */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              Lapangan tersedia
            </h2>

            <p className="mt-2 text-sm text-white/45">
              {lapanganTerfilter.length} lapangan ditemukan
            </p>
          </div>
        </div>

        {lapanganTerfilter.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {lapanganTerfilter.map((lapangan) => (
              <article
                key={lapangan.id}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] transition duration-300 hover:-translate-y-1 hover:border-lime-400/30 hover:bg-white/[0.06]"
              >
                {/* IMAGE */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={lapangan.image}
                    alt={lapangan.nama}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  {/* SPORT */}
                  <div className="absolute left-4 top-4">
                    <span className="rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-lime-300 backdrop-blur">
                      {lapangan.olahraga}
                    </span>
                  </div>

                  {/* RATING */}
                  <div className="absolute bottom-4 right-4">
                    <span className="rounded-full bg-black/70 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur">
                      ⭐ {lapangan.rating}
                    </span>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-5">
                  <h3 className="text-xl font-bold">
                    {lapangan.nama}
                  </h3>

                  <p className="mt-2 flex items-center gap-2 text-sm text-white/50">
                    <span>📍</span>
                    {lapangan.lokasi}
                  </p>

                  <div className="mt-5 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs text-white/40">
                        Mulai dari
                      </p>

                      <p className="mt-1 text-lg font-bold text-lime-400">
                        {formatRupiah(lapangan.harga)}
                      </p>

                      <p className="text-xs text-white/40">
                        / jam
                      </p>
                    </div>

                    <Link
                      href={`/lapangan/${lapangan.id}`}
                      className="rounded-full bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-lime-400 hover:text-black"
                    >
                      Lihat Detail
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* TIDAK ADA HASIL */
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