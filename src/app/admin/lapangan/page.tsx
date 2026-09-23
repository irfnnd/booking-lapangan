import AdminPageHeader from "@/components/admin/AdminPageHeader";
import LapanganTable from "@/components/admin/LapanganTable";

export default function AdminLapanganPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Kelola Lapangan"
        description="Tambah, edit, hapus, dan pantau status operasional setiap lapangan yang tersedia."
      />

      <LapanganTable />
    </div>
  );
}
