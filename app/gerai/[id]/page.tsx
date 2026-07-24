"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ShoppingCart, Loader2 } from "lucide-react";
import Link from "next/link";
import { standApi } from "@/lib/api";
import { Stand } from "@/types";
import { MenuItemCard } from "@/components/shared/MenuItemCard";
import { useCartStore } from "@/store/useCartStore";
import { formatRupiah } from "@/lib/utils";

const JENIS_LABEL: Record<string, string> = {
  makanan: "Makanan",
  minuman: "Minuman",
};

export default function GeraiDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { totalQty, totalHarga } = useCartStore();
  const [stand, setStand] = useState<Stand | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // GET /api/stands/{id} — sudah include relasi menus
    standApi
      .detail(params.id)
      .then((res) => setStand(res.data.data))
      .catch(() => setError("Gagal memuat data gerai."))
      .finally(() => setLoading(false));
  }, [params.id]);

  const menuByJenis = useMemo(() => {
    const groups: Record<string, NonNullable<Stand["menus"]>> = {};
    for (const item of stand?.menus ?? []) {
      groups[item.jenis] = groups[item.jenis] ?? [];
      groups[item.jenis].push(item);
    }
    return groups;
  }, [stand]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-2 text-sm text-slate-400">
        <Loader2 className="h-4 w-4 animate-spin" /> Memuat gerai...
      </div>
    );
  }

  if (error || !stand) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-400">
        {error || "Gerai tidak ditemukan."}
      </div>
    );
  }

  const qty = totalQty();

  return (
    <div className="min-h-screen w-full bg-slate-50 pb-28">
      <div className="sticky top-0 z-30 flex items-center gap-3 bg-white/95 px-4 py-3 backdrop-blur border-b border-slate-100">
        <button onClick={() => router.back()} className="rounded-full bg-slate-100 p-2">
          <ArrowLeft className="h-4 w-4 text-slate-700" />
        </button>
        <div>
          <p className="text-sm font-semibold text-slate-900">{stand.nama_stand}</p>
          {stand.pemilik && <p className="text-xs text-slate-400">{stand.pemilik}</p>}
        </div>
      </div>

      <div className="space-y-5 px-4 py-4">
        {stand.deskripsi && <p className="text-sm text-slate-500">{stand.deskripsi}</p>}
        {Object.entries(menuByJenis).map(([jenis, items]) => (
          <div key={jenis}>
            <h2 className="mb-2 text-sm font-bold text-slate-900">
              {JENIS_LABEL[jenis] ?? jenis}
            </h2>
            <div className="space-y-3">
              {items.map((menu) => (
                <MenuItemCard key={menu.id} menu={menu} />
              ))}
            </div>
          </div>
        ))}
        {Object.keys(menuByJenis).length === 0 && (
          <p className="py-10 text-center text-sm text-slate-400">
            Belum ada menu tersedia di gerai ini.
          </p>
        )}
      </div>

      {qty > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-3">
          <Link
            href="/cart"
            className="flex w-full items-center justify-between rounded-xl bg-slate-900 px-4 py-3 text-white shadow-lg"
          >
            <span className="flex items-center gap-2 text-sm font-semibold">
              <ShoppingCart className="h-4 w-4" />
              {qty} item
            </span>
            <span className="text-sm font-bold">Lihat Keranjang · {formatRupiah(totalHarga())}</span>
          </Link>
        </div>
      )}
    </div>
  );
}
