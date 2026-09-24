import Link from "next/link";
import type { Metadata } from "next";
import { Users, Dumbbell, CalendarClock, Wallet, ArrowRight } from "lucide-react";
import DashboardCard from "@/components/admin/DashboardCard";
import RecentBookingsTable from "@/components/admin/RecentBookingsTable";
import RevenueChart from "@/components/admin/RevenueChart";
import { prisma } from "@/app/prisma";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Pantau statistik dan aktivitas terbaru di panel admin BookingLapangan.",
};

export default async function AdminDashboard() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, -1);

  const [
    totalCustomers,
    lapanganStats,
    pendingBookings,
    thisMonthBookings,
    lastMonthBookings
  ] = await Promise.all([
    prisma.customer.count(),
    prisma.lapangan.groupBy({ by: ['status'], _count: { id: true } }),
    prisma.booking.count({ where: { status: 'PENDING' } }),
    prisma.booking.findMany({
      where: {
        startTime: { gte: startOfMonth },
        OR: [{ status: "CONFIRMED" }, { payments: { some: { status: "PAID" } } }],
      },
      include: { lapangan: true, payments: { take: 1, orderBy: { paymentDate: "desc" } } }
    }),
    prisma.booking.findMany({
      where: {
        startTime: { gte: startOfLastMonth, lte: endOfLastMonth },
        OR: [{ status: "CONFIRMED" }, { payments: { some: { status: "PAID" } } }],
      },
      include: { lapangan: true, payments: { take: 1, orderBy: { paymentDate: "desc" } } }
    }),
  ]);

  const activeLapangan = lapanganStats.find(s => s.status.toLowerCase() === 'aktif')?._count.id || 0;
  const totalLapangan = lapanganStats.reduce((acc, s) => acc + s._count.id, 0);
  const maintenanceLapangan = totalLapangan - activeLapangan;

  // Calculate Revenue
  const calcRevenue = (bookings: any[]) => bookings.reduce((acc, b) => {
    const pay = b.payments[0];
    if (pay && pay.status === "PAID" && pay.amount > 0) return acc + pay.amount;
    
    if (b.status === "CONFIRMED") {
      const durationHours = (b.endTime.getTime() - b.startTime.getTime()) / (1000 * 60 * 60);
      return acc + Math.round(b.lapangan.price * durationHours);
    }
    
    return acc;
  }, 0);

  const thisMonthRevenue = calcRevenue(thisMonthBookings);
  const lastMonthRevenue = calcRevenue(lastMonthBookings);

  let revenueTrend = "0%";
  let isRevenuePositive = true;
  if (lastMonthRevenue > 0) {
    const pct = ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
    isRevenuePositive = pct >= 0;
    revenueTrend = `${isRevenuePositive ? "+" : ""}${pct.toFixed(1)}% vs bulan lalu`;
  } else if (thisMonthRevenue > 0) {
    revenueTrend = "+100% vs bulan lalu";
    isRevenuePositive = true;
  }

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
            value={totalCustomers.toString()}
            icon={Users}
            colorScheme="blue"
            subtitle="Pelanggan terdaftar"
          />

          <DashboardCard
            title="Total Lapangan"
            value={`${totalLapangan} Unit`}
            icon={Dumbbell}
            colorScheme="purple"
            subtitle={`${activeLapangan} Aktif, ${maintenanceLapangan} Pemeliharaan`}
          />

          <DashboardCard
            title="Booking Pending"
            value={pendingBookings.toString()}
            icon={CalendarClock}
            colorScheme="amber"
            trend={pendingBookings > 0 ? { value: "Perlu konfirmasi", isPositive: false } : undefined}
            subtitle="Menunggu verifikasi"
          />

          <DashboardCard
            title="Total Pendapatan"
            value={`Rp ${thisMonthRevenue.toLocaleString("id-ID")}`}
            icon={Wallet}
            colorScheme="emerald"
            trend={{ value: revenueTrend, isPositive: isRevenuePositive }}
            subtitle={`Bulan ${now.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}`}
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