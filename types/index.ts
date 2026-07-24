export type Role = "siswa" | "guru" | "petugas_kantin" | "admin";

export interface Stand {
  id: number;
  nama_stand: string;
  pemilik: string | null;
  no_telepon: string | null;
  deskripsi: string | null;
  created_at?: string;
  updated_at?: string;
  menus?: MenuItem[];
  petugas?: User[];
}

export type JenisMenu = "makanan" | "minuman";
export type StatusMenu = "tersedia" | "habis";

export interface MenuItem {
  id: number;
  stand_id: number;
  nama_menu: string;
  harga: number;
  jenis: JenisMenu;
  foto: string | null;
  deskripsi: string | null;
  status: StatusMenu;
  stand?: Stand;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string | null;
  role: Role;
  stand_id: number | null;
  stand?: Stand;
}

export interface CartItem {
  menu: MenuItem;
  jumlah: number;
}

export type OrderStatus = "pending" | "diproses" | "siap_diambil" | "selesai" | "dibatalkan";

export interface OrderDetail {
  id: number;
  order_id: number;
  menu_id: number;
  jumlah: number;
  harga_satuan: number;
  subtotal: number;
  menu?: MenuItem;
}

export interface Order {
  id: number;
  kode_transaksi: string;
  user_id: number;
  stand_id: number;
  total_harga: number;
  status: OrderStatus;
  catatan: string | null;
  created_at: string;
  updated_at: string;
  user?: User;
  stand?: Stand;
  details?: OrderDetail[];
}

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Baru",
  diproses: "Diproses",
  siap_diambil: "Siap Diambil",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
};

/**
 * Backend tidak punya kolom is_priority di tabel orders.
 * Status prioritas GURU dihitung di frontend dari relasi user yang
 * sudah disertakan backend di setiap response order.
 */
export function isPriorityOrder(order: Order): boolean {
  return order.user?.role === "guru";
}
