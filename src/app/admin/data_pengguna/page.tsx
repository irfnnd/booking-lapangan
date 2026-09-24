"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Users,
  CalendarDays,
  Wallet,
  Mail,
  ChevronLeft,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Eye,
} from "lucide-react";

type UserRole = "USER" | "ADMIN";

type User = {
  id: string;
  name: string;
  email: string;
  username: string;
  registeredAt: string;
  role: UserRole;
};

type FormData = {
  name: string;
  email: string;
  username: string;
  password: string;
  role: UserRole;
};

function formatDate(value: string | null) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getInitials(name: string) {
  if (!name) return "?";

  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getRoleLabel(role: UserRole) {
  return role === "ADMIN" ? "Admin" : "Pengguna";
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");

  const [userList, setUserList] = useState<User[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [detailUser, setDetailUser] = useState<User | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    username: "",
    password: "",
    role: "USER",
  });

  // =========================
  // GET USERS
  // =========================

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/admin/pengguna", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Gagal mengambil data pengguna"
        );
      }

      setUserList(data);
    } catch (error) {
      console.error("FETCH USERS ERROR:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Gagal mengambil data pengguna"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadUsers = async () => {
      try {
        const response = await fetch("/api/admin/pengguna");

        if (!response.ok) {
          throw new Error("Gagal mengambil data pengguna");
        }

        const data = await response.json();

        if (!cancelled) {
          setUserList(data);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Gagal mengambil data pengguna:",
            error
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      cancelled = true;
    };
  }, []);

  // =========================
  // SEARCH
  // =========================

  const filteredUsers = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) {
      return userList;
    }

    return userList.filter((user) => {
      return (
        user.name.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword) ||
        user.username.toLowerCase().includes(keyword)
      );
    });
  }, [search, userList]);

  // =========================
  // STATISTICS
  // =========================

  const totalUsers = userList.length;

  // =========================
  // OPEN CREATE MODAL
  // =========================

  const openCreateModal = () => {
    setEditingUser(null);

    setFormData({
      name: "",
      email: "",
      username: "",
      password: "",
      role: "USER",
    });

    setIsModalOpen(true);
  };

  // =========================
  // OPEN EDIT MODAL
  // =========================

  const openEditModal = (user: User) => {
    setEditingUser(user);

    setFormData({
      name: user.name,
      email: user.email,
      username: user.username,
      password: "",
      role: user.role,
    });

    setIsModalOpen(true);
  };

  // =========================
  // CLOSE MODAL
  // =========================

  const closeModal = () => {
    if (saving) return;

    setIsModalOpen(false);
    setEditingUser(null);

    setFormData({
      name: "",
      email: "",
      username: "",
      password: "",
      role: "USER",
    });
  };

  // =========================
  // CREATE
  // =========================

  const handleCreate = async () => {
    if (
      !formData.email ||
      !formData.username ||
      !formData.password
    ) {
      alert("Email, username, dan password wajib diisi.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch("/api/admin/pengguna", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Gagal menambahkan pengguna"
        );
      }

      closeModal();

      await fetchUsers();
    } catch (error) {
      console.error("CREATE USER ERROR:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Gagal menambahkan pengguna"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // UPDATE
  // =========================

  const handleUpdate = async () => {
    if (!editingUser) return;

    if (!formData.email || !formData.username) {
      alert("Email dan username wajib diisi.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `/api/admin/pengguna/${editingUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Gagal mengubah pengguna"
        );
      }

      closeModal();

      await fetchUsers();
    } catch (error) {
      console.error("UPDATE USER ERROR:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Gagal mengubah pengguna"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (user: User) => {
    const confirmed = window.confirm(
      `Apakah kamu yakin ingin menghapus pengguna "${user.name}"?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/admin/pengguna/${user.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Gagal menghapus pengguna"
        );
      }

      await fetchUsers();
    } catch (error) {
      console.error("DELETE USER ERROR:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Gagal menghapus pengguna"
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* =========================
          STATISTICS
      ========================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Pengguna"
          value={totalUsers}
          subtitle="Pengguna terdaftar"
          icon={Users}
          iconClass="bg-lime-100 text-lime-700 dark:bg-lime-400/10 dark:text-lime-400"
        />

        <StatCard
          title="Total Booking"
          value="-"
          subtitle="Data booking dikelola di halaman booking"
          icon={CalendarDays}
          iconClass="bg-blue-100 text-blue-700 dark:bg-blue-400/10 dark:text-blue-400"
        />

        <StatCard
          title="Total Transaksi"
          value="-"
          subtitle="Data transaksi dikelola di halaman transaksi"
          icon={Wallet}
          iconClass="bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400"
        />
      </div>

      {/* =========================
          USER TABLE
      ========================= */}

      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        {/* HEADER */}

        <div className="border-b border-gray-100 p-5 dark:border-gray-800 sm:p-6">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Daftar Pengguna
              </h2>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Kelola seluruh pengguna yang terdaftar di
                aplikasi.
              </p>
            </div>

            <button
              onClick={openCreateModal}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 text-sm font-bold text-white transition hover:bg-gray-800 dark:bg-lime-400 dark:text-gray-950 dark:hover:bg-lime-300"
            >
              <Plus className="h-4 w-4" />
              Tambah Pengguna
            </button>
          </div>

          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, email, atau username..."
              className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none transition focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* TABLE */}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                <th className="px-6 py-4">Pengguna</th>
                <th className="px-6 py-4">Kontak</th>
                <th className="px-6 py-4">Username</th>
                <th className="px-6 py-4">Terdaftar</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-right">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-16 text-center"
                  >
                    <Loader2 className="mx-auto h-7 w-7 animate-spin text-lime-500" />

                    <p className="mt-3 text-sm text-gray-500">
                      Memuat data pengguna...
                    </p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-16 text-center"
                  >
                    <Users className="mx-auto mb-3 h-8 w-8 text-gray-300" />

                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                      Pengguna tidak ditemukan
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Belum ada pengguna yang sesuai dengan
                      pencarian.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="transition hover:bg-gray-50/80 dark:hover:bg-gray-800/40"
                  >
                    {/* USER */}

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-xs font-black text-lime-400 dark:bg-gray-800">
                          {getInitials(user.name)}
                        </div>

                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {user.name || "Tanpa Nama"}
                          </p>

                          <p className="max-w-[180px] truncate text-xs text-gray-500 dark:text-gray-400">
                            ID {user.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* EMAIL */}

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                        <Mail className="h-3.5 w-3.5 shrink-0 text-gray-400" />

                        <span className="max-w-[220px] truncate">
                          {user.email}
                        </span>
                      </div>
                    </td>

                    {/* USERNAME */}

                    <td className="px-6 py-5">
                      <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                        @{user.username}
                      </span>
                    </td>

                    {/* REGISTERED */}

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                        <CalendarDays className="h-3.5 w-3.5 shrink-0 text-gray-400" />

                        {formatDate(user.registeredAt)}
                      </div>
                    </td>

                    {/* ROLE */}

                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex rounded-lg px-3 py-1.5 text-xs font-bold ${
                          user.role === "ADMIN"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-400/10 dark:text-purple-400"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-400/10 dark:text-blue-400"
                        }`}
                      >
                        {getRoleLabel(user.role)}
                      </span>
                    </td>

                    {/* ACTION */}

                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setDetailUser(user)}
                          title="Lihat detail"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-lime-400 hover:bg-lime-50 hover:text-lime-700 dark:border-gray-700 dark:hover:bg-lime-400/10 dark:hover:text-lime-400"
                        >
                           <Eye className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => openEditModal(user)}
                          title="Edit"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 dark:border-gray-700 dark:hover:bg-blue-400/10 dark:hover:text-blue-400"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(user)}
                          title="Hapus"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-red-400 hover:bg-red-50 hover:text-red-700 dark:border-gray-700 dark:hover:bg-red-400/10 dark:hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION INFO */}

        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4 dark:border-gray-800 sm:px-6">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Menampilkan{" "}
            <span className="font-bold text-gray-700 dark:text-gray-200">
              {filteredUsers.length}
            </span>{" "}
            dari{" "}
            <span className="font-bold text-gray-700 dark:text-gray-200">
              {totalUsers}
            </span>{" "}
            pengguna
          </p>

          <div className="flex gap-2">
            <button
              disabled
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 disabled:opacity-50 dark:border-gray-700"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-xs font-bold text-white dark:bg-lime-400 dark:text-gray-950">
              1
            </button>

            <button
              disabled
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 disabled:opacity-50 dark:border-gray-700"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* =========================
          CREATE / EDIT MODAL
      ========================= */}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl dark:bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-100 p-5 dark:border-gray-800">
              <div>
                <h2 className="text-lg font-black text-gray-900 dark:text-white">
                  {editingUser
                    ? "Edit Pengguna"
                    : "Tambah Pengguna"}
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  {editingUser
                    ? "Perbarui informasi pengguna."
                    : "Tambahkan pengguna baru ke database."}
                </p>
              </div>

              <button
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-5">
              {/* NAME */}

              <div>
                <label className="mb-1.5 block text-xs font-bold text-gray-700 dark:text-gray-300">
                  Nama
                </label>

                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  placeholder="Nama pengguna"
                  className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              {/* EMAIL */}

              <div>
                <label className="mb-1.5 block text-xs font-bold text-gray-700 dark:text-gray-300">
                  Email *
                </label>

                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  placeholder="email@example.com"
                  className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              {/* USERNAME */}

              <div>
                <label className="mb-1.5 block text-xs font-bold text-gray-700 dark:text-gray-300">
                  Username *
                </label>

                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      username: e.target.value,
                    })
                  }
                  placeholder="username"
                  className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              {/* ROLE */}

              <div>
                <label className="mb-1.5 block text-xs font-bold text-gray-700 dark:text-gray-300">
                  Role *
                </label>

                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as UserRole,
                    })
                  }
                  className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="USER">Pengguna</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              {/* PASSWORD */}

              <div>
                <label className="mb-1.5 block text-xs font-bold text-gray-700 dark:text-gray-300">
                  Password{" "}
                  {editingUser
                    ? "(kosongkan jika tidak diubah)"
                    : "*"}
                </label>

                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password: e.target.value,
                    })
                  }
                  placeholder={
                    editingUser
                      ? "Password baru"
                      : "Password"
                  }
                  className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 p-5 dark:border-gray-800">
              <button
                onClick={closeModal}
                disabled={saving}
                className="h-10 rounded-xl border border-gray-200 px-4 text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Batal
              </button>

              <button
                onClick={
                  editingUser ? handleUpdate : handleCreate
                }
                disabled={saving}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-gray-900 px-5 text-sm font-bold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-lime-400 dark:text-gray-950 dark:hover:bg-lime-300"
              >
                {saving && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {editingUser
                  ? "Simpan Perubahan"
                  : "Tambah Pengguna"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================
          DETAIL MODAL
      ========================= */}

      {detailUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl dark:bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-100 p-5 dark:border-gray-800">
              <h2 className="text-lg font-black text-gray-900 dark:text-white">
                Detail Pengguna
              </h2>

              <button
                onClick={() => setDetailUser(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-900 text-sm font-black text-lime-400 dark:bg-gray-800">
                  {getInitials(detailUser.name)}
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    {detailUser.name || "Tanpa Nama"}
                  </h3>

                  <p className="text-xs text-gray-500">
                    @{detailUser.username}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <DetailRow
                  label="Email"
                  value={detailUser.email}
                />

                <DetailRow
                  label="Username"
                  value={`@${detailUser.username}`}
                />

                <DetailRow
                  label="Terdaftar"
                  value={formatDate(detailUser.registeredAt)}
                />

                <DetailRow
                  label="Role"
                  value={getRoleLabel(detailUser.role)}
                />
              </div>
            </div>

            <div className="border-t border-gray-100 p-5 dark:border-gray-800">
              <button
                onClick={() => setDetailUser(null)}
                className="h-10 w-full rounded-xl bg-gray-900 text-sm font-bold text-white dark:bg-lime-400 dark:text-gray-950"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================
   STAT CARD
========================= */

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClass,
}: {
  title: string;
  value: number | string;
  subtitle: string;
  icon: React.ElementType;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>

          <p className="mt-2 text-2xl font-black tracking-tight text-gray-900 dark:text-white">
            {value}
          </p>

          <p className="mt-1 text-[11px] text-gray-400">
            {subtitle}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

/* =========================
   DETAIL ROW
========================= */

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-800">
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
        {label}
      </span>

      <span className="text-right text-xs font-bold text-gray-900 dark:text-white">
        {value}
      </span>
    </div>
  );
}