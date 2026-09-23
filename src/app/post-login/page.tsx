"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PostLoginPage() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function redirectByRole() {
      const response = await fetch("/api/admin");
      if (cancelled) return;
      if (response.status === 401) {
        router.replace("/login");
        return;
      }
      router.replace(response.ok ? "/admin" : "/dashboard");
    }

    void redirectByRole();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return <main className="flex min-h-screen items-center justify-center bg-[#f5f2ea] text-sm text-[#6d756d]">Menyiapkan dashboard...</main>;
}