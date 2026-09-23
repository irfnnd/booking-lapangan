export type LapanganStatus = "Tersedia" | "Tidak Tersedia" | "Aktif" | "Nonaktif";

export const normalizeLapanganStatus = (
  status?: string | null,
): "Tersedia" | "Tidak Tersedia" => {
  const value = (status ?? "").trim().toLowerCase();

  if (value === "aktif" || value === "tersedia" || value === "available" || value === "active") {
    return "Tersedia";
  }

  return "Tidak Tersedia";
};

export const isLapanganAvailable = (status?: string | null): boolean => {
  return normalizeLapanganStatus(status) === "Tersedia";
};
