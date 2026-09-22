"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  MapPin,
  Tag,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import LapanganFormModal, { LapanganFormData } from "./LapanganFormModal";

const initialMockLapangan: LapanganFormData[] = [
  {
    id: "lap-1",
    name: "Lapangan Futsal Vinyl A",
    category: "Futsal",
    location: "Gedung A - Lt. 1",
    price: 120000,
    picture_url:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500&auto=format&fit=crop&q=60",
    description: "Lantai Interlock standar internasional, lampu LED 400W.",
    status: "Aktif",
  },
  {
    id: "lap-2",
    name: "Lapangan Badminton Synthetics 1",
    category: "Badminton",
    location: "Gedung B - Lt. 2",
    price: 80000,
    picture_url:
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500&auto=format&fit=crop&q=60",
    description: "Karpet Yonex original, bebas silau matahari, AC hall.",
    status: "Aktif",
  },
  {
    id: "lap-3",
    name: "Lapangan Basket Interlock B",
    category: "Basketball",
    location: "Gedung A - Lt. 2",
    price: 150000,
    picture_url:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&auto=format&fit=crop&q=60",
    description: "Ring basket hidrolik, papan skor digital, tribun penonton.",
    status: "Aktif",
  },
  {
    id: "lap-4",
    name: "Lapangan Mini Soccer Sintetis",
    category: "Mini Soccer",
    location: "Outdoor Field 1",
    price: 250000,
    picture_url:
      "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=500&auto=format&fit=crop&q=60",
    description: "Rumput sintetis kualitas FIFA, jaring pengaman keliling.",
    status: "Pemeliharaan",
  },
];

export default function LapanganTable() {
  const [lapanganList, setLapanganList] = useState<LapanganFormData[]>(initialMockLapangan);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLapangan, setEditingLapangan] = useState<LapanganFormData | null>(null);

  const categories = ["Semua", "Futsal", "Badminton", "Basketball", "Mini Soccer", "Tenis"];

  const filteredLapangan = lapanganList.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "Semua" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleCreateOrUpdate = (data: LapanganFormData) => {
    if (editingLapangan) {
      // Edit
      setLapanganList((prev) =>
        prev.map((item) => (item.id === editingLapangan.id ? { ...data, id: editingLapangan.id } : item))
      );
    } else {
      // Create
      const newItem: LapanganFormData = {
        ...data,
        id: `lap-${Date.now()}`,
      };
      setLapanganList((prev) => [newItem, ...prev]);
    }
    setEditingLapangan(null);
  };

  const handleDelete = (id?: string) => {
    if (!id) return;
    if (confirm("Apakah Anda yakin ingin menghapus data lapangan ini?")) {
      setLapanganList((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const openEditModal = (item: LapanganFormData) => {
    setEditingLapangan(item);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingLapangan(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* TOOLBAR */}
      <div className="flex flex-col gap-4 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-gray-900 sm:flex-row sm:items-center sm:justify-between">
        {/* CATEGORY FILTERS */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                selectedCategory === cat
                  ? "bg-gray-900 text-lime-400 dark:bg-lime-400 dark:text-gray-950"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* SEARCH & ADD BUTTON */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari lapangan..."
              className="w-full rounded-xl border border-gray-200 bg-white pl-9 pr-3 py-1.5 text-xs text-gray-900 outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 rounded-xl bg-lime-400 px-4 py-2 text-xs font-bold text-gray-950 hover:bg-lime-300 transition shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah</span>
          </button>
        </div>
      </div>

      {/* GRID CARDS OF LAPANGAN */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredLapangan.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-gray-300 p-8 text-center text-xs text-gray-400 dark:border-gray-800">
            Tidak ada lapangan yang ditemukan.
          </div>
        ) : (
          filteredLapangan.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-xs transition duration-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
            >
              {/* IMAGE HEADER */}
              <div className="relative h-44 w-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                {item.picture_url ? (
                  <img
                    src={item.picture_url}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400">
                    Foto Fasilitas
                  </div>
                )}

                {/* CATEGORY BADGE */}
                <span className="absolute top-3 left-3 rounded-full bg-gray-950/80 px-3 py-1 text-[11px] font-bold text-lime-400 backdrop-blur-md">
                  {item.category}
                </span>

                {/* STATUS BADGE */}
                <span
                  className={`absolute top-3 right-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold backdrop-blur-md ${
                    item.status === "Aktif"
                      ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/30"
                      : "bg-amber-950/80 text-amber-300 border border-amber-500/30"
                  }`}
                >
                  {item.status === "Aktif" ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : (
                    <AlertTriangle className="h-3 w-3" />
                  )}
                  {item.status}
                </span>
              </div>

              {/* CARD BODY */}
              <div className="p-5">
                <h4 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">
                  {item.name}
                </h4>

                <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-lime-500" />
                  <span>{item.location}</span>
                </div>

                <p className="mt-3 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
                  {item.description || "Tidak ada deskripsi."}
                </p>

                {/* PRICE & ACTIONS */}
                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-semibold">
                      Sewa per jam
                    </span>
                    <p className="text-base font-extrabold text-gray-900 dark:text-lime-400 font-mono">
                      Rp {item.price.toLocaleString("id-ID")}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(item)}
                      className="rounded-xl border border-gray-200 p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition"
                      title="Edit Lapangan"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="rounded-xl border border-rose-200/60 p-2 text-rose-600 hover:bg-rose-50 dark:border-rose-900/40 dark:text-rose-400 dark:hover:bg-rose-950/40 transition"
                      title="Hapus Lapangan"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* FORM MODAL */}
      <LapanganFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        initialData={editingLapangan}
      />
    </div>
  );
}
