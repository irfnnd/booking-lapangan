import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login Admin",
  description: "Masuk ke panel admin BookingLapangan.",
};

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
