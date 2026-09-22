import Link from "next/link";
import { Users, Dumbbell, CalendarClock, Wallet, Plus, ArrowRight } from "lucide-react";
import DashboardCard from "@/components/admin/DashboardCard";
import RecentBookingsTable from "@/components/admin/RecentBookingsTable";
import RevenueChart from "@/components/admin/RevenueChart";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* WELCOME / BANNER HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-950 via-gray-900 to-gray-800 p-6 text-white shadow-xl dark:border dark:border-gray-800 sm:p-8">
        <div className="relative z-10 max-w-2xl space-y-2">
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
            Selamat Datang di Admin Panel 👋
          </h1>
          <p className="text-xs text-gray-300 sm:text-sm leading-relaxed">
            Pantau aktivitas pemesanan lapangan, statistik transaksi harian, dan kelola fasilitas olahraga dengan cepat dan efektif.
          </p>
        </div>

        {/* DECORATIVE ELEMENTS */}
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-lime-400/10 blur-3xl pointer-events-none" />
      </div>

      {/* METRIC CARDS GRID */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">
            Ringkasan Statistik
          </h2>
          <span className="text-xs text-gray-400">Diperbarui real-time</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardCard
            title="Total Pelanggan"
            value="128"
            icon={Users}
            colorScheme="blue"
            trend={{ value: "+12.5% bulan ini", isPositive: true }}
            subtitle="Pelanggan terdaftar"
          />

          <DashboardCard
            title="Total Lapangan"
            value="8 Unit"
            icon={Dumbbell}
            colorScheme="purple"
            subtitle="6 Aktif, 2 Pemeliharaan"
          />

          <DashboardCard
            title="Booking Pending"
            value="12"
            icon={CalendarClock}
            colorScheme="amber"
            trend={{ value: "Perlu konfirmasi", isPositive: false }}
            subtitle="Menunggu verifikasi"
          />

          <DashboardCard
            title="Total Pendapatan"
            value="Rp 8.450.000"
            icon={Wallet}
            colorScheme="emerald"
            trend={{ value: "+18.2% vs minggu lalu", isPositive: true }}
            subtitle="Bulan September 2026"
          />
        </div>
      </div>

      {/* REVENUE & OCCUPANCY CHART */}
      <div>
        <RevenueChart />
      </div>

      {/* RECENT BOOKING TABLE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Pemesanan Terbaru
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Menampilkan 5 transaksi booking terakhir.
            </p>
          </div>

          <Link
            href="/admin/booking"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-lime-600 hover:text-lime-700 dark:text-lime-400 dark:hover:text-lime-300 transition"
          >
            <span>Lihat Semua Booking</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <RecentBookingsTable limit={5} />
      </div>
    </div>
  );
}