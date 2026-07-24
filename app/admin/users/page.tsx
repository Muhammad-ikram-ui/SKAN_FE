"use client";

import { useEffect, useState } from "react";
import { Loader2, Search, ShieldCheck, GraduationCap, User, ChefHat, Plus, Trash2 } from "lucide-react";
import { AdminTopHeader } from "@/components/shared/AdminTopHeader";
import { userApi, standApi } from "@/lib/api";
import { Role, Stand, User as UserType } from "@/types";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ROLE_ICON: Record<Role, React.ElementType> = {
  siswa: User,
  guru: GraduationCap,
  petugas_kantin: ChefHat,
  admin: ShieldCheck,
};

const ROLE_LABEL: Record<Role, string> = {
  siswa: "Siswa",
  guru: "Guru",
  petugas_kantin: "Petugas Stand",
  admin: "Admin",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [stands, setStands] = useState<Stand[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "", stand_id: "" });

  function loadUsers() {
    setLoading(true);
    userApi
      .list()
      .then((res) => setUsers(res.data.data ?? []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadUsers();
    standApi.list().then((res) => setStands(res.data.data ?? []));
  }, []);

  async function handleDelete(id: number) {
    if (!confirm("Hapus pengguna ini?")) return;
    try {
      await userApi.remove(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {
      alert("Gagal menghapus pengguna.");
    }
  }

  async function handleAddPetugas() {
    setSaving(true);
    setFormError("");
    try {
      // POST /api/users/petugas — buat akun Petugas Kantin & kaitkan ke stand
      const res = await userApi.createPetugas({
        name: form.name,
        username: form.username,
        email: form.email || undefined,
        password: form.password,
        stand_id: Number(form.stand_id),
      });
      setUsers((prev) => [res.data.user, ...prev]);
      setForm({ name: "", username: "", email: "", password: "", stand_id: "" });
      setDialogOpen(false);
    } catch (err: any) {
      const errors = err?.response?.data?.errors;
      const firstError = errors ? (Object.values(errors)[0] as string[])?.[0] : null;
      setFormError(firstError ?? err?.response?.data?.message ?? "Gagal membuat akun petugas.");
    } finally {
      setSaving(false);
    }
  }

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.username.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <AdminTopHeader title="Manajemen Pengguna" subtitle="Kelola akun & buat akun Petugas Kantin" />
      <div className="space-y-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Cari nama atau username..."
              className="pl-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="primary" size="sm">
                <Plus className="h-4 w-4" /> Tambah Petugas Kantin
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Akun Petugas Kantin</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Nama Lengkap</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Username</Label>
                  <Input
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Email (opsional)</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Ditugaskan ke Stand</Label>
                  <Select value={form.stand_id} onValueChange={(v) => setForm({ ...form, stand_id: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih stand" />
                    </SelectTrigger>
                    <SelectContent>
                      {stands.map((s) => (
                        <SelectItem key={s.id} value={String(s.id)}>
                          {s.nama_stand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {formError && <p className="text-sm text-rose-500">{formError}</p>}
              </div>
              <DialogFooter>
                <Button variant="primary" onClick={handleAddPetugas} disabled={saving}>
                  {saving ? "Menyimpan..." : "Buat Akun"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-card overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-14 text-sm text-slate-400">
              <Loader2 className="h-4 w-4 animate-spin" /> Memuat pengguna...
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase text-slate-400">
                  <th className="px-4 py-3 font-medium">Nama</th>
                  <th className="px-4 py-3 font-medium">Username</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Stand</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => {
                  const Icon = ROLE_ICON[u.role];
                  return (
                    <tr key={u.id} className="border-b border-slate-50 last:border-0">
                      <td className="px-4 py-3 font-semibold text-slate-900">{u.name}</td>
                      <td className="px-4 py-3 text-slate-500">@{u.username}</td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
                            u.role === "guru" && "bg-amber-100 text-amber-800",
                            u.role === "siswa" && "bg-sky-100 text-sky-700",
                            u.role === "petugas_kantin" && "bg-slate-100 text-slate-700",
                            u.role === "admin" && "bg-indigo-100 text-indigo-700"
                          )}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {ROLE_LABEL[u.role]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{u.stand?.nama_stand ?? "-"}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
                      Tidak ada pengguna yang cocok.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        <p className="text-xs text-slate-400">
          Catatan: backend belum menyediakan endpoint untuk mengubah role user yang sudah ada
          (hanya index, buat petugas, detail, dan hapus). Untuk mengubah role, hapus akun lalu
          buat ulang lewat form yang sesuai.
        </p>
      </div>
    </div>
  );
}
