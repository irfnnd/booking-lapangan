"use client";

import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import CustomerNavbar from "@/components/CustomerNavbar";
import { useSession } from "@/lib/auth-client";

export default function LapanganPage() {
  const { data: session, isPending } = useSession();

  return (
    <main className="min-h-screen bg-[#07110d] text-white">
      {/* NAVBAR */}
      <CustomerNavbar />

      {/* CONTENT HOMEPAGE SEBELUMNYA */}
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

          {/* USER SUDAH LOGIN / BELUM LOGIN */}
          {!isPending && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {session ? (
                <>
                  <Link
                    href="/lapangan"
                    className="rounded-full bg-lime-400 px-7 py-3 text-sm font-semibold text-black transition hover:bg-lime-300"
                  >
                    Cari Lapangan
                  </Link>
                  <Link
                    href="/pemesanan"
                    className="rounded-full border border-white/20 px-7 py-3 text-sm font-semibold text-white transition hover:border-lime-400 hover:text-lime-400"
                  >
                    Riwayat Pesanan
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/lapangan"
                    className="rounded-full bg-lime-400 px-7 py-3 text-sm font-semibold text-black transition hover:bg-lime-300"
                  >
                    Jelajahi Lapangan
                  </Link>
                  <Link
                    href="/login"
                    className="rounded-full border border-white/20 px-7 py-3 text-sm font-semibold text-white transition hover:border-lime-400 hover:text-lime-400"
                  >
                    Masuk
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {/* SEKSI TENTANG KAMI (ID: TENTANG) */}
      <section id="tentang" className="scroll-mt-20 border-t border-white/10 bg-white/[0.02] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-lime-400/30 bg-lime-400/10 px-4 py-1.5 text-xs font-semibold text-lime-300 mb-3">
              <Building2 className="h-3.5 w-3.5 text-lime-400" />
              <span>Profil & Informasi Usaha</span>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl">
              Tentang <span className="text-lime-400">BookingLapangan</span>
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/70">
              <strong>BookingLapangan</strong> adalah sistem penyewaan sarana olahraga berbasis digital yang menghadirkan kemudahan reservasi lapangan secara praktis, akurat, dan transparan bagi seluruh pecinta olahraga.
            </p>
          </div>

          {/* GRID FITUR / KEUNGGULAN TENTANG */}
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-400/10 text-lime-400 border border-lime-400/20 mb-4">
                <Trophy className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white">Fasilitas Standar Atlet</h3>
              <p className="mt-2 text-xs leading-relaxed text-white/60">
                Lapangan dirawat secara rutin dengan pencahayaan terang dan rumput/karpet berkualitas tinggi.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-400/10 text-lime-400 border border-lime-400/20 mb-4">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white">Pemesanan 24 Jam</h3>
              <p className="mt-2 text-xs leading-relaxed text-white/60">
                Pesan slot jadwal kapan saja secara real-time tanpa perlu khawatir bentrok dengan pemesan lain.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-400/10 text-lime-400 border border-lime-400/20 mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white">Pembayaran Aman</h3>
              <p className="mt-2 text-xs leading-relaxed text-white/60">
                Mendukung berbagai metode pembayaran digital via QRIS & Transfer Bank dengan verifikasi otomatis.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-400/10 text-lime-400 border border-lime-400/20 mb-4">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white">Konfirmasi Instan</h3>
              <p className="mt-2 text-xs leading-relaxed text-white/60">
                Dapatkan nota invoice dan bukti reservasi sah secara langsung setelah pembayaran diselesaikan.
              </p>
            </div>
          </div>

          {/* INFORMASI OPERASIONAL & KONTAK */}
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400/20 text-lime-400">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Jam Operasional</h4>
                  <p className="text-xs text-lime-400">Buka Setiap Hari</p>
                </div>
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                Senin – Minggu: 07.00 – 23.00 WIB <br />
                Layanan booking online dapat diakses 24 jam nonstop.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400/20 text-lime-400">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Lokasi Lapangan</h4>
                  <p className="text-xs text-lime-400">Kota Padang</p>
                </div>
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                Jl. Raya Kuranji No. 88, Kuranji, Kota Padang, Sumatera Barat. <br />
                Fasilitas parkir luas, ruang ganti, dan tempat istirahat.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400/20 text-lime-400">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Layanan CS & WA</h4>
                  <p className="text-xs text-lime-400">Bantuan & Reskedul</p>
                </div>
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                WhatsApp: +62 812-3456-7890 <br />
                Email: admin@bookinglapangan.com
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-white/40 md:flex-row md:items-center md:justify-between">
          <p>© 2026 BookingLapangan. Semua hak dilindungi.</p>
          <p>Booking lapangan olahraga dengan mudah.</p>
        </div>
      </footer>
    </main>
  );
}