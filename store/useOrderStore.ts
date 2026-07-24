import { create } from "zustand";
import { Order, OrderStatus, isPriorityOrder } from "@/types";
import { orderApi } from "@/lib/api";

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
  fetchOrders: (params?: { status?: string }) => Promise<void>;
  updateStatus: (orderId: number, status: OrderStatus) => Promise<void>;
  ordersByStandAndStatus: (standId: number, status: OrderStatus) => Order[];
}

/**
 * LOGIKA PRIORITAS ANTREAN:
 * Backend tidak menyimpan flag is_priority, jadi prioritas GURU dihitung
 * di sisi frontend dari relasi `order.user.role` yang sudah disertakan
 * backend pada setiap response order. Pesanan Guru selalu ditempatkan di
 * baris paling atas pada status "pending" & "diproses", melompati antrean
 * pesanan Siswa (FIFO).
 */
function sortByPriorityQueue(orders: Order[], status: OrderStatus): Order[] {
  const sorted = [...orders];
  if (status === "pending" || status === "diproses") {
    sorted.sort((a, b) => {
      const aPriority = isPriorityOrder(a);
      const bPriority = isPriorityOrder(b);
      if (aPriority !== bPriority) return aPriority ? -1 : 1;
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });
  } else {
    sorted.sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  }
  return sorted;
}

export const useOrderStore = create<OrderState>()((set, get) => ({
  orders: [],
  loading: false,
  error: null,
  fetchOrders: async (params) => {
    set({ loading: true, error: null });
    try {
      // GET /orders — backend otomatis filter sesuai role user yang login
      // (siswa/guru: pesanan sendiri, petugas: pesanan stand-nya, admin: semua)
      const res = await orderApi.list(params);
      set({ orders: res.data.data ?? [], loading: false });
    } catch (err) {
      set({
        loading: false,
        error: "Gagal memuat data pesanan dari server. Pastikan backend aktif & token valid.",
      });
    }
  },
  updateStatus: async (orderId, status) => {
    const prev = get().orders;
    // Optimistic update supaya UI terasa instan
    set({
      orders: prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
    });
    try {
      await orderApi.updateStatus(orderId, status);
    } catch (err) {
      // Rollback bila request ke backend gagal
      set({ orders: prev, error: "Gagal memperbarui status pesanan." });
    }
  },
  ordersByStandAndStatus: (standId, status) => {
    const filtered = get().orders.filter(
      (o) => o.stand_id === standId && o.status === status
    );
    return sortByPriorityQueue(filtered, status);
  },
}));
