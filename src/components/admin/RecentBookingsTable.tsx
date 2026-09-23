"use client";
import React, { useEffect, useState } from "react";
import {
  Search,
  Download,
  Check,
  X,
  Eye,
  Calendar,
  Clock,
} from "lucide-react";
import BookingStatusBadge, {
  BookingStatus,
} from "./BookingStatusBadge";

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

interface RecentBookingsTableProps {
  initialBookings?: BookingRecord[];
  limit?: number;
}

type AdminBooking = {
  id: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  customer: {
    name: string | null;
    email: string;
  };
  lapangan: {
    name: string;
    price: number;
  };
  payments: {
    status: string;
    amount: number;
  }[];
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

const formatTime = (value: string) =>
  new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));

const toBookingRecord = (
  booking: AdminBooking,
): BookingRecord => {
  const start = new Date(booking.startTime);
  const end = new Date(booking.endTime);

  const durationHours = Math.max(
    1,
    Math.ceil(
      (end.getTime() - start.getTime()) / 3600000,
    ),
  );

  const paidTotal = booking.payments.reduce(
    (total, payment) =>
      total +
      (payment.status === "PAID" ? payment.amount : 0),
    0,
  );

  return {
    id: booking.id,

    invoiceNo: `INV-${start.getFullYear()}${String(
      start.getMonth() + 1,
    ).padStart(2, "0")}-${booking.id
      .slice(0, 8)
      .toUpperCase()}`,

    customerName:
      booking.customer.name || "Tanpa nama",

    customerEmail: booking.customer.email,

    lapanganName: booking.lapangan.name,

    date: formatDate(booking.startTime),

    timeSlot: `${formatTime(
      booking.startTime,
    )} - ${formatTime(
      booking.endTime,
    )} (${durationHours} Jam)`,

    totalPrice:
      paidTotal ||
      durationHours * booking.lapangan.price,

    status: booking.status,
  };
};

export default function RecentBookingsTable({
  initialBookings = [],
  limit,
}: RecentBookingsTableProps) {
  const [bookings, setBookings] =
    useState<BookingRecord[]>(initialBookings);

  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState("");

  const [search, setSearch] = useState("");

  const [activeTab, setActiveTab] = useState<
    "ALL" | "PENDING" | "CONFIRMED" | "CANCELLED"
  >("ALL");

  const [selectedBooking, setSelectedBooking] =
    useState<BookingRecord | null>(null);

  const [updatingId, setUpdatingId] =
    useState<string | null>(null);

  const [actionError, setActionError] =
    useState("");

  const [actionSuccess, setActionSuccess] =
    useState("");

  /*
   * LOAD DATA BOOKING
   */
  useEffect(() => {
    async function loadBookings() {
      try {
        setLoading(true);

        const response = await fetch("/api/admin", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          const data = await response
            .json()
            .catch(() => null);

          setLoadError(
            data?.message ||
              "Data booking tidak dapat dimuat.",
          );

          return;
        }

        const data = await response.json();

        setBookings(
          (data.bookings as AdminBooking[]).map(
            toBookingRecord,
          ),
        );

        setLoadError("");
      } catch (error) {
        console.error(error);

        setLoadError(
          "Server tidak dapat dihubungi.",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadBookings();
  }, []);

  /*
   * UPDATE STATUS KE DATABASE
   */
  const handleStatusChange = async (
    id: string,
    newStatus: BookingStatus,
  ) => {
    if (updatingId) return;

    try {
      setUpdatingId(id);
      setActionError("");
      setActionSuccess("");

      const response = await fetch(
        `/api/admin/bookings/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        },
      );

      const data = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        console.error("STATUS API ERROR:", {
          httpStatus: response.status,
          responseData: data,
        });

        throw new Error(
          data?.message ||
            `Gagal mengubah status booking. HTTP ${response.status}`,
        );
      }

      /*
       * Update tampilan hanya setelah database
       * berhasil diperbarui.
       */
      setBookings((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: data.booking.status,
              }
            : item,
        ),
      );

      /*
       * Jika modal sedang terbuka untuk booking
       * yang sama, status modal ikut diperbarui.
       */
      setSelectedBooking((prev) =>
        prev?.id === id
          ? {
              ...prev,
              status: data.booking.status,
            }
          : prev,
      );

      setActionSuccess(
        newStatus === "CONFIRMED"
          ? "Booking berhasil dikonfirmasi."
          : "Booking berhasil dibatalkan.",
      );

      /*
       * Hilangkan pesan sukses setelah beberapa detik.
       */
      window.setTimeout(() => {
        setActionSuccess("");
      }, 3000);
    } catch (error) {
      console.error(
        "STATUS BOOKING ERROR:",
        error,
      );

      setActionError(
        error instanceof Error
          ? error.message
          : "Gagal mengubah status booking.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  /*
   * FILTER BOOKING
   */
  const filteredBookings = bookings.filter((b) => {
    const searchValue =
      search.toLowerCase();

    const matchesSearch =
      b.invoiceNo
        .toLowerCase()
        .includes(searchValue) ||
      b.customerName
        .toLowerCase()
        .includes(searchValue) ||
      b.lapanganName
        .toLowerCase()
        .includes(searchValue);

    const matchesTab =
      activeTab === "ALL" ||
      b.status.toUpperCase() === activeTab;

    return matchesSearch && matchesTab;
  });

  const displayedBookings = limit
    ? filteredBookings.slice(0, limit)
    : filteredBookings;

  /*
   * EXPORT CSV
   */
  const handleExport = () => {
    const headers = [
      "No Invoice",
      "Pelanggan",
      "Email",
      "Lapangan",
      "Tanggal",
      "Jadwal",
      "Total Harga",
      "Status",
    ];

    const escapeCsvValue = (
      value: string | number,
    ) =>
      `"${String(value).replaceAll(
        '"',
        '""',
      )}"`;

    const rows = displayedBookings.map(
      (booking) => [
        booking.invoiceNo,
        booking.customerName,
        booking.customerEmail,
        booking.lapanganName,
        booking.date,
        booking.timeSlot,
        booking.totalPrice,
        booking.status,
      ],
    );

    const csv = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map(escapeCsvValue)
          .join(","),
      )
      .join("\r\n");

    const blob = new Blob(
      [`\uFEFF${csv}`],
      {
        type: "text/csv;charset=utf-8;",
      },
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download = `booking-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-xs dark:border-gray-800 dark:bg-gray-900">
      {/* HEADER */}
      <div className="flex flex-col gap-4 border-b border-gray-100 p-5 dark:border-gray-800 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Daftar Transaksi Booking
          </h3>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Kelola dan konfirmasi status booking pelanggan.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* TAB */}
          <div className="flex w-fit rounded-xl bg-gray-100 p-1 text-xs font-semibold dark:bg-gray-800">
            {(
              [
                "ALL",
                "PENDING",
                "CONFIRMED",
                "CANCELLED",
              ] as const
            ).map((tab) => (
              <button
                key={tab}
                onClick={() =>
                  setActiveTab(tab)
                }
                className={`rounded-lg px-3 py-1.5 transition ${
                  activeTab === tab
                    ? "bg-white text-gray-900 shadow-xs dark:bg-gray-900 dark:text-white"
                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                {tab === "ALL"
                  ? "Semua"
                  : tab.charAt(0) +
                    tab
                      .slice(1)
                      .toLowerCase()}
              </button>
            ))}
          </div>

          {/* SEARCH */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Cari invoice/pelanggan..."
              className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-8 pr-3 text-xs text-gray-900 outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white sm:w-56"
            />
          </div>

          {/* EXPORT */}
          <button
            type="button"
            onClick={handleExport}
            disabled={
              displayedBookings.length === 0
            }
            title="Export data booking"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </button>
        </div>
      </div>

      {/* NOTIFICATION */}
      {actionSuccess && (
        <div className="mx-5 mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400">
          {actionSuccess}
        </div>
      )}

      {actionError && (
        <div className="mx-5 mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-400">
          {actionError}
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-xs">
          <thead className="border-b border-gray-100 bg-gray-50/50 text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
            <tr>
              <th className="w-32 px-5 py-3.5">
                No Invoice
              </th>

              <th className="w-52 px-5 py-3.5">
                Pelanggan
              </th>

              <th className="w-56 px-5 py-3.5">
                Lapangan
              </th>

              <th className="w-40 px-5 py-3.5">
                Jadwal Main
              </th>

              <th className="w-32 px-5 py-3.5">
                Total Harga
              </th>

              <th className="w-28 px-5 py-3.5">
                Status
              </th>

              <th className="w-28 px-5 py-3.5 text-right">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-8 text-center text-gray-400"
                >
                  Memuat data booking...
                </td>
              </tr>
            ) : loadError ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-8 text-center text-rose-500"
                >
                  {loadError}
                </td>
              </tr>
            ) : displayedBookings.length ===
              0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-8 text-center text-gray-400"
                >
                  Tidak ada data booking
                  yang sesuai filter.
                </td>
              </tr>
            ) : (
              displayedBookings.map((b) => (
                <tr
                  key={b.id}
                  className="group transition hover:bg-gray-50/60 dark:hover:bg-gray-800/40"
                >
                  <td className="px-5 py-4 align-top font-mono font-bold text-gray-900 dark:text-white">
                    {b.invoiceNo}
                  </td>

                  <td className="px-5 py-4 align-top">
                    <p className="font-bold text-gray-900 dark:text-white">
                      {b.customerName}
                    </p>

                    <p className="mt-1 text-[11px] text-gray-400">
                      {b.customerEmail}
                    </p>
                  </td>

                  <td className="px-5 py-4 align-top font-medium text-gray-800 dark:text-gray-200">
                    {b.lapanganName}
                  </td>

                  <td className="px-5 py-4 align-top">
                    <div className="flex items-center gap-1.5 whitespace-nowrap font-medium text-gray-700 dark:text-gray-300">
                      <Calendar className="h-3.5 w-3.5 text-gray-400" />
                      {b.date}
                    </div>

                    <div className="mt-1 flex items-center gap-1.5 whitespace-nowrap text-[11px] text-gray-400">
                      <Clock className="h-3 w-3 text-gray-400" />
                      {b.timeSlot}
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 align-top font-bold text-gray-900 dark:text-white">
                    Rp{" "}
                    {b.totalPrice.toLocaleString(
                      "id-ID",
                    )}
                  </td>

                  <td className="px-5 py-4 align-top">
                    <BookingStatusBadge
                      status={b.status}
                      size="sm"
                    />
                  </td>

                  <td className="px-5 py-4 align-top text-right">
                    <div className="flex items-center justify-end gap-1">
                      {b.status ===
                        "PENDING" && (
                        <>
                          {/* KONFIRMASI */}
                          <button
                            onClick={() =>
                              handleStatusChange(
                                b.id,
                                "CONFIRMED",
                              )
                            }
                            disabled={
                              updatingId === b.id
                            }
                            title="Konfirmasi Booking"
                            aria-label="Konfirmasi booking"
                            className="rounded-lg bg-emerald-50 p-2 text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-emerald-950/60 dark:text-emerald-400"
                          >
                            {updatingId ===
                            b.id ? (
                              <span className="block h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                          </button>

                          {/* BATALKAN */}
                          <button
                            onClick={() =>
                              handleStatusChange(
                                b.id,
                                "CANCELLED",
                              )
                            }
                            disabled={
                              updatingId === b.id
                            }
                            title="Batalkan Booking"
                            aria-label="Batalkan booking"
                            className="rounded-lg bg-rose-50 p-2 text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-rose-950/60 dark:text-rose-400"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}

                      {/* DETAIL */}
                      <button
                        onClick={() =>
                          setSelectedBooking(b)
                        }
                        title="Lihat Detail"
                        aria-label="Lihat detail booking"
                        className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-white"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Detail Booking
              </h3>

              <button
                onClick={() =>
                  setSelectedBooking(null)
                }
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between border-b border-gray-100 py-1 dark:border-gray-800">
                <span className="text-gray-500">
                  Invoice:
                </span>

                <span className="font-mono font-bold text-gray-900 dark:text-white">
                  {selectedBooking.invoiceNo}
                </span>
              </div>

              <div className="flex justify-between border-b border-gray-100 py-1 dark:border-gray-800">
                <span className="text-gray-500">
                  Pelanggan:
                </span>

                <span className="font-semibold text-gray-900 dark:text-white">
                  {selectedBooking.customerName}{" "}
                  ({selectedBooking.customerEmail})
                </span>
              </div>

              <div className="flex justify-between border-b border-gray-100 py-1 dark:border-gray-800">
                <span className="text-gray-500">
                  Lapangan:
                </span>

                <span className="font-semibold text-gray-900 dark:text-white">
                  {selectedBooking.lapanganName}
                </span>
              </div>

              <div className="flex justify-between border-b border-gray-100 py-1 dark:border-gray-800">
                <span className="text-gray-500">
                  Jadwal:
                </span>

                <span className="font-semibold text-gray-900 dark:text-white">
                  {selectedBooking.date}{" "}
                  | {selectedBooking.timeSlot}
                </span>
              </div>

              <div className="flex justify-between border-b border-gray-100 py-1 dark:border-gray-800">
                <span className="text-gray-500">
                  Status Saat Ini:
                </span>

                <BookingStatusBadge
                  status={
                    selectedBooking.status
                  }
                  size="sm"
                />
              </div>

              <div className="flex justify-between py-2 text-sm font-bold text-gray-900 dark:text-white">
                <span>Total Bayar:</span>

                <span className="text-lime-600 dark:text-lime-400">
                  Rp{" "}
                  {selectedBooking.totalPrice.toLocaleString(
                    "id-ID",
                  )}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() =>
                  setSelectedBooking(null)
                }
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

