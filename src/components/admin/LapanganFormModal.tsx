"use client";

import React, { useState, useEffect } from "react";
import { X, Image as ImageIcon, MapPin, DollarSign, Dumbbell } from "lucide-react";

export interface LapanganFormData {
  id?: string;
  name: string;
  category: string;
  location: string;
  price: number;
  picture_url: string;
  description: string;
  status: "Aktif" | "Pemeliharaan" | "Nonaktif";
}

interface LapanganFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LapanganFormData) => void;
  initialData?: LapanganFormData | null;
}

export default function LapanganFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: LapanganFormModalProps) {
  const [formData, setFormData] = useState<LapanganFormData>({
    name: "",
    category: "Futsal",
    location: "Gedung Utama Lt. 1",
    price: 120000,
    picture_url: "",
    description: "",
    status: "Aktif",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: "",
        category: "Futsal",
        location: "Gedung Utama Lt. 1",
        price: 120000,
        picture_url: "",
        description: "",
        status: "Aktif",
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900 my-8">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {initialData ? "Edit Data Lapangan" : "Tambah Lapangan Baru"}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Isi informasi detail fasilitas lapangan olahraga.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* MODAL FORM */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          {/* NAMA LAPANGAN */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
              Nama Lapangan
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Lapangan Futsal Vinyl A"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-900 outline-none focus:border-lime-500 focus:bg-white focus:ring-2 focus:ring-lime-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* KATEGORI & STATUS */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
                Kategori Olahraga
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-900 outline-none focus:border-lime-500 focus:bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="Futsal">Futsal</option>
                <option value="Badminton">Badminton</option>
                <option value="Basketball">Basketball</option>
                <option value="Mini Soccer">Mini Soccer</option>
                <option value="Tenis">Tenis</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
                Status Operasional
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as "Aktif" | "Pemeliharaan" | "Nonaktif",
                  })
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-900 outline-none focus:border-lime-500 focus:bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="Aktif">Aktif (Tersedia)</option>
                <option value="Pemeliharaan">Pemeliharaan (Maintenance)</option>
                <option value="Nonaktif">Nonaktif</option>
              </select>
            </div>
          </div>

          {/* LOKASI & HARGA */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
                Lokasi / Area
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Gedung Utama Lt. 1"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-900 outline-none focus:border-lime-500 focus:bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
                Harga per Jam (Rp)
              </label>
              <input
                type="number"
                required
                min={0}
                step={5000}
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-900 outline-none focus:border-lime-500 focus:bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-white font-mono"
              />
            </div>
          </div>

          {/* PICTURE URL */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
              URL Foto / Gambar Lapangan
            </label>
            <input
              type="url"
              value={formData.picture_url}
              onChange={(e) =>
                setFormData({ ...formData, picture_url: e.target.value })
              }
              placeholder="https://images.unsplash.com/..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-900 outline-none focus:border-lime-500 focus:bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* DESKRIPSI */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
              Deskripsi & Fasilitas
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Fasilitas: Penerangan LED, Ruang ganti, Papan skor digital..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-900 outline-none focus:border-lime-500 focus:bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* ACTIONS */}
          <div className="mt-6 flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-xl bg-lime-400 px-5 py-2 text-xs font-bold text-gray-950 hover:bg-lime-300 transition shadow-xs"
            >
              Simpan Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
