"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useSession } from "@/lib/auth-client";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = useSession();

  useEffect(() => {
    // Halaman login admin tidak perlu proteksi
    if (pathname === "/admin/login") {
      return;
    }

    // Tunggu sampai session selesai diperiksa
    if (isPending) {
      return;
    }

    // Belum login
    if (!session?.user) {
      router.replace("/admin/login");
      return;
    }

    // Sudah login tetapi bukan admin
    if (session.user.role !== "ADMIN") {
      router.replace("/admin/login");
    }
  }, [isPending, pathname, router, session]);

  // Halaman login admin tampil tanpa layout admin
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Loading ketika session sedang diperiksa
  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Memeriksa sesi...
        </p>
      </div>
    );
  }

  // Belum login
  if (!session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Mengarahkan ke halaman login...
        </p>
      </div>
    );
  }

  // Bukan admin
  if (session.user.role !== "ADMIN") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Akses ditolak. Mengarahkan...
        </p>
      </div>
    );
  }

  // Admin yang sudah terautentikasi
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-150">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:pl-64 flex flex-col min-h-screen">
        <AdminHeader
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        <footer className="border-t border-gray-200/80 bg-white py-4 px-6 text-center text-xs text-gray-400 dark:border-gray-800 dark:bg-gray-900">
          © 2026 BookingLapangan Admin Panel. Hak Cipta Dilindungi.
        </footer>
      </div>
    </div>
  );
}