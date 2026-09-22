"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Users,
  UserCheck,
  UserPlus,
  UserX,
  Eye,
  MoreHorizontal,
  CalendarDays,
  Wallet,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type UserStatus = "Aktif" | "Tidak Aktif" | "Diblokir";

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  registeredAt: string;
  lastActivity: string;
  totalBooking: number;
  totalTransaction: number;
  status: UserStatus;
};

const users: User[] = [
  {
    id: 1,
    name: "Andi Pratama",
    email: "andi.pratama@gmail.com",
    phone: "0812-3456-7890",
    registeredAt: "02 Sep 2026",
    lastActivity: "22 Sep 2026, 13:42",
    totalBooking: 12,
    totalTransaction: 1850000,
    status: "Aktif",
  },
  {
    id: 2,
    name: "Rizky Maulana",
    email: "rizky.maulana@gmail.com",
    phone: "0813-7788-9900",
    registeredAt: "05 Sep 2026",
    lastActivity: "22 Sep 2026, 11:20",
    totalBooking: 8,
    totalTransaction: 1200000,
    status: "Aktif",
  },
  {
    id: 3,
    name: "Fajar Ramadhan",
    email: "fajar.ramadhan@gmail.com",
    phone: "0852-1122-3344",
    registeredAt: "08 Sep 2026",
    lastActivity: "21 Sep 2026, 20:15",
    totalBooking: 5,
    totalTransaction: 750000,
    status: "Aktif",
  },
  {
    id: 4,
    name: "Dimas Saputra",
    email: "dimas.saputra@gmail.com",
    phone: "0821-5566-7788",
    registeredAt: "10 Sep 2026",
    lastActivity: "18 Sep 2026, 16:30",
    totalBooking: 3,
    totalTransaction: 450000,
    status: "Tidak Aktif",
  },
  {
    id: 5,
    name: "Bagus Setiawan",
    email: "bagus.setiawan@gmail.com",
    phone: "0811-2233-4455",
    registeredAt: "12 Sep 2026",
    lastActivity: "22 Sep 2026, 09:12",
    totalBooking: 9,
    totalTransaction: 1350000,
    status: "Aktif",
  },
  {
    id: 6,
    name: "Yoga Firmansyah",
    email: "yoga.firmansyah@gmail.com",
    phone: "0853-9988-7766",
    registeredAt: "14 Sep 2026",
    lastActivity: "17 Sep 2026, 14:10",
    totalBooking: 2,
    totalTransaction: 300000,
    status: "Diblokir",
  },
  {
    id: 7,
    name: "Ilham Akbar",
    email: "ilham.akbar@gmail.com",
    phone: "0822-6677-8899",
    registeredAt: "16 Sep 2026",
    lastActivity: "21 Sep 2026, 19:40",
    totalBooking: 6,
    totalTransaction: 900000,
    status: "Aktif",
  },
  {
    id: 8,
    name: "Reza Kurniawan",
    email: "reza.kurniawan@gmail.com",
    phone: "0819-4455-6677",
    registeredAt: "18 Sep 2026",
    lastActivity: "20 Sep 2026, 10:25",
    totalBooking: 4,
    totalTransaction: 600000,
    status: "Aktif",
  },
];

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "Semua" | UserStatus
  >("Semua");

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        user.name.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword) ||
        user.phone.includes(keyword);

      const matchesStatus =
        statusFilter === "Semua" || user.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "Aktif").length;
  const inactiveUsers = users.filter(
    (u) => u.status === "Tidak Aktif"
  ).length;
  const blockedUsers = users.filter(
    (u) => u.status === "Diblokir"
  ).length;

  return (
    <div className="space-y-8">

      {/* USER TABLE */}
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        {/* TABLE HEADER */}
        <div className="border-b border-gray-100 p-5 dark:border-gray-800 sm:p-6">
          <div className="mb-5">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Daftar Pengguna
            </h2>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Kelola dan pantau seluruh pengguna yang terdaftar.
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* SEARCH */}
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama, email, atau nomor HP..."
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none transition focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
              />
            </div>

            {/* FILTER */}
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as "Semua" | UserStatus
                )
              }
              className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm font-medium text-gray-700 outline-none focus:border-lime-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="Semua">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Tidak Aktif">Tidak Aktif</option>
              <option value="Diblokir">Diblokir</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                <th className="px-6 py-4">Pengguna</th>
                <th className="px-6 py-4">Kontak</th>
                <th className="px-6 py-4">Terdaftar</th>
                <th className="px-6 py-4">Aktivitas Terakhir</th>
                <th className="px-6 py-4">Booking</th>
                <th className="px-6 py-4">Transaksi</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="transition hover:bg-gray-50/80 dark:hover:bg-gray-800/40"
                >
                  {/* USER */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-xs font-black text-lime-400 dark:bg-gray-800">
                        {getInitials(user.name)}
                      </div>

                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          {user.name}
                        </p>

                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          ID #{String(user.id).padStart(4, "0")}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* CONTACT */}
                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                        <Mail className="h-3.5 w-3.5 text-gray-400" />
                        {user.email}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Phone className="h-3.5 w-3.5 text-gray-400" />
                        {user.phone}
                      </div>
                    </div>
                  </td>

                  {/* REGISTERED */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                      <CalendarDays className="h-3.5 w-3.5 text-gray-400" />
                      {user.registeredAt}
                    </div>
                  </td>

                  {/* LAST ACTIVITY */}
                  <td className="px-6 py-5">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {user.lastActivity}
                    </p>
                  </td>

                  {/* BOOKING */}
                  <td className="px-6 py-5">
                    <span className="inline-flex rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                      {user.totalBooking}x
                    </span>
                  </td>

                  {/* TRANSACTION */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 dark:text-gray-200">
                      <Wallet className="h-3.5 w-3.5 text-gray-400" />
                      {formatRupiah(user.totalTransaction)}
                    </div>
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-5">
                    <StatusBadge status={user.status} />
                  </td>

                  {/* ACTION */}
                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-2">
                      <button
                        title="Lihat detail"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-lime-400 hover:bg-lime-50 hover:text-lime-700 dark:border-gray-700 dark:hover:bg-lime-400/10 dark:hover:text-lime-400"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      <button
                        title="Menu"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-14 text-center">
                    <Users className="mx-auto mb-3 h-8 w-8 text-gray-300" />

                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                      Pengguna tidak ditemukan
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Coba gunakan kata kunci atau filter yang berbeda.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4 dark:border-gray-800 sm:px-6">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Menampilkan{" "}
            <span className="font-bold text-gray-700 dark:text-gray-200">
              {filteredUsers.length}
            </span>{" "}
            dari{" "}
            <span className="font-bold text-gray-700 dark:text-gray-200">
              {totalUsers}
            </span>{" "}
            pengguna
          </p>

          <div className="flex gap-2">
            <button
              disabled
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 disabled:opacity-50 dark:border-gray-700"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-xs font-bold text-white dark:bg-lime-400 dark:text-gray-950">
              1
            </button>

            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 dark:border-gray-700">
              2
            </button>

            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 dark:border-gray-700">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================
   STAT CARD
========================= */

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClass,
}: {
  title: string;
  value: number | string;
  subtitle: string;
  icon: React.ElementType;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>

          <p className="mt-2 text-2xl font-black tracking-tight text-gray-900 dark:text-white">
            {value}
          </p>

          <p className="mt-1 text-[11px] text-gray-400">
            {subtitle}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

/* =========================
   STATUS BADGE
========================= */

function StatusBadge({ status }: { status: UserStatus }) {
  const styles = {
    Aktif:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    "Tidak Aktif":
      "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    Diblokir:
      "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${styles[status]}`}
    >
      <span className="mr-1.5">●</span>
      {status}
    </span>
  );
}