import type { Metadata } from "next";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import RecentBookingsTable from "@/components/admin/RecentBookingsTable";

export const metadata: Metadata = {
  title: "Kelola Booking",
  description: "Lihat dan kelola semua pemesanan lapangan.",
};

export default function AdminBookingPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Kelola Booking"
        description="Pantau semua pemesanan, status pembayaran, dan konfirmasi jadwal booking."
      />

      <RecentBookingsTable limit={20} />
    </div>
  );
}
