"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { Zap, Bell } from "lucide-react";
import Link from "next/link";

export function MobileHeader() {
  const { user } = useAuthStore();
  const isGuru = user?.role === "guru";

  return (
    <div className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="flex flex-col gap-3 px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
              Selamat datang di SKAN
            </p>
            <h1 className="text-lg font-semibold text-slate-900">
              Hallo, {isGuru ? "Guru" : user?.role === "siswa" ? "Siswa" : user?.name ?? "Pengguna"} 👋
            </h1>
          </div>
          <Link
            href="/orders"
            className="relative flex h-11 w-11 items-center justify-center rounded-3xl bg-slate-100 text-slate-700 transition hover:bg-slate-200"
          >
            <Bell className="h-5 w-5" />
          </Link>
        </div>
        <div className="rounded-3xl bg-slate-100 p-3 text-sm text-slate-600">
          {isGuru ? (
            <p className="font-medium text-slate-900">Jalur antrean prioritas aktif</p>
          ) : (
            <p>Temukan gerai dan pesan makanan tanpa antre. Cepat, rapi, dan aman.</p>
          )}
        </div>
      </div>
    </div>
  );
}
