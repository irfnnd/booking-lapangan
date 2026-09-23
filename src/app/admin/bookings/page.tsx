import { CalendarCheck } from "lucide-react";
import RecentBookingsTable from "@/components/admin/RecentBookingsTable";

export default function AdminBookingPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            Kelola Booking
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Periksa jadwal, konfirmasi, dan kelola pemesanan lapangan pelanggan.
          </p>
        </div>

      </div>

      <RecentBookingsTable />
    </div>
  );
}