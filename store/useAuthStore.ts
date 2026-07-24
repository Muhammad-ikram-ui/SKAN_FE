import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Role, User } from "@/types";
import { authApi } from "@/lib/api";
import { DEMO_ACCOUNTS } from "@/lib/dummy-data";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (user: User, token: string) => void;
  logout: () => Promise<void>;
  /**
   * Role Switcher — login sungguhan ke backend memakai akun demo hasil seeder
   * (lihat lib/dummy-data.ts), supaya testing lintas role tetap konsisten
   * dengan API asli tanpa perlu isi form login berulang kali.
   */
  switchRole: (role: Role) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      login: (user, token) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("skan_token", token);
        }
        set({ user, isAuthenticated: true, error: null });
      },
      logout: async () => {
        try {
          await authApi.logout();
        } catch {
          // token mungkin sudah invalid — tetap lanjut hapus state lokal
        }
        if (typeof window !== "undefined") {
          localStorage.removeItem("skan_token");
        }
        set({ user: null, isAuthenticated: false });
      },
      switchRole: async (role) => {
        set({ loading: true, error: null });
        try {
          const { username, password } = DEMO_ACCOUNTS[role];
          const res = await authApi.login({ username, password });
          const { user, token } = res.data;
          if (typeof window !== "undefined") {
            localStorage.setItem("skan_token", token);
          }
          set({ user, isAuthenticated: true, loading: false });
        } catch (err) {
          set({
            loading: false,
            error:
              "Gagal login ke backend. Pastikan Laravel jalan di http://127.0.0.1:8000 dan sudah di-seed (php artisan db:seed).",
          });
        }
      },
    }),
    { name: "skan-auth-storage" }
  )
);
