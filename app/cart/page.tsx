"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Minus, Plus, Trash2, Zap, UtensilsCrossed } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { standApi, orderApi, storageUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatRupiah } from "@/lib/utils";
import { Stand } from "@/types";

export default function CartPage() {
  const router = useRouter();
  const { items, standId, addItem, decreaseItem, removeItem, totalHarga, clearCart } =
    useCartStore();
  const { user } = useAuthStore();
  const [catatan, setCatatan] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [stand, setStand] = useState<Stand | null>(null);

  useEffect(() => {
    if (standId) {
      standApi.detail(standId).then((res) => setStand(res.data.data)).catch(() => {});
    }
  }, [standId]);

  const isPriority = user?.role === "guru";
  const total = totalHarga();

  async function handleCheckout() {
    if (!user || items.length === 0 || !standId) return;
    setSubmitting(true);
    setSubmitError("");

    try {
      // POST /api/orders — body: { stand_id, catatan, items: [{ menu_id, jumlah }] }
      await orderApi.create({
        stand_id: standId,
        catatan: catatan || undefined,
        items: items.map((i) => ({ menu_id: i.menu.id, jumlah: i.jumlah })),
      });
      clearCart();
      router.push("/orders");
    } catch (err: any) {
      setSubmitError(
        err?.response?.data?.message ??
          "Gagal membuat pesanan. Pastikan menu masih tersedia & backend aktif."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-3 bg-slate-50 px-6 text-center">
        <p className="text-4xl">🛒</p>
        <p className="font-semibold text-slate-700">Keranjang kamu masih kosong</p>
        <p className="text-sm text-slate-400">Yuk pilih menu favoritmu dari salah satu gerai.</p>
        <Button variant="primary" onClick={() => router.push("/")}>
          Jelajahi Gerai
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 pb-40">
      <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-100 bg-white/95 px-4 py-3 backdrop-blur">
        <button onClick={() => router.back()} className="rounded-full bg-slate-100 p-2">
          <ArrowLeft className="h-4 w-4 text-slate-700" />
        </button>
        <p className="text-sm font-semibold text-slate-900">Checkout Pesanan</p>
      </div>

      <div className="space-y-4 px-4 py-4">
        {isPriority && (
          <div className="flex items-center gap-2 rounded-xl bg-amber-100 px-4 py-3 text-amber-800">
            <Zap className="h-4 w-4 shrink-0 fill-amber-600 text-amber-600" />
            <p className="text-xs font-semibold">
              ⚡ Fasilitas Jalur Cepat (Prioritas Guru) Aktif
            </p>
          </div>
        )}

        <div>
          <p className="mb-2 text-xs font-semibold uppercase text-slate-400">
            {stand?.nama_stand ?? "Memuat gerai..."}
          </p>
          <div className="space-y-3">
            {items.map(({ menu, jumlah }) => {
              const fotoUrl = storageUrl(menu.foto);
              return (
                <div key={menu.id} className="flex gap-3 rounded-xl border border-slate-100 bg-white p-3">
                  <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                    {fotoUrl ? (
                      <Image src={fotoUrl} alt={menu.nama_menu} fill className="object-cover" sizes="64px" />
                    ) : (
                      <UtensilsCrossed className="h-5 w-5 text-slate-300" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <p className="text-sm font-semibold text-slate-900">{menu.nama_menu}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-slate-900">
                        {formatRupiah(menu.harga * jumlah)}
                      </p>
                      <div className="flex items-center gap-2 rounded-full bg-slate-50 px-1.5 py-1">
                        <button
                          onClick={() => decreaseItem(menu.id)}
                          className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-4 text-center text-sm font-semibold">{jumlah}</span>
                        <button
                          onClick={() => addItem(menu)}
                          className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-600 text-white shadow-sm"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => removeItem(menu.id)} className="self-start text-slate-300">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase text-slate-400">Catatan Pesanan</p>
          <Textarea
            placeholder="Contoh: tidak pakai sambal, dibungkus terpisah, dsb."
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
          />
        </div>

        <div className="rounded-xl border border-slate-100 bg-white p-4">
          <p className="mb-2 text-xs font-semibold uppercase text-slate-400">Rincian Harga</p>
          <div className="flex justify-between border-t border-dashed border-slate-200 pt-1.5 text-sm font-bold text-slate-900">
            <span>Total Bayar</span>
            <span>{formatRupiah(total)}</span>
          </div>
        </div>

        {submitError && <p className="text-sm text-rose-500">{submitError}</p>}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-100 bg-white p-4">
        <Button
          variant={isPriority ? "priority" : "primary"}
          className="w-full"
          size="lg"
          onClick={handleCheckout}
          disabled={submitting}
        >
          {submitting ? "Memproses Pesanan..." : `Buat Pesanan · ${formatRupiah(total)}`}
        </Button>
      </div>
    </div>
  );
}
