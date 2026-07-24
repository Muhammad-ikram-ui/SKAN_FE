"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useOrderStore } from "@/store/useOrderStore";
import { MobileShell } from "@/components/shared/MobileShell";
import { OrderStepper } from "@/components/shared/OrderStepper";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { formatRupiah, formatTanggalWaktu, cn } from "@/lib/utils";
import { isPriorityOrder } from "@/types";

export default function OrdersPage() {
  const { orders, loading, error, fetchOrders } = useOrderStore();

  useEffect(() => {
    // GET /api/orders — backend otomatis balikin pesanan milik user yang login
    fetchOrders();
  }, [fetchOrders]);

  const activeOrders = orders.filter(
    (o) => o.status !== "selesai" && o.status !== "dibatalkan"
  );
  const historyOrders = orders.filter(
    (o) => o.status === "selesai" || o.status === "dibatalkan"
  );

  return (
    <MobileShell showHeader={false}>
      <div className="px-4 pt-4">
        <h1 className="text-lg font-bold text-slate-900">Pesanan Saya</h1>
        <p className="text-sm text-slate-400">Pantau status pesananmu secara langsung.</p>
      </div>

      <div className="mt-4 space-y-3 px-4">
        {loading && (
          <div className="flex items-center justify-center gap-2 py-14 text-sm text-slate-400">
            <Loader2 className="h-4 w-4 animate-spin" /> Memuat pesanan...
          </div>
        )}

        {error && <p className="py-6 text-center text-sm text-rose-500">{error}</p>}

        {!loading && !error && activeOrders.length === 0 && historyOrders.length === 0 && (
          <p className="py-16 text-center text-sm text-slate-400">
            Belum ada riwayat pesanan.
          </p>
        )}

        {activeOrders.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-bold uppercase text-slate-400">Sedang Berlangsung</p>
            <div className="space-y-3">
              {activeOrders.map((order) => {
                const priority = isPriorityOrder(order);
                return (
                  <div
                    key={order.id}
                    className={cn(
                      "rounded-xl border bg-white p-4 shadow-soft",
                      priority ? "border-amber-200" : "border-slate-100"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-mono text-sm font-bold text-slate-900">
                            {order.kode_transaksi}
                          </p>
                          {priority && <PriorityBadge />}
                        </div>
                        <p className="text-xs text-slate-400">
                          {order.stand?.nama_stand} · {formatTanggalWaktu(order.created_at)}
                        </p>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>

                    <div className="mt-4">
                      <OrderStepper status={order.status} />
                    </div>

                    <div className="mt-4 space-y-1 border-t border-dashed border-slate-100 pt-3">
                      {order.details?.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm text-slate-600">
                          <span>
                            {item.jumlah}x {item.menu?.nama_menu ?? `Menu #${item.menu_id}`}
                          </span>
                          <span>{formatRupiah(item.subtotal)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between pt-1 text-sm font-bold text-slate-900">
                        <span>Total</span>
                        <span>{formatRupiah(order.total_harga)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {historyOrders.length > 0 && (
          <div>
            <p className="mb-2 mt-4 text-xs font-bold uppercase text-slate-400">Riwayat</p>
            <div className="space-y-2">
              {historyOrders.map((order) => {
                const priority = isPriorityOrder(order);
                return (
                  <div
                    key={order.id}
                    className="w-full rounded-xl border border-slate-100 bg-white p-4 text-left shadow-soft"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-mono text-sm font-bold text-slate-900">
                            {order.kode_transaksi}
                          </p>
                          {priority && <PriorityBadge />}
                        </div>
                        <p className="text-xs text-slate-400">
                          {order.stand?.nama_stand} · {formatTanggalWaktu(order.created_at)}
                        </p>
                      </div>
                      <div className="text-right">
                        <StatusBadge status={order.status} />
                        <p className="mt-1 text-sm font-bold text-slate-900">
                          {formatRupiah(order.total_harga)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </MobileShell>
  );
}
