"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { DEMO_ACCOUNTS } from "@/lib/dummy-data";
import { Role } from "@/types";
import { UtensilsCrossed } from "lucide-react";

const ROLE_REDIRECT: Record<Role, string> = {
  siswa: "/",
  guru: "/",
  petugas_kantin: "/kantin/dashboard",
  admin: "/admin",
};

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // POST /api/auth/login — body: { username, password }
      const res = await authApi.login({ username, password });
      const { user, token } = res.data;
      login(user, token);
      router.push(ROLE_REDIRECT[user.role as Role] ?? "/");
    } catch (err: any) {
      setError(
        err?.response?.data?.errors?.username?.[0] ??
          err?.response?.data?.message ??
          "Gagal terhubung ke server. Pastikan backend Laravel aktif di http://127.0.0.1:8000."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-32px)] items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <UtensilsCrossed className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Masuk ke SKAN</h1>
          <p className="mt-1 text-sm text-slate-400">
            Sistem Kantin Sekolah — pesan makanan tanpa antre.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="cth: siswa1"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Kata Sandi</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-rose-500">{error}</p>}
          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? "Memproses..." : "Masuk"}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-400">
          Belum punya akun?{" "}
          <Link href="/register" className="font-semibold text-sky-600">
            Daftar sekarang
          </Link>
        </p>

        <div className="mt-6 rounded-lg border border-dashed border-slate-200 p-3 text-xs text-slate-400">
          <p className="mb-1.5 font-semibold text-slate-500">
            Akun demo (hasil `php artisan db:seed`):
          </p>
          {Object.entries(DEMO_ACCOUNTS).map(([role, acc]) => (
            <p key={role}>
              {role}: <span className="font-mono">{acc.username}</span> /{" "}
              <span className="font-mono">{acc.password}</span>
            </p>
          ))}
          <p className="mt-1">Atau gunakan Role Switcher di bagian paling atas halaman.</p>
        </div>
      </div>
    </div>
  );
}
