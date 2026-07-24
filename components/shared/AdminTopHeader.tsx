"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { Bell } from "lucide-react";

export function AdminTopHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const { user } = useAuthStore();

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <div>
        <h1 className="text-lg font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-4">
        <button className="relative flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600">
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500" />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
            {user?.name?.[0] ?? "A"}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold leading-none text-slate-900">{user?.name}</p>
            <p className="text-xs text-slate-400">Admin Sekolah</p>
          </div>
        </div>
      </div>
    </header>
  );
}
