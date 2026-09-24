import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar",
  description: "Buat akun baru di BookingLapangan dan mulai pesan lapangan olahraga favoritmu.",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
