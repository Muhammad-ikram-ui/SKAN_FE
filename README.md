# SKAN — Sistem Kantin Sekolah

Frontend Next.js (App Router) + TypeScript + Zustand + Tailwind CSS + shadcn/ui,
**sudah terhubung penuh ke backend Laravel `SKAN_BE`**.

## Menjalankan Frontend

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Menjalankan Backend (SKAN_BE)

```bash
cd SKAN_BE-main
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

Backend akan jalan di `http://127.0.0.1:8000`. CORS di backend sudah diset untuk
menerima request dari `http://localhost:3000` (lihat `config/cors.php`), jadi
pastikan frontend jalan persis di port 3000.

## Konfigurasi URL API

```bash
# .env.local (opsional, default sudah mengarah ke localhost:8000)
NEXT_PUBLIC_API_ROOT=http://127.0.0.1:8000
```

## Akun Demo (hasil `php artisan db:seed`)

| Role | Username | Password |
|---|---|---|
| Admin | `admin` | `password123` |
| Petugas Kantin (RPL) | `petugas_rpl` | `password123` |
| Petugas Kantin (BR) | `petugas_br` | `password123` |
| Petugas Kantin (AK) | `petugas_ak` | `password123` |
| Petugas Kantin (MP) | `petugas_mp` | `password123` |
| Siswa | `siswa1` | `password123` |
| Guru | `guru1` | `password123` |

**Role Switcher** di bagian paling atas aplikasi memakai akun-akun ini untuk
login sungguhan ke backend — jadi begitu backend & seeder aktif, tinggal klik
salah satu tombol role untuk berpindah tampilan secara instan.

## Penyesuaian Penting dari Backend Asli

Beberapa hal di backend `SKAN_BE` berbeda dari asumsi awal, dan frontend ini
sudah disesuaikan:

1. **Login pakai `username`**, bukan email.
2. **Auth pakai Laravel Sanctum** (Bearer token), token disimpan di
   `localStorage` key `skan_token` dan otomatis disisipkan oleh `lib/api.ts`.
3. Role backend: `siswa`, `guru`, `petugas_kantin` (bukan `petugas`), `admin`.
4. Entitas gerai disebut **"Stand"** (`nama_stand`, `pemilik`, `no_telepon`,
   `deskripsi`) — tidak ada field kode (OSIS/RPL/dst) atau foto stand.
5. **Seeder backend hanya membuat 4 stand** (RPL, BR, AK, MP) — tidak ada
   OSIS. Frontend menampilkan stand apa pun yang ada di database secara
   dinamis, jadi kalau mau menambah gerai OSIS, tambahkan lewat
   `POST /api/stands` (admin) atau seeder Laravel.
6. Status pesanan: `pending, diproses, siap_diambil, selesai, dibatalkan`.
7. **Tidak ada kolom `is_priority` di tabel orders.** Prioritas Guru dihitung
   di frontend dari relasi `order.user.role === 'guru'` yang sudah
   disertakan backend di setiap response order (`types/index.ts` →
   `isPriorityOrder()`). Tidak perlu migrasi tambahan di backend.
8. Payload buat pesanan: `{ stand_id, catatan, items: [{ menu_id, jumlah }] }`
   — catatan hanya di level pesanan, bukan per-item.
9. **Tidak ada endpoint untuk mengubah role user yang sudah terdaftar** —
   backend hanya punya list, buat petugas kantin, detail, dan hapus user.
   Halaman `/admin/users` disesuaikan mengikuti keterbatasan ini.
10. Foto menu disimpan sebagai path relatif di disk `public` — di-resolve ke
    URL penuh lewat helper `storageUrl()` di `lib/api.ts`. Jalankan
    `php artisan storage:link` di backend supaya foto bisa diakses.

## Struktur Folder Penting

```
app/
  login/, register/          -> Auth (username + password, Sanctum)
  page.tsx                   -> Beranda, fetch GET /stands
  gerai/[id]/                -> Detail stand, fetch GET /stands/{id}
  cart/                      -> Checkout, POST /orders
  orders/                    -> Riwayat & tracking, GET /orders
  kantin/dashboard/          -> KDS, GET /orders + PATCH /orders/{id}/status
  admin/                     -> Dashboard, transaksi, gerai/menu, user
components/ui/               -> Komponen dasar (shadcn-style)
components/shared/            -> Komponen fitur (RoleSwitcher, KdsOrderCard, dst)
store/
  useAuthStore.ts             -> Auth + Role Switcher (login asli ke API)
  useCartStore.ts              -> Keranjang (payload sesuai backend)
  useOrderStore.ts             -> Fetch & update order + logika prioritas guru
lib/
  api.ts                       -> Axios client + semua endpoint SKAN_BE
  dummy-data.ts                 -> Kredensial akun demo (untuk Role Switcher)
  utils.ts                      -> Helper umum (cn, formatRupiah, dst)
types/index.ts                  -> Tipe data sesuai skema backend asli
```

## Troubleshooting

- **CORS error di console browser** → pastikan frontend jalan di port 3000
  persis (`config/cors.php` backend hanya mengizinkan origin ini).
- **401 Unauthorized** → token sudah expired/invalid, logout lalu login ulang.
- **Foto menu tidak muncul** → jalankan `php artisan storage:link` di
  backend.
- **Role Switcher gagal login** → pastikan sudah menjalankan
  `php artisan migrate --seed` di backend.
