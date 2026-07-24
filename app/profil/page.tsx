"use client";

import { useRouter } from "next/navigation";
import { MobileShell } from "@/components/shared/MobileShell";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { LogOut, GraduationCap, User as UserIcon, Zap } from "lucide-react";

export default function ProfilPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const isGuru = user?.role === "guru";

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <MobileShell showHeader={false}>
      <div className="px-4 pt-6">
        <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-soft">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-lg font-bold text-white">
            {user?.name?.[0] ?? "?"}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="font-semibold text-slate-900">{user?.name}</p>
              {isGuru && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                  <Zap className="h-3 w-3 fill-amber-600 text-amber-600" />
                  Prioritas
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">@{user?.username}</p>
            <p className="mt-1 flex items-center gap-1 text-xs font-medium text-sky-600">
              {isGuru ? <GraduationCap className="h-3.5 w-3.5" /> : <UserIcon className="h-3.5 w-3.5" />}
              {isGuru ? "Guru" : "Siswa"}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <div className="rounded-xl border border-slate-100 bg-white p-4 text-sm text-slate-500 shadow-soft">
            Gunakan Role Switcher di bagian paling atas aplikasi untuk berpindah tampilan
            antar role (Siswa, Guru, Petugas, Admin) saat melakukan pengujian.
          </div>
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="h-4 w-4" /> Keluar
          </Button>
        </div>
      </div>
    </MobileShell>
  );
}
