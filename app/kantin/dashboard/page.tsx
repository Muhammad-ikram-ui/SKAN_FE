"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KdsOrderCard } from "@/components/shared/KdsOrderCard";
import { useOrderStore } from "@/store/useOrderStore";
import { useAuthStore } from "@/store/useAuthStore";
import { menuApi } from "@/lib/api";
import { MenuItem, OrderStatus } from "@/types";
import { formatRupiah, cn } from "@/lib/utils";
import { ChefHat, PackageCheck } from "lucide-react";

const TABS: { key: OrderStatus; label: string }[] = [
  { key: "pending", label: "Baru" },
  { key: "diproses", label: "Diproses" },
  { key: "siap_diambil", label: "Siap Diambil" },
  { key: "selesai", label: "Selesai" },
];

export default function KantinDashboardPage() {
  const { user } = useAuthStore();
  const standId = user?.stand_id ?? null;
  const { orders, loading, error, fetchOrders, ordersByStandAndStatus, updateStatus } =
    useOrderStore();
  const [menuList, setMenuList] = useState<MenuItem[]>([]);

  useEffect(() => {
    // GET /api/orders — backend otomatis filter sesuai stand petugas yang login
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (standId) {
      menuApi
        .list({ stand_id: standId })
        .then((res) => setMenuList(res.data.data ?? []))
        .catch(() => {});
    }
  }, [standId]);

  async function toggleMenu(menu: MenuItem) {
    const newStatus = menu.status === "tersedia" ? "habis" : "tersedia";
    setMenuList((prev) =>
      prev.map((m) => (m.id === menu.id ? { ...m, status: newStatus } : m))
    );
    try {
      await menuApi.updateStatus(menu.id, newStatus);
    } catch {
      // rollback bila gagal
      setMenuList((prev) =>
        prev.map((m) => (m.id === menu.id ? { ...m, status: menu.status } : m))
      );
    }
  }

  if (!standId) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 text-center text-sm text-slate-400">
        Akun petugas ini belum terhubung ke stand manapun. Hubungi Admin untuk mengaitkan
        akun ke salah satu gerai.
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-2xl bg-slate-50 pb-10">
      <div className="sticky top-0 z-20 border-b border-slate-100 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
            <ChefHat className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">
              {user?.stand?.nama_stand ?? "Gerai Kamu"}
            </p>
            <p className="text-xs text-slate-400">Kitchen Display System</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4">
        {error && <p className="mb-3 text-sm text-rose-500">{error}</p>}
        {loading && orders.length === 0 ? (
          <div className="flex items-center justify-center gap-2 py-14 text-sm text-slate-400">
            <Loader2 className="h-4 w-4 animate-spin" /> Memuat pesanan...
          </div>
        ) : (
          <Tabs defaultValue="pending">
            <TabsList className="w-full justify-between">
              {TABS.map((t) => {
                const count = ordersByStandAndStatus(standId, t.key).length;
                return (
                  <TabsTrigger key={t.key} value={t.key} className="flex-1 gap-1.5">
                    {t.label}
                    {count > 0 && (
                      <span className="rounded-full bg-slate-200 px-1.5 text-[10px] font-bold text-slate-600 data-[state=active]:bg-sky-100 data-[state=active]:text-sky-700">
                        {count}
                      </span>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {TABS.map((t) => {
              const list = ordersByStandAndStatus(standId, t.key);
              return (
                <TabsContent key={t.key} value={t.key} className="space-y-3">
                  {list.length === 0 ? (
                    <p className="py-14 text-center text-sm text-slate-400">
                      Tidak ada pesanan di antrean ini.
                    </p>
                  ) : (
                    list.map((order) => (
                      <KdsOrderCard key={order.id} order={order} onUpdateStatus={updateStatus} />
                    ))
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        )}

        {/* Quick-Toggle Status Menu */}
        <div className="mt-8">
          <div className="mb-2 flex items-center gap-2">
            <PackageCheck className="h-4 w-4 text-slate-500" />
            <p className="text-sm font-bold text-slate-900">Status Ketersediaan Menu</p>
          </div>
          <div className="space-y-2">
            {menuList.map((menu) => (
              <div
                key={menu.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{menu.nama_menu}</p>
                  <p className="text-xs text-slate-400">{formatRupiah(menu.harga)}</p>
                </div>
                <button
                  onClick={() => toggleMenu(menu)}
                  className={cn(
                    "relative h-7 w-12 rounded-full transition-colors",
                    menu.status === "tersedia" ? "bg-emerald-500" : "bg-slate-300"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform",
                      menu.status === "tersedia" ? "translate-x-5" : "translate-x-0.5"
                    )}
                  />
                </button>
              </div>
            ))}
            {menuList.length === 0 && (
              <p className="py-6 text-center text-sm text-slate-400">Belum ada menu di gerai ini.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
