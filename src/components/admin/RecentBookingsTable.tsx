"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  Check,
  X,
  Eye,
  Calendar,
  Clock,
  MoreVertical,
  ChevronRight,
} from "lucide-react";
import BookingStatusBadge, { BookingStatus } from "./BookingStatusBadge";

export interface BookingRecord {
  id: string;
  invoiceNo: string;
  customerName: string;
  customerEmail: string;
  lapanganName: string;
  date: string;
  timeSlot: string;
  totalPrice: number;
  status: BookingStatus;
}

const mockBookings: BookingRecord[] = [
  {
    id: "b1",
    invoiceNo: "INV-202609-001",
    customerName: "Budi Santoso",
    customerEmail: "budi.santoso@gmail.com",
    lapanganName: "Lapangan Futsal Vinyl A",
    date: "22 Sep 2026",
    timeSlot: "16:00 - 18:00 (2 Jam)",
    totalPrice: 240000,
    status: "PENDING",
  },
  {
    id: "b2",
    invoiceNo: "INV-202609-002",
    customerName: "Rian Pratama",
    customerEmail: "rian.pratama@yahoo.com",
    lapanganName: "Lapangan Badminton Synthetics 1",
    date: "22 Sep 2026",
    timeSlot: "19:00 - 21:00 (2 Jam)",
    totalPrice: 160000,
    status: "CONFIRMED",
  },
  {
    id: "b3",
    invoiceNo: "INV-202609-003",
    customerName: "Siti Rahmawati",
    customerEmail: "siti.rahma@gmail.com",
    lapanganName: "Lapangan Basket Interlock B",
    date: "23 Sep 2026",
    timeSlot: "14:00 - 16:00 (2 Jam)",
    totalPrice: 300000,
    status: "CONFIRMED",
  },
  {
    id: "b4",
    invoiceNo: "INV-202609-004",
    customerName: "Deni Kurniawan",
    customerEmail: "deni.kurnia@gmail.com",
    lapanganName: "Lapangan Mini Soccer Rumput Sintetis",
    date: "24 Sep 2026",
    timeSlot: "20:00 - 22:00 (2 Jam)",
    totalPrice: 500000,
    status: "PENDING",
  },
  {
    id: "b5",
    invoiceNo: "INV-202609-005",
    customerName: "Eko Prasetyo",
    customerEmail: "eko.prasetyo@outlook.com",
    lapanganName: "Lapangan Tenis Outdoor",
    date: "21 Sep 2026",
    timeSlot: "08:00 - 10:00 (2 Jam)",
    totalPrice: 200000,
    status: "CANCELLED",
  },
];

interface RecentBookingsTableProps {
  initialBookings?: BookingRecord[];
  limit?: number;
}

export default function RecentBookingsTable({
  initialBookings = mockBookings,
  limit,
}: RecentBookingsTableProps) {
  const [bookings, setBookings] = useState<BookingRecord[]>(initialBookings);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | "PENDING" | "CONFIRMED" | "CANCELLED">("ALL");
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);

  const handleStatusChange = (id: string, newStatus: BookingStatus) => {
    setBookings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.lapanganName.toLowerCase().includes(search.toLowerCase());

    const matchesTab = activeTab === "ALL" || b.status.toUpperCase() === activeTab;

    return matchesSearch && matchesTab;
  });

  const displayedBookings = limit ? filteredBookings.slice(0, limit) : filteredBookings;

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white shadow-xs dark:border-gray-800 dark:bg-gray-900">
      {/* HEADER & FILTER BAR */}
      <div className="flex flex-col gap-4 border-b border-gray-100 p-5 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Daftar Transaksi Booking
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Kelola dan konfirmasi status booking pelanggan.
          </p>
        </div>

        {/* TABS & SEARCH */}
        <div className="flex flex-wrap items-center gap-3">
          {/* TAB BUTTONS */}
          <div className="flex rounded-xl bg-gray-100 p-1 dark:bg-gray-800 text-xs font-semibold">
            {(["ALL", "PENDING", "CONFIRMED", "CANCELLED"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-3 py-1.5 transition ${
                  activeTab === tab
                    ? "bg-white text-gray-900 shadow-xs dark:bg-gray-900 dark:text-white"
                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                {tab === "ALL" ? "Semua" : tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* SEARCH INPUT */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari invoice/pelanggan..."
              className="w-44 rounded-xl border border-gray-200 bg-white pl-8 pr-3 py-1.5 text-xs text-gray-900 outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white sm:w-56"
            />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-gray-100 bg-gray-50/50 text-gray-500 uppercase tracking-wider dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400 font-semibold">
            <tr>
              <th className="px-5 py-3.5">No Invoice</th>
              <th className="px-5 py-3.5">Pelanggan</th>
              <th className="px-5 py-3.5">Lapangan</th>
              <th className="px-5 py-3.5">Jadwal Main</th>
              <th className="px-5 py-3.5">Total Harga</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {displayedBookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-gray-400">
                  Tidak ada data booking yang sesuai filter.
                </td>
              </tr>
            ) : (
              displayedBookings.map((b) => (
                <tr
                  key={b.id}
                  className="group hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition"
                >
                  <td className="px-5 py-4 font-mono font-bold text-gray-900 dark:text-white">
                    {b.invoiceNo}
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-bold text-gray-900 dark:text-white">{b.customerName}</p>
                    <p className="text-[11px] text-gray-400">{b.customerEmail}</p>
                  </td>

                  <td className="px-5 py-4 font-medium text-gray-800 dark:text-gray-200">
                    {b.lapanganName}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 font-medium">
                      <Calendar className="h-3.5 w-3.5 text-gray-400" />
                      {b.date}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-0.5">
                      <Clock className="h-3 w-3 text-gray-400" />
                      {b.timeSlot}
                    </div>
                  </td>

                  <td className="px-5 py-4 font-bold text-gray-900 dark:text-white">
                    Rp {b.totalPrice.toLocaleString("id-ID")}
                  </td>

                  <td className="px-5 py-4">
                    <BookingStatusBadge status={b.status} size="sm" />
                  </td>

                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {b.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => handleStatusChange(b.id, "CONFIRMED")}
                            title="Konfirmasi Booking"
                            className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400 transition"
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span>Setuju</span>
                          </button>

                          <button
                            onClick={() => handleStatusChange(b.id, "CANCELLED")}
                            title="Batalkan Booking"
                            className="flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1 font-semibold text-rose-700 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-400 transition"
                          >
                            <X className="h-3.5 w-3.5" />
                            <span>Tolak</span>
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => setSelectedBooking(b)}
                        title="Lihat Detail"
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-white transition"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* DETAIL MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Detail Booking
              </h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">Invoice:</span>
                <span className="font-mono font-bold text-gray-900 dark:text-white">
                  {selectedBooking.invoiceNo}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">Pelanggan:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {selectedBooking.customerName} ({selectedBooking.customerEmail})
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">Lapangan:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {selectedBooking.lapanganName}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">Jadwal:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {selectedBooking.date} | {selectedBooking.timeSlot}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">Status Saat Ini:</span>
                <BookingStatusBadge status={selectedBooking.status} size="sm" />
              </div>
              <div className="flex justify-between py-2 text-sm font-bold text-gray-900 dark:text-white">
                <span>Total Bayar:</span>
                <span className="text-lime-600 dark:text-lime-400">
                  Rp {selectedBooking.totalPrice.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setSelectedBooking(null)}
                className="rounded-xl bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
