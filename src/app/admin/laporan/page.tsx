"use client";

import React, { useState, useRef } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ReportSummaryCards from "@/components/admin/ReportSummaryCards";
import RevenueChart from "@/components/admin/RevenueChart";
import ReportTable, { ReportTableRef } from "@/components/admin/ReportTable";
import { Calendar, Download, Printer, Filter, RefreshCw } from "lucide-react";

export default function AdminLaporanPage() {
  const [period, setPeriod] = useState<"today" | "week" | "month" | "year">("month");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const reportTableRef = useRef<ReportTableRef>(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handlePrintPage = () => {
    reportTableRef.current?.exportPdf();
  };

  return (
    <div className="space-y-8 pb-10">
      {/* PAGE HEADER & CONTROLS */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <AdminPageHeader
          title="Laporan & Keuangan Admin"
          description="Pantau analisis pendapatan, tren statistik pemesanan, dan rincian transaksi laporan."
        />

        {/* PERIOD SELECTOR & ACTIONS */}
        <div className="flex flex-wrap items-center gap-2 print:hidden">
          {/* PERIOD FILTER BUTTONS */}
          <div className="flex items-center rounded-xl border border-gray-200 bg-white p-1 shadow-xs dark:border-gray-800 dark:bg-gray-900">
            <button
              onClick={() => setPeriod("today")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${period === "today"
                  ? "bg-lime-400 text-gray-950 font-bold shadow-xs"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                }`}
            >
              Hari Ini
            </button>
            <button
              onClick={() => setPeriod("week")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${period === "week"
                  ? "bg-lime-400 text-gray-950 font-bold shadow-xs"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                }`}
            >
              7 Hari Terakhir
            </button>
            <button
              onClick={() => setPeriod("month")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${period === "month"
                  ? "bg-lime-400 text-gray-950 font-bold shadow-xs"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                }`}
            >
              Bulan Ini
            </button>
            <button
              onClick={() => setPeriod("year")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${period === "year"
                  ? "bg-lime-400 text-gray-950 font-bold shadow-xs"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                }`}
            >
              Tahun Ini
            </button>
          </div>

          {/* PRINT PDF BUTTON */}
          <button
            onClick={handlePrintPage}
            className="inline-flex items-center gap-1.5 rounded-xl bg-lime-400 px-4 py-2 text-xs font-bold text-gray-950 shadow-xs hover:bg-lime-300 transition"
          >
            <Printer className="h-4 w-4" />
            <span>Cetak PDF</span>
          </button>
          <button
            onClick={handleRefresh}
            title="Refresh Data"
            className="rounded-xl border border-gray-200 bg-white p-2 text-gray-600 shadow-xs hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 transition"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin text-lime-500" : ""}`} />
          </button>

        </div>
      </div>

      {/* FINANCIAL SUMMARY METRIC CARDS */}
      <ReportSummaryCards period={period} />

      {/* DETAILED TRANSACTION REPORT TABLE */}
      <ReportTable ref={reportTableRef} period={period} />
    </div>
  );
}
