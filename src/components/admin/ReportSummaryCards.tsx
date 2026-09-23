"use client";

import React from "react";
import {
  TrendingUp,
  DollarSign,
  CalendarCheck,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
} from "lucide-react";

interface ReportSummaryCardsProps {
  period: string;
}

export default function ReportSummaryCards({ period }: ReportSummaryCardsProps) {
  // Mock statistics based on period
  const stats = {
    totalRevenue: period === "today" ? 1850000 : period === "week" ? 6400000 : period === "year" ? 245000000 : 28450000,
    revenueGrowth: "+18.4%",
    isGrowthPositive: true,
    totalBookings: period === "today" ? 12 : period === "week" ? 48 : period === "year" ? 1840 : 194,
    bookingGrowth: "+12.5%",
    avgTransaction: period === "today" ? 154166 : period === "week" ? 133333 : period === "year" ? 133152 : 146649,
    topField: "Lapangan Futsal A",
    topFieldCount: period === "today" ? 5 : period === "week" ? 18 : period === "year" ? 620 : 74,
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. TOTAL PENDAPATAN */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900 transition hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Total Pendapatan
          </span>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400/10 text-lime-600 dark:bg-lime-400/20 dark:text-lime-400 border border-lime-400/20">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white font-mono">
            Rp {stats.totalRevenue.toLocaleString("id-ID")}
          </h3>

          <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-50 px-1.5 py-0.5 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
              <ArrowUpRight className="h-3.5 w-3.5" />
              {stats.revenueGrowth}
            </span>
            <span className="text-[11px] text-gray-400 font-normal">vs periode sebelumnya</span>
          </div>
        </div>
      </div>

      {/* 2. TOTAL BOOKING */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900 transition hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Total Pemesanan
          </span>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-500/20">
            <CalendarCheck className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white font-mono">
            {stats.totalBookings} <span className="text-xs font-normal text-gray-400">Pemesanan</span>
          </h3>

          <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <span className="inline-flex items-center gap-0.5 rounded-md bg-blue-50 px-1.5 py-0.5 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800">
              <ArrowUpRight className="h-3.5 w-3.5" />
              {stats.bookingGrowth}
            </span>
            <span className="text-[11px] text-gray-400 font-normal">terkonfirmasi lunas</span>
          </div>
        </div>
      </div>

      {/* 3. RATA-RATA TRANSAKSI (AOV) */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900 transition hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Rata-rata Transaksi
          </span>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 border border-purple-500/20">
            <Receipt className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white font-mono">
            Rp {Math.round(stats.avgTransaction).toLocaleString("id-ID")}
          </h3>

          <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
            <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
              Per sesi pemesanan
            </span>
          </div>
        </div>
      </div>

      {/* 4. LAPANGAN TERFAVORIT */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900 transition hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Lapangan Populer
          </span>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-500/20">
            <Award className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-base font-bold tracking-tight text-gray-900 dark:text-white truncate">
            {stats.topField}
          </h3>

          <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-semibold">
            <span className="inline-flex items-center rounded-md bg-amber-50 px-1.5 py-0.5 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800">
              {stats.topFieldCount} kali disewa
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
