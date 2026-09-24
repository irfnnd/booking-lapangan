import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Pengguna",
  description: "Kelola data dan akun pelanggan BookingLapangan.",
};

export default function DataPenggunaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
