"use client";

import React, { useState } from "react";
import { Search, Mail, Calendar, UserCheck, Shield, MoreVertical } from "lucide-react";

export interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  username: string;
  totalBookings: number;
  totalSpent: number;
  createdAt: string;
  status: "Aktif" | "Nonaktif";
}

const mockCustomers: CustomerRecord[] = [
  {
    id: "c1",
    name: "Budi Santoso",
    email: "budi.santoso@gmail.com",
    username: "budisantoso",
    totalBookings: 8,
    totalSpent: 960000,
    createdAt: "12 Jan 2026",
    status: "Aktif",
  },
  {
    id: "c2",
    name: "Rian Pratama",
    email: "rian.pratama@yahoo.com",
    username: "rianpratama",
    totalBookings: 12,
    totalSpent: 1440000,
    createdAt: "04 Feb 2026",
    status: "Aktif",
  },
  {
    id: "c3",
    name: "Siti Rahmawati",
    email: "siti.rahma@gmail.com",
    username: "sitirahma",
    totalBookings: 5,
    totalSpent: 750000,
    createdAt: "18 Mar 2026",
    status: "Aktif",
  },
  {
    id: "c4",
    name: "Deni Kurniawan",
    email: "deni.kurnia@gmail.com",
    username: "denikurnia",
    totalBookings: 2,
    totalSpent: 300000,
    createdAt: "01 Mei 2026",
    status: "Aktif",
  },
  {
    id: "c5",
    name: "Eko Prasetyo",
    email: "eko.prasetyo@outlook.com",
    username: "ekoprasetyo",
    totalBookings: 0,
    totalSpent: 0,
    createdAt: "15 Jun 2026",
    status: "Nonaktif",
  },
];

export default function CustomerTable() {
  const [customers, setCustomers] = useState<CustomerRecord[]>(mockCustomers);
  const [search, setSearch] = useState("");

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white shadow-xs dark:border-gray-800 dark:bg-gray-900">
      {/* HEADER & SEARCH */}
      <div className="flex flex-col gap-4 border-b border-gray-100 p-5 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Data Pelanggan Terdaftar
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Daftar seluruh akun customer dan riwayat aktivitas booking.
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, email, username..."
            className="w-full rounded-xl border border-gray-200 bg-white pl-9 pr-3 py-1.5 text-xs text-gray-900 outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white sm:w-64"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-gray-100 bg-gray-50/50 text-gray-500 uppercase tracking-wider dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400 font-semibold">
            <tr>
              <th className="px-5 py-3.5">Pelanggan</th>
              <th className="px-5 py-3.5">Username</th>
              <th className="px-5 py-3.5">Total Booking</th>
              <th className="px-5 py-3.5">Total Transaksi</th>
              <th className="px-5 py-3.5">Bergabung</th>
              <th className="px-5 py-3.5">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-gray-400">
                  Tidak ada pelanggan yang cocok dengan kata kunci pencarian.
                </td>
              </tr>
            ) : (
              filteredCustomers.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-lime-400/20 text-lime-600 dark:text-lime-400 font-bold border border-lime-400/30">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">{c.name}</p>
                        <p className="text-[11px] text-gray-400">{c.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 font-mono text-gray-600 dark:text-gray-400">
                    @{c.username}
                  </td>

                  <td className="px-5 py-4 font-bold text-gray-900 dark:text-white">
                    {c.totalBookings} kali
                  </td>

                  <td className="px-5 py-4 font-bold text-gray-900 dark:text-lime-400 font-mono">
                    Rp {c.totalSpent.toLocaleString("id-ID")}
                  </td>

                  <td className="px-5 py-4 text-gray-500 dark:text-gray-400">
                    {c.createdAt}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                        c.status === "Aktif"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                      }`}
                    >
                      <UserCheck className="h-3 w-3" />
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
