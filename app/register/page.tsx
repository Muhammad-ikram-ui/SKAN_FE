"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { UtensilsCrossed } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "siswa" as "siswa" | "guru",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // POST /api/auth/register — hanya untuk role Siswa & Guru
      const res = await authApi.register({
        name: form.name,
        username: form.username,
        email: form.email || undefined,
        password: form.password,
        role: form.role,
      });
      const { user, token } = res.data;
      login(user, token);
      router.push("/");
    } catch (err: any) {
      const errors = err?.response?.data?.errors;
      const firstError = errors ? (Object.values(errors)[0] as string[])?.[0] : null;
      setError(
        firstError ??
          err?.response?.data?.message ??
          "Gagal terhubung ke server. Pastikan backend Laravel aktif di http://127.0.0.1:8000."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-32px)] items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <UtensilsCrossed className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Daftar Akun SKAN</h1>
          <p className="mt-1 text-sm text-slate-400">
            Buat akun untuk mulai memesan di kantin sekolah.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input
              id="name"
              placeholder="Nama kamu"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Tanpa spasi, cth: budi_siswa"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email (opsional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="nama@sekolah.sch.id"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Kata Sandi</Label>
            <Input
              id="password"
              type="password"
              placeholder="Minimal 6 karakter"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Daftar Sebagai</Label>
            <Select
              value={form.role}
              onValueChange={(v) => setForm({ ...form, role: v as "siswa" | "guru" })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="siswa">Siswa</SelectItem>
                <SelectItem value="guru">Guru</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-400">
              Akun Petugas Kantin & Admin dibuat langsung oleh Admin Sekolah.
            </p>
          </div>
          {error && <p className="text-sm text-rose-500">{error}</p>}
          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? "Memproses..." : "Daftar"}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-400">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-semibold text-sky-600">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
