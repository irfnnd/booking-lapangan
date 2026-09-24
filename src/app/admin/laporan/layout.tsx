import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Laporan",
  description: "Laporan pendapatan dan statistik pemesanan lapangan.",
};

export default function LaporanLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
