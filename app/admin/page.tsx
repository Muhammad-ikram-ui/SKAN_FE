"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { AdminTopHeader } from "@/components/shared/AdminTopHeader";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { useOrderStore } from "@/store/useOrderStore";
import { standApi, menuApi, userApi } from "@/lib/api";
import { formatRupiah, formatWaktu } from "@/lib/utils";
import { isPriorityOrder } from "@/types";
import { Store, UtensilsCrossed, Users, Receipt } from "lucide-react";

export default function AdminDashboardPage() {
  const { orders, loading, error, fetchOrders } = useOrderStore();
  const [totalStand, setTotalStand] = useState(0);
  const [totalMenu, setTotalMenu] = useState(0);
  const [totalUser, setTotalUser] = useState(0);

  useEffect(() => {
    // Admin: GET /orders otomatis balikin SEMUA pesanan di seluruh stand
    fetchOrders();
    standApi.list().then((res) => setTotalStand((res.data.data ?? []).length)).catch(() => {});
    menuApi.list().then((res) => setTotalMenu((res.data.data ?? []).length)).catch(() => {});
    userApi.list().then((res) => setTotalUser((res.data.data ?? []).length)).catch(() => {});
  }, [fetchOrders]);

  const today = new Date().toDateString();
  const ordersToday = orders.filter((o) => new Date(o.created_at).toDateString() === today);

  return (
    <div>
      <AdminTopHeader
        title="Dashboard Admin"
        subtitle="Ringkasan aktivitas kantin sekolah hari ini"
      />

      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Gerai" value={totalStand} icon={Store} accent="sky" />
          <StatCard label="Total Menu" value={totalMenu} icon={UtensilsCrossed} accent="amber" />
          <StatCard label="Total User Terdaftar" value={totalUser} icon={Users} accent="emerald" />
          <StatCard label="Total Pesanan Hari Ini" value={ordersToday.length} icon={Receipt} accent="slate" />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-card">
          <div className="flex items-center justify-between border-b border-slate-100 p-4">
            <div>
              <p className="font-semibold text-slate-900">Live Feed Transaksi</p>
              <p className="text-xs text-slate-400">
                Monitoring realtime pesanan di seluruh gerai
              </p>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              Live
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-2 py-14 text-sm text-slate-400">
              <Loader2 className="h-4 w-4 animate-spin" /> Memuat transaksi...
            </div>
          ) : error ? (
            <p className="py-10 text-center text-sm text-rose-500">{error}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs uppercase text-slate-400">
                    <th className="px-4 py-3 font-medium">No</th>
                    <th className="px-4 py-3 font-medium">Order ID</th>
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Gerai</th>
                    <th className="px-4 py-3 font-medium">Total</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Waktu</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, idx) => (
                    <tr key={order.id} className="border-b border-slate-50 last:border-0">
                      <td className="px-4 py-3 text-slate-400">{idx + 1}</td>
                      <td className="px-4 py-3 font-mono font-semibold text-slate-900">
                        {order.kode_transaksi}
                      </td>
                      <td className="px-4 py-3">{order.user?.name}</td>
                      <td className="px-4 py-3">
                        {isPriorityOrder(order) ? (
                          <PriorityBadge />
                        ) : (
                          <span className="capitalize text-slate-500">{order.user?.role}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">{order.stand?.nama_stand}</td>
                      <td className="px-4 py-3 font-semibold">{formatRupiah(order.total_harga)}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-3 text-slate-400">{formatWaktu(order.created_at)}</td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-10 text-center text-slate-400">
                        Belum ada transaksi.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
