"use client";

import React, { useEffect, useState } from "react";
import {
  DollarSign,
  CalendarCheck,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from "lucide-react";

interface SummaryStats {
  totalRevenue: number;
  totalBookings: number;
  revenueGrowth: string;
  isGrowthPositive: boolean;
  bookingGrowth: string;
  isBookingGrowthPositive: boolean;
}

interface ReportSummaryCardsProps {
  period: string;
  refreshKey?: number;
}

function SkeletonCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-3 w-32 rounded-md bg-gray-200 dark:bg-gray-700" />
        <div className="h-10 w-10 rounded-xl bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-7 w-40 rounded-md bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-24 rounded-md bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  );
}

export default function ReportSummaryCards({ period, refreshKey }: ReportSummaryCardsProps) {
  const [stats, setStats] = useState<SummaryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/admin/laporan?period=${period}&type=all`)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat data ringkasan.");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          setStats(data.summary);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message ?? "Terjadi kesalahan.");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [period, refreshKey]);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
        {error ?? "Data tidak tersedia."}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* 1. TOTAL PENDAPATAN */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900 transition hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Total Pendapatan
          </span>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400/10 text-lime-600 dark:bg-lime-400/20 dark:text-lime-400 border border-lime-400/20">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white font-mono">
            Rp {stats.totalRevenue.toLocaleString("id-ID")}
          </h3>

          <div
            className={`mt-2 flex items-center gap-1.5 text-xs font-semibold ${stats.isGrowthPositive
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-500 dark:text-red-400"
              }`}
          >
            <span
              className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 border ${stats.isGrowthPositive
                  ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/60 dark:border-emerald-800"
                  : "bg-red-50 border-red-200 dark:bg-red-950/60 dark:border-red-800"
                }`}
            >
              {stats.isGrowthPositive ? (
                <ArrowUpRight className="h-3.5 w-3.5" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5" />
              )}
              {stats.revenueGrowth}
            </span>
            <span className="text-[11px] text-gray-400 font-normal">vs periode sebelumnya</span>
          </div>
        </div>
      </div>

      {/* 2. TOTAL BOOKING */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900 transition hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Total Pemesanan
          </span>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-500/20">
            <CalendarCheck className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white font-mono">
            {stats.totalBookings}{" "}
            <span className="text-sm font-normal text-gray-400">Pemesanan</span>
          </h3>

          <div
            className={`mt-2 flex items-center gap-1.5 text-xs font-semibold ${stats.isBookingGrowthPositive
                ? "text-blue-600 dark:text-blue-400"
                : "text-red-500 dark:text-red-400"
              }`}
          >
            <span
              className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 border ${stats.isBookingGrowthPositive
                  ? "bg-blue-50 border-blue-200 dark:bg-blue-950/60 dark:border-blue-800"
                  : "bg-red-50 border-red-200 dark:bg-red-950/60 dark:border-red-800"
                }`}
            >
              {stats.isBookingGrowthPositive ? (
                <ArrowUpRight className="h-3.5 w-3.5" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5" />
              )}
              {stats.bookingGrowth}
            </span>
            <span className="text-[11px] text-gray-400 font-normal">vs periode sebelumnya</span>
          </div>
        </div>
      </div>
    </div>
  );
}
