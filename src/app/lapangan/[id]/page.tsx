"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { normalizeLapanganStatus } from "@/lib/lapangan";
import CustomerNavbar from "@/components/CustomerNavbar";

const fallbackImage =
  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80";

const bookingSlots = [
  { label: "08:00 - 09:00", available: true },
  { label: "09:00 - 10:00", available: true },
  { label: "10:00 - 11:00", available: false },
  { label: "13:00 - 14:00", available: true },
  { label: "14:00 - 15:00", available: true },
  { label: "15:00 - 16:00", available: false },
  { label: "16:00 - 17:00", available: true },
  { label: "17:00 - 18:00", available: true },
];

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const toLocalDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const addDays = (date: Date, amount: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
};

const formatDisplayDate = (value: string) => {
  if (!value) return "Pilih tanggal";

  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

const getDefaultFeatures = (category: string) => {
  const base = [
    "Area latihan yang nyaman",
    "Pencahayaan yang memadai",
    "Akses mudah untuk pengguna",
    "Fasilitas pendukung lengkap",
  ];

  if (category === "Futsal") {
    return [
      "Permukaan sintetis premium",
      "Pencahayaan full LED",
      "Ruang ganti bersih",
      "Parkir motor tersedia",
    ];
  }

  if (category === "Badminton") {
    return [
      "Lantai anti selip",
      "AC ruangan",
      "Area latihan nyaman",
      "Cocok untuk latihan rutin",
    ];
  }

  if (category === "Basketball") {
    return [
      "Ring basket standar",
      "Papan skor digital",
      "Tribun penonton",
      "Cocok untuk latihan tim",
    ];
  }

  if (category === "Mini Soccer") {
    return [
      "Rumput sintetis berkualitas",
      "Jaring pengaman keliling",
      "Pemeliharaan rutin",
      "Cocok untuk latihan tim",
    ];
  }

  return base;
};

export default function LapanganDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [lapangan, setLapangan] = useState<any | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(() => toLocalDateString(new Date()));
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");

  useEffect(() => {
    const loadLapangan = async () => {
      try {
        const resolvedParams = await params;
        const response = await fetch("/api/lapangan", {
          cache: "no-store",
        });

        if (!response.ok) {
          setLapangan(null);
          return;
        }

        const data = await response.json();
        const found = Array.isArray(data)
          ? data.find((item: any) => item.id === resolvedParams.id)
          : null;

        setLapangan(found || null);
      } catch (error) {
        console.error("Error loading lapangan detail:", error);
        setLapangan(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadLapangan();
  }, [params]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#07110d] text-white">
        <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6 text-white/70">
          Memuat detail lapangan...
        </div>
      </main>
    );
  }

  if (!lapangan) {
    return (
      <main className="min-h-screen bg-[#07110d] text-white">
        <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6 text-center">
          <div>
            <p className="text-lg font-semibold text-white">Lapangan tidak ditemukan</p>
            <Link href="/lapangan" className="mt-4 inline-block rounded-full bg-lime-400 px-5 py-2.5 text-sm font-semibold text-black">
              Kembali ke daftar
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const status = normalizeLapanganStatus(lapangan.status);
  const tersedia = status === "Tersedia";
  const featureList = Array.isArray(lapangan.features)
    ? lapangan.features
    : getDefaultFeatures(lapangan.category || "Futsal");

  return (
    <main className="min-h-screen bg-[#07110d] text-white">
      <CustomerNavbar />

      <section className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-white/60">
          <Link href="/lapangan" className="text-lime-400 transition hover:text-lime-300">
            Lapangan
          </Link>
          <span>/</span>
          <span>{lapangan.category}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03]">
            <div className="relative h-[420px] overflow-hidden">
              <img
                src={lapangan.picture_url}
                alt={lapangan.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07110d] via-black/10 to-transparent" />

              <div className="absolute left-5 top-5">
                <span className="rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-lime-300 backdrop-blur">
                  {lapangan.category}
                </span>
              </div>

              <div className="absolute right-5 top-5">
                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur ${
                    tersedia
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-amber-500/20 text-amber-300"
                  }`}
                >
                  {status}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 md:p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-lime-400">
              Detail Lapangan
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              {lapangan.name}
            </h1>

            <div className="mt-4 flex items-center gap-2 text-sm text-white/60">
              <span>📍</span>
              <span>{lapangan.location}</span>
            </div>

            <div className="mt-6 rounded-2xl border border-lime-400/20 bg-lime-400/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-lime-300/80">
                Harga Sewa
              </p>
              <p className="mt-2 text-3xl font-bold text-lime-400">
                {formatRupiah(lapangan.price)}
              </p>
              <p className="mt-1 text-sm text-white/60">per jam</p>
            </div>

            <div className="mt-6">
              <div className="rounded-2xl border border-white/10 bg-[#0b1713] p-3">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                    Tanggal booking
                  </span>
                  <span className="rounded-full border border-lime-400/30 bg-lime-400/10 px-2 py-1 text-[10px] font-medium text-lime-300">
                    {formatDisplayDate(selectedDate)}
                  </span>
                </div>

                <input
                  type="date"
                  value={selectedDate}
                  min={toLocalDateString(new Date())}
                  onChange={(e) => {
                    const nextDate = e.target.value;
                    setSelectedDate(nextDate);
                    setBookingMessage("");
                  }}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none transition focus:border-lime-400/60"
                />

                <div className="mt-3 grid grid-cols-3 gap-2">
                  {[
                    { label: "Hari Ini", value: toLocalDateString(new Date()) },
                    { label: "Besok", value: toLocalDateString(addDays(new Date(), 1)) },
                    { label: "Lusa", value: toLocalDateString(addDays(new Date(), 2)) },
                  ].map((option) => {
                    const active = option.value === selectedDate;

                    return (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() => setSelectedDate(option.value)}
                        className={`rounded-xl border px-2 py-2 text-xs font-medium transition ${
                          active
                            ? "border-lime-400 bg-lime-400/15 text-lime-300"
                            : "border-white/10 bg-white/[0.02] text-white/70 hover:border-lime-400/40 hover:text-white"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/55">
                  Pilih Jam Booking
                </h3>
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-white/55">
                  {selectedSlots.length} dipilih
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {bookingSlots.map((slot) => {
                  const isSelected = selectedSlots.includes(slot.label);

                  return (
                    <button
                      key={slot.label}
                      type="button"
                      disabled={!slot.available || !tersedia}
                      onClick={() => {
                        if (!slot.available || !tersedia) return;

                        setSelectedSlots((prev) =>
                          prev.includes(slot.label)
                            ? prev.filter((item) => item !== slot.label)
                            : [...prev, slot.label]
                        );
                      }}
                      className={`rounded-2xl border px-3 py-2 text-left text-xs font-medium transition ${
                        !slot.available || !tersedia
                          ? "cursor-not-allowed border-white/10 bg-white/[0.03] text-white/30"
                          : isSelected
                            ? "border-lime-400 bg-lime-400/15 text-lime-300 shadow-[0_0_0_1px_rgba(163,230,53,0.2)]"
                            : "border-white/10 bg-white/[0.04] text-white/75 hover:border-lime-400/40 hover:text-white"
                      }`}
                    >
                      <span className="block text-center">{slot.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-[#0b1713] p-3">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                  Jam dipilih
                </p>
                <div className="flex min-h-[32px] flex-wrap gap-2">
                  {selectedSlots.length > 0 ? (
                    selectedSlots.map((slot) => (
                      <span
                        key={slot}
                        className="rounded-full border border-lime-400/30 bg-lime-400/10 px-2.5 py-1 text-xs font-medium text-lime-300"
                      >
                        {slot}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-white/45">Belum ada jam dipilih</span>
                  )}
                </div>
              </div>

              {selectedSlots.length > 0 && (
                <div className="mt-4 rounded-2xl border border-lime-400/20 bg-lime-400/10 p-3 text-sm text-lime-200">
                  Total: <span className="font-semibold">{formatRupiah(selectedSlots.length * lapangan.price)}</span>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                disabled={!tersedia || selectedSlots.length === 0 || isSubmitting}
                onClick={async () => {
                  if (!tersedia || selectedSlots.length === 0 || isSubmitting) return;

                  try {
                    setIsSubmitting(true);
                    setBookingMessage("");

                    const response = await fetch("/api/booking", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        lapanganId: lapangan.id,
                        selectedSlots,
                        bookingDate: selectedDate,
                      }),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                      throw new Error(data?.error || "Gagal menyimpan booking.");
                    }

                    setBookingMessage(
                      `Booking berhasil disimpan untuk ${data.bookings} slot.`
                    );
                    setSelectedSlots([]);
                  } catch (error) {
                    console.error("Booking error:", error);
                    setBookingMessage(
                      error instanceof Error
                        ? error.message
                        : "Gagal menyimpan booking."
                    );
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                  tersedia && selectedSlots.length > 0 && !isSubmitting
                    ? "bg-lime-400 text-black hover:bg-lime-300"
                    : "cursor-not-allowed bg-white/5 text-white/35"
                }`}
              >
                {isSubmitting
                  ? "Menyimpan..."
                  : tersedia
                    ? "Booking Sekarang"
                    : "Tidak Tersedia"}
              </button>

              <Link
                href="/lapangan"
                className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
              >
                Lihat Lainnya
              </Link>
            </div>

            {bookingMessage && (
              <p
                className={`mt-4 text-sm ${
                  bookingMessage.toLowerCase().includes("berhasil")
                    ? "text-lime-300"
                    : "text-red-300"
                }`}
              >
                {bookingMessage}
              </p>
            )}
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 md:p-7">
            <h2 className="text-2xl font-bold">Deskripsi</h2>
            <p className="mt-4 text-base leading-7 text-white/65">
              {lapangan.description}
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 md:p-7">
            <h2 className="text-2xl font-bold">Fasilitas</h2>
            <ul className="mt-4 space-y-3 text-sm text-white/75">
              {featureList.map((feature: string) => (
                <li key={feature} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-lime-400/15 text-lime-300">
                    ✓
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-white/40 md:flex-row md:items-center md:justify-between">
          <p>©️ 2026 BookingLapangan. Semua hak dilindungi.</p>
          <p>Booking lapangan olahraga dengan mudah.</p>
        </div>
      </footer>
    </main>
  );
}