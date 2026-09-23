import AdminPageHeader from "@/components/admin/AdminPageHeader";
import CustomerTable from "@/components/admin/CustomerTable";

export default function AdminPenggunaPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Data Pengguna"
        description="Lihat daftar pelanggan yang telah terdaftar dan aktivitasnya di platform."
      />

      <CustomerTable />
    </div>
  );
}
