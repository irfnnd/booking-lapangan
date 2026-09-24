import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar Lapangan",
  description: "Temukan dan pesan lapangan futsal, basket, dan olahraga lainnya yang tersedia.",
};

export default function LapanganLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
