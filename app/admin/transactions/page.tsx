"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { AdminTopHeader } from "@/components/shared/AdminTopHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { useOrderStore } from "@/store/useOrderStore";
import { standApi } from "@/lib/api";
import { formatRupiah, formatTanggalWaktu } from "@/lib/utils";
import { isPriorityOrder, Stand } from "@/types";

export default function AdminTransactionsPage() {
  const { orders, loading, error, fetchOrders } = useOrderStore();
  const [stands, setStands] = useState<Stand[]>([]);
  const [filterStand, setFilterStand] = useState<number | "semua">("semua");

  useEffect(() => {
    fetchOrders();
    standApi.list().then((res) => setStands(res.data.data ?? [])).catch(() => {});
  }, [fetchOrders]);

  const filtered =
    filterStand === "semua" ? orders : orders.filter((o) => o.stand_id === filterStand);

  return (
    <div>
      <AdminTopHeader title="Transaksi" subtitle="Seluruh transaksi pesanan dari semua gerai" />
      <div className="space-y-4 p-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterStand("semua")}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${
              filterStand === "semua" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            Semua Gerai
          </button>
          {stands.map((s) => (
            <button
              key={s.id}
              onClick={() => setFilterStand(s.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                filterStand === s.id ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              {s.nama_stand}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-card overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-14 text-sm text-slate-400">
              <Loader2 className="h-4 w-4 animate-spin" /> Memuat transaksi...
            </div>
          ) : error ? (
            <p className="py-10 text-center text-sm text-rose-500">{error}</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase text-slate-400">
                  <th className="px-4 py-3 font-medium">Order ID</th>
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Gerai</th>
                  <th className="px-4 py-3 font-medium">Item</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Waktu</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order.id} className="border-b border-slate-50 last:border-0 align-top">
                    <td className="px-4 py-3 font-mono font-semibold text-slate-900">
                      {order.kode_transaksi}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {order.user?.name}
                        {isPriorityOrder(order) && <PriorityBadge />}
                      </div>
                    </td>
                    <td className="px-4 py-3">{order.stand?.nama_stand}</td>
                    <td className="px-4 py-3 text-slate-500">
                      {order.details
                        ?.map((i) => `${i.jumlah}x ${i.menu?.nama_menu ?? `#${i.menu_id}`}`)
                        .join(", ")}
                    </td>
                    <td className="px-4 py-3 font-semibold">{formatRupiah(order.total_harga)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {formatTanggalWaktu(order.created_at)}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                      Tidak ada transaksi untuk filter ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
