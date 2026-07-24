"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Role } from "@/types";
import { cn } from "@/lib/utils";
import { GraduationCap, User, ChefHat, ShieldCheck, Loader2 } from "lucide-react";

const ROLE_CONFIG: { role: Role; label: string; icon: React.ElementType; redirect: string }[] = [
  { role: "siswa", label: "Siswa", icon: User, redirect: "/" },
  { role: "guru", label: "Guru", icon: GraduationCap, redirect: "/" },
  { role: "petugas_kantin", label: "Petugas", icon: ChefHat, redirect: "/kantin/dashboard" },
  { role: "admin", label: "Admin", icon: ShieldCheck, redirect: "/admin" },
];

/**
 * Role Switcher — login sungguhan ke backend Laravel memakai akun demo
 * hasil `php artisan db:seed`, supaya bisa preview seluruh screen tiap
 * role tanpa perlu isi form login manual berulang kali.
 */
export function RoleSwitcher() {
  const { user, loading, error, switchRole } = useAuthStore();
  const router = useRouter();

  async function handleSwitch(role: Role, redirect: string) {
    await switchRole(role);
    router.push(redirect);
  }

  return (
    <div className="sticky top-0 z-50 w-full bg-slate-900 text-slate-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 overflow-x-auto px-3 py-1.5 text-xs">
        <span className="hidden shrink-0 text-slate-400 sm:inline">
          🧪 Preview Mode — Role Switcher:
        </span>
        <div className="flex items-center gap-1">
          {ROLE_CONFIG.map(({ role, label, icon: Icon, redirect }) => (
            <button
              key={role}
              onClick={() => handleSwitch(role, redirect)}
              disabled={loading}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1 font-medium transition-colors disabled:opacity-50",
                user?.role === role
                  ? "bg-sky-500 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              )}
            >
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Icon className="h-3.5 w-3.5" />}
              {label}
            </button>
          ))}
        </div>
      </div>
      {error && (
        <div className="border-t border-slate-800 bg-rose-950/60 px-3 py-1.5 text-center text-[11px] text-rose-300">
          {error}
        </div>
      )}
    </div>
  );
}
