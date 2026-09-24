import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pemesanan",
  description: "Selesaikan pemesanan lapangan olahraga Anda di BookingLapangan.",
};

export default function PemesananLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
