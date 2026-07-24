import { Role } from "@/types";

/**
 * Kredensial akun demo — HARUS SAMA dengan database/seeders/DatabaseSeeder.php
 * di backend SKAN_BE. Role Switcher memakai ini untuk login sungguhan ke API
 * (bukan cuma data dummy), supaya preview role tetap konsisten dengan backend.
 *
 * Jalankan `php artisan db:seed` di backend sebelum memakai Role Switcher.
 */
export const DEMO_ACCOUNTS: Record<Role, { username: string; password: string }> = {
  siswa: { username: "siswa1", password: "password123" },
  guru: { username: "guru1", password: "password123" },
  petugas_kantin: { username: "petugas_rpl", password: "password123" },
  admin: { username: "admin", password: "password123" },
};
