export type LapanganStatus = "Tersedia" | "Tidak Tersedia" | "Aktif" | "Nonaktif";

export const normalizeLapanganStatus = (
  status?: string | null,
): "Tersedia" | "Tidak Tersedia" => {
  const value = (status ?? "").trim();

  if (value === "Aktif" || value === "Tersedia") {
    return "Tersedia";
  }

  return "Tidak Tersedia";
};

export const isLapanganAvailable = (status?: string | null): boolean => {
  return normalizeLapanganStatus(status) === "Tersedia";
};
