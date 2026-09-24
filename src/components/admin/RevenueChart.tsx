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
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
  {/* GRAFIK PENDAPATAN */}
  <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900 lg:col-span-2">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-base font-bold text-gray-900 dark:text-white">
          Grafik Pendapatan
        </h3>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
          Pendapatan 7 hari terakhir
        </p>
      </div>

      <div className="rounded-xl bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
        7 Hari
      </div>
    </div>

    {/* BAR CHART */}
    <div className="mt-8 flex h-56 items-end gap-2 border-b border-gray-100 pb-3 sm:gap-4 dark:border-gray-800">
      {weeklyData.map((item, idx) => (
        <div
          key={`${item.day}-${idx}`}
          className="group relative flex h-full flex-1 flex-col items-center justify-end"
          onMouseEnter={() => setHoveredDay(item)}
          onMouseLeave={() => setHoveredDay(null)}
        >
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 z-20 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-2.5 py-1.5 text-[10px] font-bold text-white shadow-lg group-hover:block dark:bg-gray-700">
            Rp {item.amount.toLocaleString("id-ID")}
          </div>

          {/* Bar Area */}
          <div className="flex h-full w-full items-end justify-center">
            <div
              className={`w-full max-w-12 rounded-t-lg transition-all duration-500 ${
                item.amount > 0
                  ? "bg-gradient-to-t from-lime-500 to-lime-300 group-hover:from-lime-400 group-hover:to-lime-200"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
              style={{
                height:
                  item.heightPercent > 0
                    ? `${item.heightPercent}%`
                    : "4px",
              }}
            />
          </div>

          {/* Day */}
          <span className="mt-2 shrink-0 text-xs font-medium text-gray-500 transition-colors group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white">
            {item.day}
          </span>
        </div>
      ))}
    </div>
  </div>

  {/* TINGKAT OKUPANSI */}
  <div className="flex flex-col justify-between rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900">
    <div>
      <h3 className="text-base font-bold text-gray-900 dark:text-white">
        Tingkat Okupansi Lapangan
      </h3>

      <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
        Persentase booking berdasarkan kategori olahraga
        dalam 7 hari terakhir.
      </p>

      <div className="mt-6 space-y-5">
        {categoryUsage.length > 0 ? (
          categoryUsage.map((cat) => (
            <div key={cat.name} className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-gray-700 dark:text-gray-300">
                  {cat.name}
                </span>

                <span className="text-gray-900 dark:text-white">
                  {cat.percent}%
                </span>
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
          <p className="text-xs text-gray-400">
            Belum ada data booking minggu ini.
          </p>
        )}
      </div>
    </div>

    {/* TOP CATEGORY */}
    {topCategory !== "—" && (
      <div className="mt-8 flex items-start gap-3 rounded-xl border border-lime-200 bg-lime-50 p-4 text-xs text-lime-900 dark:border-lime-900/50 dark:bg-lime-950/40 dark:text-lime-300">
        <DollarSign className="mt-0.5 h-5 w-5 shrink-0 text-lime-600 dark:text-lime-400" />

        <p className="leading-5">
          Lapangan{" "}
          <strong className="font-bold">{topCategory}</strong>{" "}
          paling diminati dengan okupansi{" "}
          <strong className="font-bold">
            {topCategoryPercent}%
          </strong>
          .
        </p>
      </div>
    )}
  </div>
</div>

  );
}
