"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Bell,
  Search,
  Plus,
  User,
  LogOut,
  ChevronDown,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";

interface AdminHeaderProps {
  onToggleSidebar?: () => void;
  title?: string;
}

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/lapangan": "Kelola Lapangan",
  "/admin/booking": "Kelola Booking",
  "/admin/pelanggan": "Data Pelanggan",
  "/admin/laporan": "Laporan & Keuangan",
  "/admin/pengaturan": "Pengaturan Sistem",
};

export default function AdminHeader({
  onToggleSidebar,
  title,
}: AdminHeaderProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const displayTitle = title || pageTitles[pathname] || "Admin Dashboard";

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/login";
        },
      },
    });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200/80 bg-white/95 px-4 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/95 sm:px-6">
      {/* LEFT SECTION: TOGGLE & TITLE */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onToggleSidebar}
          className="rounded-xl p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 lg:hidden transition"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white sm:text-xl tracking-tight">
            {displayTitle}
          </h1>
        </div>
      </div>

      {/* RIGHT SECTION: SEARCH, NOTIFICATIONS, ACTIONS & PROFILE */}
      <div className="flex items-center gap-2 sm:gap-4">

        {/* USER PROFILE DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 p-1 pr-3 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 transition"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-lime-400 dark:bg-lime-400 dark:text-gray-950">
              {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <span className="hidden text-xs font-semibold text-gray-700 dark:text-gray-200 sm:inline">
              {session?.user?.name || "Admin"}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl dark:border-gray-800 dark:bg-gray-900">
              <div className="border-b border-gray-100 px-3 py-2 dark:border-gray-800">
                <p className="text-xs font-bold text-gray-900 dark:text-white">
                  {session?.user?.name || "Administrator"}
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  {session?.user?.email || "admin@booking.com"}
                </p>
              </div>

              <div className="py-1">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                >
                  <LogOut className="h-4 w-4 text-rose-500" />
                  Keluar / Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
