"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, Calendar, DollarSign, Loader2 } from "lucide-react";

interface DayData {
  day: string;
  amount: number;
  heightPercent: number;
}

interface CategoryUsage {
  name: string;
  percent: number;
  color: string;
}

interface ChartData {
  weeklyData: DayData[];
  totalWeekly: number;
  categoryUsage: CategoryUsage[];
  topCategory: string;
  topCategoryPercent: number;
}

interface RevenueChartProps {
  period?: "today" | "week" | "month" | "year";
  refreshKey?: number;
}

export default function RevenueChart({ period = "week", refreshKey }: RevenueChartProps) {
  const [hoveredDay, setHoveredDay] = useState<DayData | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = () => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/admin/laporan?period=${period}&type=all`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Gagal memuat data statistik grafik.");
        }
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          if (data && data.chart) {
            setChartData(data.chart);
          } else {
            setError("Data grafik tidak tersedia.");
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.message || "Terjadi kesalahan saat memuat grafik.");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  };

  useEffect(() => {
    return fetchData();
  }, [period, refreshKey]);

  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900 lg:col-span-2 flex items-center justify-center h-64">
          <Loader2 className="h-6 w-6 animate-spin text-lime-500" />
        </div>
        <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900 flex items-center justify-center h-64">
          <Loader2 className="h-6 w-6 animate-spin text-lime-500" />
        </div>
      </div>
    );
  }

  if (error || !chartData) {
    return (
      <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900 text-center py-10">
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
          {error || "Data grafik tidak dapat ditampilkan."}
        </p>
        <button
          onClick={fetchData}
          className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-lime-400 px-4 py-2 text-xs font-bold text-gray-950 shadow-xs hover:bg-lime-300 transition"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  const { weeklyData, totalWeekly, categoryUsage, topCategory, topCategoryPercent } = chartData;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* BAR CHART SECTION */}
      <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900 lg:col-span-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Grafik Pendapatan
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white font-mono mt-1">
              Rp {totalWeekly.toLocaleString("id-ID")}
            </h3>
            <p className="text-xs text-gray-400">Total pendapatan minggu ini</p>
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-500 font-medium bg-gray-100 dark:bg-gray-800 rounded-xl p-1.5 self-start sm:self-auto">
            <Calendar className="h-3.5 w-3.5 text-lime-500" />
            <span>7 Hari Terakhir</span>
          </div>
        </div>

        {/* VISUAL BARS */}
        <div className="mt-8 flex h-48 items-end gap-3 sm:gap-6 border-b border-gray-100 pb-3 dark:border-gray-800">
          {weeklyData.map((item, idx) => (
            <div
              key={`${item.day}-${idx}`}
              onMouseEnter={() => setHoveredDay(item)}
              onMouseLeave={() => setHoveredDay(null)}
              className="group relative flex flex-1 flex-col items-center gap-2"
            >
              {/* TOOLTIP ON HOVER */}
              <div className="absolute -top-10 hidden rounded-lg bg-gray-900 px-2 py-1 text-[10px] font-bold text-white shadow-lg group-hover:block dark:bg-gray-800 z-10 whitespace-nowrap">
                Rp {item.amount.toLocaleString("id-ID")}
              </div>

              {/* BAR */}
              <div className="w-full rounded-t-xl bg-gray-100 dark:bg-gray-800 h-full flex items-end overflow-hidden p-0.5">
                <div
                  style={{ height: item.heightPercent > 0 ? `${item.heightPercent}%` : "4px" }}
                  className={`w-full rounded-t-lg transition-all duration-300 ${
                    item.heightPercent > 0
                      ? "bg-gradient-to-t from-lime-500 to-lime-300 group-hover:from-lime-400 group-hover:to-lime-200"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                />
              </div>

              <span className="text-xs font-medium text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white">
                {item.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* FIELD OCCUPANCY RATE SECTION */}
      <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Tingkat Okupansi Lapangan
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Persentase booking per kategori olahraga (7 hari terakhir).
          </p>

          <div className="mt-6 space-y-4">
            {categoryUsage.length > 0 ? (
              categoryUsage.map((cat) => (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-700 dark:text-gray-300">{cat.name}</span>
                    <span className="text-gray-900 dark:text-white">{cat.percent}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      style={{ width: `${cat.percent}%` }}
                      className={`h-full rounded-full ${cat.color}`}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400">Belum ada data booking minggu ini.</p>
            )}
          </div>
        </div>

        {topCategory !== "—" && (
          <div className="mt-6 rounded-xl bg-lime-50 p-3.5 text-xs text-lime-900 dark:bg-lime-950/40 dark:text-lime-300 border border-lime-200 dark:border-lime-900/50 flex items-center gap-3">
            <DollarSign className="h-5 w-5 shrink-0 text-lime-600 dark:text-lime-400" />
            <p>
              Lapangan <strong>{topCategory}</strong> paling diminati minggu ini dengan okupansi{" "}
              {topCategoryPercent}%.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
