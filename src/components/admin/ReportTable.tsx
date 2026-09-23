"use client";

import React, { useState, useCallback, forwardRef, useImperativeHandle, useEffect } from "react";
import {
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Printer,
  Loader2,
} from "lucide-react";
import { exportReportToPdf } from "@/utils/exportReportPdf";

export interface TransactionReportItem {
  id: string;
  bookingCode: string;
  customerName: string;
  customerEmail: string;
  lapanganName: string;
  category: string;
  date: string;
  timeSlot: string;
  amount: number;
  paymentMethod: string;
  status: "CONFIRMED" | "PENDING" | "CANCELLED";
}

export interface ReportTableRef {
  exportPdf: () => void;
}

interface ReportTableProps {
  period?: "today" | "week" | "month" | "year";
  refreshKey?: number;
}

const ReportTable = forwardRef<ReportTableRef, ReportTableProps>(
  ({ period = "month", refreshKey }, ref) => {
    const [allData, setAllData] = useState<TransactionReportItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [isExporting, setIsExporting] = useState(false);

    // Derive unique categories from real data
    const categories = Array.from(new Set(allData.map((d) => d.category))).sort();

    useEffect(() => {
      let cancelled = false;
      setLoading(true);
      setError(null);

      fetch(`/api/admin/laporan?period=${period}&type=all`)
        .then((res) => {
          if (!res.ok) throw new Error("Gagal memuat data transaksi.");
          return res.json();
        })
        .then((data) => {
          if (!cancelled) {
            setAllData(data.transactions ?? []);
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

    const filteredData = allData.filter((item) => {
      const matchesSearch =
        item.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.lapanganName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "ALL" || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    const totalFilteredAmount = filteredData.reduce((acc, curr) => acc + curr.amount, 0);

    const getPeriodLabel = (p: string) => {
      switch (p) {
        case "today": return "Hari Ini";
        case "week": return "7 Hari Terakhir";
        case "month": return "Bulan Ini";
        case "year": return "Tahun Ini";
        default: return "Bulan Ini";
      }
    };

    const getCategoryLabel = (c: string) => (c === "ALL" ? "Semua Kategori" : c);

    const handleExportPDF = useCallback(() => {
      setIsExporting(true);
      setTimeout(() => {
        exportReportToPdf({
          items: filteredData,
          periodLabel: getPeriodLabel(period),
          categoryLabel: getCategoryLabel(selectedCategory),
          searchTerm: searchTerm.trim(),
        });
        setIsExporting(false);
      }, 150);
    }, [filteredData, period, selectedCategory, searchTerm]);

    useImperativeHandle(ref, () => ({ exportPdf: handleExportPDF }), [handleExportPDF]);

    return (
      <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900 space-y-5">
        {/* HEADER & CONTROLS */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Detail Transaksi Keuangan
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Daftar lengkap rincian pembayaran booking yang tercatat di sistem.
            </p>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="grid gap-3 sm:grid-cols-2 print:hidden">
          {/* SEARCH */}
          <div className="relative sm:col-span-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari kode, nama, atau lapangan..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50/80 pl-9 pr-4 py-2 text-xs text-gray-900 outline-none transition focus:border-lime-500 focus:bg-white focus:ring-2 focus:ring-lime-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-lime-400"
            />
          </div>

          {/* CATEGORY FILTER (dynamic from real data) */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-gray-500 shrink-0">Olahraga:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/80 px-3 py-2 text-xs text-gray-900 outline-none transition focus:border-lime-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="ALL">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* TABLE AREA */}
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400 gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-lime-500" />
            <span className="text-sm">Memuat data transaksi...</span>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
            <table className="w-full text-left text-xs text-gray-600 dark:text-gray-300">
              <thead className="bg-gray-50 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:bg-gray-800/50 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="px-4 py-3.5">Kode Booking</th>
                  <th className="px-4 py-3.5">Pelanggan</th>
                  <th className="px-4 py-3.5">Lapangan</th>
                  <th className="px-4 py-3.5">Tanggal &amp; Sesi</th>
                  <th className="px-4 py-3.5 text-right">Nominal</th>
                  <th className="px-4 py-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 font-medium">
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition"
                    >
                      <td className="px-4 py-3 font-bold font-mono text-gray-900 dark:text-white">
                        {item.bookingCode}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {item.customerName}
                        </div>
                        <div className="text-[10px] text-gray-400">{item.customerEmail}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-800 dark:text-gray-200">
                        <div>{item.lapanganName}</div>
                        <div className="text-[10px] text-gray-400">{item.category}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div>{item.date}</div>
                        <div className="text-[10px] text-gray-400">{item.timeSlot}</div>
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-gray-900 dark:text-white">
                        Rp {item.amount.toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {item.status === "CONFIRMED" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 className="h-3 w-3" />
                            Lunas
                          </span>
                        )}
                        {item.status === "PENDING" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                            <Clock className="h-3 w-3" />
                            Pending
                          </span>
                        )}
                        {item.status === "CANCELLED" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-bold text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                            <XCircle className="h-3 w-3" />
                            Batal
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-xs text-gray-400"
                    >
                      {allData.length === 0
                        ? "Tidak ada data transaksi untuk periode ini."
                        : "Tidak ada transaksi yang cocok dengan filter yang dipilih."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* FOOTER SUMMARY */}
        {!loading && !error && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-gray-100 dark:border-gray-800 text-xs">
            <span className="text-gray-500">
              Menampilkan{" "}
              <strong className="text-gray-900 dark:text-white">{filteredData.length}</strong>{" "}
              transaksi dari total {allData.length}
            </span>
            <div className="flex items-center gap-2 font-semibold">
              <span className="text-gray-500">Subtotal Lunas Terpilih:</span>
              <span className="text-base font-black font-mono text-lime-600 dark:text-lime-400">
                Rp {totalFilteredAmount.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }
);

ReportTable.displayName = "ReportTable";

export default ReportTable;
