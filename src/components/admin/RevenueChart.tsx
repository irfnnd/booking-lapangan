"use client";

import React, { useState } from "react";
import { TrendingUp, Calendar, DollarSign } from "lucide-react";

interface DayData {
  day: string;
  amount: number;
  heightPercent: number;
}

const weeklyData: DayData[] = [
  { day: "Sen", amount: 450000, heightPercent: 45 },
  { day: "Sel", amount: 620000, heightPercent: 62 },
  { day: "Rab", amount: 500000, heightPercent: 50 },
  { day: "Kam", amount: 780000, heightPercent: 78 },
  { day: "Jum", amount: 950000, heightPercent: 95 },
  { day: "Sab", amount: 1200000, heightPercent: 100 },
  { day: "Ming", amount: 1100000, heightPercent: 90 },
];

const categoryUsage = [
  { name: "Futsal", percent: 85, color: "bg-lime-400" },
  { name: "Badminton", percent: 70, color: "bg-emerald-400" },
  { name: "Basketball", percent: 55, color: "bg-blue-400" },
  { name: "Mini Soccer", percent: 90, color: "bg-purple-400" },
  { name: "Tenis", percent: 40, color: "bg-amber-400" },
];

export default function RevenueChart() {
  const [hoveredDay, setHoveredDay] = useState<DayData | null>(null);

  const totalWeekly = weeklyData.reduce((acc, curr) => acc + curr.amount, 0);

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
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <TrendingUp className="h-3 w-3" /> +14.2%
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
          {weeklyData.map((item) => (
            <div
              key={item.day}
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
                  style={{ height: `${item.heightPercent}%` }}
                  className="w-full rounded-t-lg bg-gradient-to-t from-lime-500 to-lime-300 transition-all duration-300 group-hover:from-lime-400 group-hover:to-lime-200"
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
            Persentase jam terisi per kategori olahraga.
          </p>

          <div className="mt-6 space-y-4">
            {categoryUsage.map((cat) => (
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
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-lime-50 p-3.5 text-xs text-lime-900 dark:bg-lime-950/40 dark:text-lime-300 border border-lime-200 dark:border-lime-900/50 flex items-center gap-3">
          <DollarSign className="h-5 w-5 shrink-0 text-lime-600 dark:text-lime-400" />
          <p>
            Lapangan <strong>Mini Soccer</strong> paling diminati minggu ini dengan okupansi 90%.
          </p>
        </div>
      </div>
    </div>
  );
}
