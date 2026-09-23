"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { normalizeLapanganStatus } from "@/lib/lapangan";

type Lapangan = {
  id: string;
  name: string;
  category: string;
  location: string;
  price: number;
  picture_url?: string | null;
  status: string;
  description?: string | null;
  rating?: number;
};

const kategori = ["Semua", "Futsal", "Badminton", "Basketball", "Mini Soccer", "Tenis"];

type FormState = {
  name: string;
  category: string;
  location: string;
  price: number;
  image: string;
  description: string;
  status: "Tersedia" | "Tidak Tersedia";
};

const defaultForm: FormState = {
  name: "",
  category: "Futsal",
  location: "",
  price: 0,
  image: "",
  description: "",
  status: "Tersedia",
};

const formatRupiah = (nominal: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(nominal);
};

function StatCard({
  label,
  value,
  tone = "lime",
}: {
  label: string;
  value: string;
  tone?: "lime" | "blue" | "amber" | "red";
}) {
  const colorMap = {
    lime: "border-lime-400/30 bg-lime-400/10 text-lime-300",
    blue: "border-sky-400/30 bg-sky-400/10 text-sky-300",
    amber: "border-amber-400/30 bg-amber-400/10 text-amber-300",
    red: "border-red-400/30 bg-red-400/10 text-red-300",
  };

  return (
    <div className={`rounded-2xl border ${colorMap[tone]} p-5`}>
      <p className="text-sm text-white/55">{label}</p>
      <p className="mt-3 text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

export default function KelolaLapanganPage() {
  const [lapangan, setLapangan] = useState<Lapangan[]>([]);
  const [search, setSearch] = useState("");
  const [kategoriAktif, setKategoriAktif] = useState("Semua");
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLapangan = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch("/api/lapangan", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Gagal memuat data lapangan");
      }

      if (!Array.isArray(data)) {
        throw new Error("Format data lapangan tidak valid.");
      }

      const mapped = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        category: item.category || "Futsal",
        location: item.location,
        price: Number(item.price),
        picture_url: item.picture_url || "",
        description: item.description || "",
        status: normalizeLapanganStatus(item.status),
        rating: 4.8,
      }));

      setLapangan(mapped);
    } catch (err) {
      console.error("Error mengambil data lapangan:", err);
      setError(
        err instanceof Error ? err.message : "Gagal memuat data lapangan dari server."
      );
      setLapangan([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLapangan();
  }, []);

  const lapanganTerfilter = useMemo(() => {
    return lapangan.filter((item) => {
      const cocokKategori =
        kategoriAktif === "Semua" || item.category === kategoriAktif;

      const key = search.toLowerCase();
      const cocokSearch =
        item.name.toLowerCase().includes(key) ||
        item.location.toLowerCase().includes(key) ||
        item.category.toLowerCase().includes(key);

      return cocokKategori && cocokSearch;
    });
  }, [lapangan, search, kategoriAktif]);

  const totalAktif = lapangan.filter(
    (item) => normalizeLapanganStatus(item.status) === "Tersedia"
  ).length;
  const totalNonaktif = lapangan.length - totalAktif;
  const rataHarga =
    lapangan.length > 0
      ? Math.round(
          lapangan.reduce((total, item) => total + item.price, 0) / lapangan.length,
        )
      : 0;

  const openCreateModal = () => {
    setEditingId(null);
    setForm(defaultForm);
    setIsOpen(true);
  };

  const openEditModal = (item: Lapangan) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      category: item.category,
      location: item.location,
      price: item.price,
      image: item.picture_url || "",
      description: item.description || "",
      status: normalizeLapanganStatus(item.status),
    });
    setIsOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.location.trim()) {
      return;
    }

    try {
      const payload = {
        name: form.name,
        category: form.category,
        location: form.location,
        price: Number(form.price),
        picture_url: form.image || "",
        description: form.description || "",
        status: form.status,
      };

      if (editingId !== null) {
        const response = await fetch(`/api/lapangan/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(data?.error || "Gagal mengubah lapangan");
        }
      } else {
        const response = await fetch("/api/lapangan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(data?.error || "Gagal menambah lapangan");
        }
      }

      await fetchLapangan();
    } catch (err) {
      console.error("Error simpan lapangan:", err);
      setError(
        err instanceof Error ? err.message : "Gagal menyimpan data lapangan."
      );
      return;
    }

    setIsOpen(false);
    setForm(defaultForm);
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    const keputusan = window.confirm("Apakah Anda yakin ingin menghapus lapangan ini?");

    if (!keputusan) {
      return;
    }

    try {
      const response = await fetch(`/api/lapangan/${id}`, { method: "DELETE" });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Gagal menghapus lapangan");
      }

      await fetchLapangan();
    } catch (err) {
      console.error("Error delete lapangan:", err);
      setError(
        err instanceof Error ? err.message : "Gagal menghapus lapangan."
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#07110d] text-white">
      <nav className="border-b border-white/10 bg-[#07110d]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-xl font-bold tracking-tight">
            Booking<span className="text-lime-400">Lapangan</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link href="/" className="text-sm text-white/70 transition hover:text-white">
              Home
            </Link>
            <Link href="/lapangan" className="text-sm text-white/70 transition hover:text-white">
              Lapangan
            </Link>
            <Link href="/lapangan/manage" className="text-sm font-semibold text-lime-400">
              Kelola
            </Link>
          </div>

          <Link
            href="/lapangan"
            className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/[0.08]"
          >
            Kembali
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 pb-8 pt-12">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-lime-400">
              Admin Panel
            </p>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Kelola <span className="text-lime-400">Lapangan</span>
            </h1>
          </div>

          <button
            onClick={openCreateModal}
            className="rounded-full bg-lime-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-lime-300"
          >
            + Tambah Lapangan
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Lapangan" value={String(lapangan.length)} tone="lime" />
          <StatCard label="Tersedia" value={String(totalAktif)} tone="blue" />
          <StatCard label="Tidak Tersedia" value={String(totalNonaktif)} tone="red" />
          <StatCard label="Rata-rata Harga" value={formatRupiah(rataHarga)} tone="amber" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-4 md:flex-row md:items-center md:justify-between">
          <div className="relative max-w-xl flex-1">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nama lapangan, olahraga, atau lokasi..."
              className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-3.5 pr-12 text-white outline-none placeholder:text-white/35 transition focus:border-lime-400/60"
            />
            <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-white/35">
              🔍
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {kategori.map((item) => {
              const aktif = kategoriAktif === item;

              return (
                <button
                  key={item}
                  onClick={() => setKategoriAktif(item)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
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
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-16 text-center text-white/60">
            Memuat data lapangan dari database...
          </div>
        ) : lapanganTerfilter.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {lapanganTerfilter.map((item) => {
              const statusLabel = normalizeLapanganStatus(item.status) === "Tersedia" ? "Tersedia" : "Tidak Tersedia";
              const tersedia = normalizeLapanganStatus(item.status) === "Tersedia";

              return (
                <article
                  key={item.id}
                  className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] transition duration-300 hover:-translate-y-1 hover:border-lime-400/30 hover:bg-white/[0.06]"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={item.picture_url || "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=80"}
                      alt={item.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                    <div className="absolute left-4 top-4">
                      <span className="rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-lime-300 backdrop-blur">
                        {item.category}
                      </span>
                    </div>

                    <div className="absolute right-4 top-4">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur ${
                          tersedia
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-red-500/20 text-red-300"
                        }`}
                      >
                        {statusLabel}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-bold">{item.name}</h3>
                        <p className="mt-1 text-sm text-white/50">{item.location}</p>
                      </div>
                      <span className="rounded-full bg-white/8 px-2 py-1 text-xs text-white/60">
                        ⭐ {item.rating ?? 4.8}
                      </span>
                    </div>

                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-white/60">
                      {item.description || "Lapangan olahraga yang siap digunakan dengan fasilitas lengkap."}
                    </p>

                    <div className="mt-5 flex items-end justify-between gap-4">
                      <div>
                        <p className="text-xs text-white/40">Harga</p>
                        <p className="mt-1 text-lg font-bold text-lime-400">
                          {formatRupiah(item.price)}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="rounded-full bg-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="rounded-full bg-red-500/15 px-3 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/25"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-16 text-center">
            <div className="text-4xl">🔍</div>
            <h3 className="mt-4 text-xl font-bold">Lapangan tidak ditemukan</h3>
            <p className="mt-2 text-sm text-white/45">
              Coba gunakan kata kunci atau filter yang berbeda.
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

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0c1713] p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-lime-400">Form</p>
                <h2 className="mt-2 text-2xl font-bold">
                  {editingId !== null ? "Edit Lapangan" : "Tambah Lapangan"}
                </h2>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/80 hover:bg-white/[0.08]"
              >
                Tutup
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="md:col-span-2">
                <span className="mb-2 block text-sm text-white/60">Nama Lapangan</span>
                <input
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-lime-400/60"
                  placeholder="Contoh: Arena Futsal Premium"
                />
              </label>

              <label>
                <span className="mb-2 block text-sm text-white/60">Olahraga</span>
                <select
                  value={form.category}
                  onChange={(event) => setForm({ ...form, category: event.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-lime-400/60"
                >
                  {kategori.filter((item) => item !== "Semua").map((item) => (
                    <option key={item} value={item} className="bg-[#0c1713]">
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="mb-2 block text-sm text-white/60">Status</span>
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      status: event.target.value as "Tersedia" | "Tidak Tersedia",
                    })
                  }
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-lime-400/60"
                >
                  <option value="Tersedia" className="bg-[#0c1713]">Tersedia</option>
                  <option value="Tidak Tersedia" className="bg-[#0c1713]">Tidak Tersedia</option>
                </select>
              </label>

              <label className="md:col-span-2">
                <span className="mb-2 block text-sm text-white/60">Lokasi</span>
                <input
                  value={form.location}
                  onChange={(event) => setForm({ ...form, location: event.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-lime-400/60"
                  placeholder="Contoh: Kuranji, Padang"
                />
              </label>

              <label>
                <span className="mb-2 block text-sm text-white/60">Harga / jam</span>
                <input
                  type="number"
                  value={form.price}
                  onChange={(event) => setForm({ ...form, price: Number(event.target.value) })}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-lime-400/60"
                />
              </label>

              <label>
                <span className="mb-2 block text-sm text-white/60">URL Gambar</span>
                <input
                  value={form.image}
                  onChange={(event) => setForm({ ...form, image: event.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-lime-400/60"
                  placeholder="https://..."
                />
              </label>

              <label className="md:col-span-2">
                <span className="mb-2 block text-sm text-white/60">Deskripsi</span>
                <textarea
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                  rows={4}
                  className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-lime-400/60"
                  placeholder="Tambahkan deskripsi lapangan..."
                />
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-white/[0.08]"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                className="rounded-full bg-lime-400 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-lime-300"
              >
                {editingId !== null ? "Simpan Perubahan" : "Simpan Lapangan"}
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-white/40 md:flex-row md:items-center md:justify-between">
          <p>© 2026 BookingLapangan. Semua hak dilindungi.</p>
          <p>Panel pengelolaan lapangan olahraga.</p>
        </div>
      </footer>
    </main>
  );
}
