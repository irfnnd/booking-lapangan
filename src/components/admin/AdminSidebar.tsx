"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  Dumbbell,
  Users,
  TrendingUp,
  Settings,
  LogOut,
  X,
  ExternalLink,
  Shield,
} from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  pendingBookingCount?: number;
}

const navItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Kelola Lapangan",
    href: "/admin/lapangan",
    icon: Dumbbell,
  },
  {
    name: "Kelola Booking",
    href: "/admin/booking",
    icon: CalendarCheck,
    hasBadge: true,
  },
  {
    name: "Data Pengguna",
    href: "/admin/data_pengguna",
    icon: Users,
  },
  {
    name: "Laporan",
    href: "/admin/laporan",
    icon: TrendingUp,
  },
];

export default function AdminSidebar({
  isOpen = false,
  onClose,
  pendingBookingCount = 12,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/login";
        },
      },
    });
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-gray-900 text-white dark:bg-gray-950">
      {/* BRANDING */}
      <div>
        <div className="flex h-16 items-center justify-between border-b border-gray-800 px-6">
          <Link href="/admin" className="flex items-center gap-2.5 font-bold tracking-tight">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-400 text-gray-950 font-black shadow-md shadow-lime-400/20">
              BL
            </div>
            <div className="flex flex-col">
              <span className="text-base leading-tight font-bold text-white">
                Booking<span className="text-lime-400">Lapangan</span>
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-widest text-lime-400/80">
                Admin Panel
              </span>
            </div>
          </Link>

          {onClose && (
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* NAVIGATION LINKS */}
        <div className="px-4 py-6">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Navigasi Utama
          </p>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => onClose && onClose()}
                  className={`group relative flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-lime-400 text-gray-950 font-semibold shadow-sm shadow-lime-400/20"
                      : "text-gray-300 hover:bg-gray-800/80 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-5 w-5 transition-transform duration-150 group-hover:scale-110 ${
                        isActive ? "text-gray-950" : "text-gray-400 group-hover:text-lime-400"
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>

                  {item.hasBadge && pendingBookingCount > 0 && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                        isActive
                          ? "bg-gray-950 text-lime-400"
                          : "bg-amber-400/20 text-amber-400 border border-amber-400/30"
                      }`}
                    >
                      {pendingBookingCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed) */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-64 lg:flex-col border-r border-gray-800">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-gray-950/70 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Mobile Sidebar (Slide-over) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
