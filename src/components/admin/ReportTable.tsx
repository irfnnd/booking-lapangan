"use client";

import React, { useState, useCallback, forwardRef, useImperativeHandle } from "react";
import {
  Search,
  Filter,
  Download,
  Printer,
  CheckCircle2,
  Clock,
  XCircle,
  FileSpreadsheet,
  FileText,
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
}

const mockReportData: TransactionReportItem[] = [
  {
    id: "1",
    bookingCode: "BK-2026-001",
    customerName: "Budi Santoso",
    customerEmail: "budi@gmail.com",
    lapanganName: "Lapangan Futsal A (Vinyl)",
    category: "Futsal",
    date: "2026-09-22",
    timeSlot: "19:00 - 21:00",
    amount: 300000,
    paymentMethod: "QRIS",
    status: "CONFIRMED",
  },
  {
    id: "2",
    bookingCode: "BK-2026-002",
    customerName: "Siti Rahma",
    customerEmail: "siti@yahoo.com",
    lapanganName: "Lapangan Badminton 1",
    category: "Badminton",
    date: "2026-09-22",
    timeSlot: "16:00 - 18:00",
    amount: 160000,
    paymentMethod: "Transfer Bank BCA",
    status: "CONFIRMED",
  },
  {
    id: "3",
    bookingCode: "BK-2026-003",
    customerName: "Ahmad Dani",
    customerEmail: "ahmad.dani@outlook.com",
    lapanganName: "Lapangan Mini Soccer Sintetis",
    category: "Mini Soccer",
    date: "2026-09-21",
    timeSlot: "20:00 - 22:00",
    amount: 750000,
    paymentMethod: "Midtrans (Mandiri)",
    status: "CONFIRMED",
  },
  {
    id: "4",
    bookingCode: "BK-2026-004",
    customerName: "Rizky Pratama",
    customerEmail: "rizky@gmail.com",
    lapanganName: "Lapangan Basket Indoor",
    category: "Basketball",
    date: "2026-09-21",
    timeSlot: "15:00 - 17:00",
    amount: 250000,
    paymentMethod: "QRIS",
    status: "PENDING",
  },
  {
    id: "5",
    bookingCode: "BK-2026-005",
    customerName: "Dewa Putra",
    customerEmail: "dewa@gmail.com",
    lapanganName: "Lapangan Tenis Outdoor",
    category: "Tenis",
    date: "2026-09-20",
    timeSlot: "08:00 - 10:00",
    amount: 200000,
    paymentMethod: "Transfer Bank BNI",
    status: "CANCELLED",
  },
  {
    id: "6",
    bookingCode: "BK-2026-006",
    customerName: "Eko Wijaya",
    customerEmail: "eko.wijaya@gmail.com",
    lapanganName: "Lapangan Futsal B (Interlock)",
    category: "Futsal",
    date: "2026-09-20",
    timeSlot: "18:00 - 20:00",
    amount: 280000,
    paymentMethod: "QRIS",
    status: "CONFIRMED",
  },
  {
    id: "7",
    bookingCode: "BK-2026-007",
    customerName: "Fajar Nugraha",
    customerEmail: "fajar@hotmail.com",
    lapanganName: "Lapangan Badminton 2",
    category: "Badminton",
    date: "2026-09-19",
    timeSlot: "19:00 - 21:00",
    amount: 160000,
    paymentMethod: "Transfer Bank BCA",
    status: "CONFIRMED",
  },
];

const ReportTable = forwardRef<ReportTableRef, ReportTableProps>(
  ({ period = "month" }, ref) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("ALL");
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [isExporting, setIsExporting] = useState(false);

    const filteredData = mockReportData.filter((item) => {
      const matchesSearch =
        item.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.lapanganName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === "ALL" || item.status === selectedStatus;
      const matchesCategory =
        selectedCategory === "ALL" || item.category === selectedCategory;

      return matchesSearch && matchesStatus && matchesCategory;
    });

    const totalFilteredAmount = filteredData
      .filter((item) => item.status === "CONFIRMED")
      .reduce((acc, curr) => acc + curr.amount, 0);

    const getPeriodLabel = (p: string) => {
      switch (p) {
        case "today":
          return "Hari Ini";
        case "week":
          return "7 Hari Terakhir";
        case "month":
          return "Bulan Ini";
        case "year":
          return "Tahun Ini";
        default:
          return "Bulan Ini";
      }
    };

    const getStatusLabel = (s: string) => {
      switch (s) {
        case "CONFIRMED":
          return "Lunas (Confirmed)";
        case "PENDING":
          return "Menunggu (Pending)";
        case "CANCELLED":
          return "Batal (Cancelled)";
        default:
          return "Semua Status";
      }
    };

    const getCategoryLabel = (c: string) => {
      return c === "ALL" ? "Semua Kategori" : c;
    };

    const handleExportPDF = useCallback(() => {
      setIsExporting(true);
      setTimeout(() => {
        exportReportToPdf({
          items: filteredData,
          periodLabel: getPeriodLabel(period),
          statusLabel: getStatusLabel(selectedStatus),
          categoryLabel: getCategoryLabel(selectedCategory),
          searchTerm: searchTerm.trim(),
        });
        setIsExporting(false);
      }, 150);
    }, [filteredData, period, selectedStatus, selectedCategory, searchTerm]);

    useImperativeHandle(ref, () => ({
      exportPdf: handleExportPDF,
    }), [handleExportPDF]);

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

        {/* EXPORT & PRINT BUTTONS */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition disabled:opacity-50"
          >
            <Printer className={`h-4 w-4 ${isExporting ? "animate-spin text-lime-600" : ""}`} />
            <span>{isExporting ? "Membuka Preview..." : "Cetak PDF"}</span>
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="grid gap-3 sm:grid-cols-3 print:hidden">
        {/* SEARCH BAR */}
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

        {/* STATUS FILTER */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-500 shrink-0">Status:</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/80 px-3 py-2 text-xs text-gray-900 outline-none transition focus:border-lime-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="ALL">Semua Status</option>
            <option value="CONFIRMED">Lunas (Confirmed)</option>
            <option value="PENDING">Menunggu (Pending)</option>
            <option value="CANCELLED">Batal (Cancelled)</option>
          </select>
        </div>

        {/* CATEGORY FILTER */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-500 shrink-0">Olahraga:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/80 px-3 py-2 text-xs text-gray-900 outline-none transition focus:border-lime-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="ALL">Semua Kategori</option>
            <option value="Futsal">Futsal</option>
            <option value="Badminton">Badminton</option>
            <option value="Mini Soccer">Mini Soccer</option>
            <option value="Basketball">Basketball</option>
            <option value="Tenis">Tenis</option>
          </select>
        </div>
      </div>

      {/* TABLE DATA */}
      <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
        <table className="w-full text-left text-xs text-gray-600 dark:text-gray-300">
          <thead className="bg-gray-50 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:bg-gray-800/50 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
            <tr>
              <th className="px-4 py-3.5">Kode Booking</th>
              <th className="px-4 py-3.5">Pelanggan</th>
              <th className="px-4 py-3.5">Lapangan</th>
              <th className="px-4 py-3.5">Tanggal & Sesi</th>
              <th className="px-4 py-3.5">Metode Bayar</th>
              <th className="px-4 py-3.5 text-right">Nominal</th>
              <th className="px-4 py-3.5 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 font-medium">
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition">
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
                    {item.lapanganName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div>{item.date}</div>
                    <div className="text-[10px] text-gray-400">{item.timeSlot}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {item.paymentMethod}
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
                <td colSpan={7} className="px-4 py-8 text-center text-xs text-gray-400">
                  Tidak ada data transaksi laporan yang cocok dengan kriteria pencarian.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER TOTAL SUMMARY */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-gray-100 dark:border-gray-800 text-xs">
        <span className="text-gray-500">
          Menampilkan <strong className="text-gray-900 dark:text-white">{filteredData.length}</strong> transaksi dari total {mockReportData.length}
        </span>
        <div className="flex items-center gap-2 font-semibold">
          <span className="text-gray-500">Subtotal Lunas Terpilih:</span>
          <span className="text-base font-black font-mono text-lime-600 dark:text-lime-400">
            Rp {totalFilteredAmount.toLocaleString("id-ID")}
          </span>
        </div>
      </div>
    </div>
  );
});

ReportTable.displayName = "ReportTable";

export default ReportTable;
