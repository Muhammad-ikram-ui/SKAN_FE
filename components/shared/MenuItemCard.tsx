"use client";

import Image from "next/image";
import { Plus, Minus, UtensilsCrossed } from "lucide-react";
import { MenuItem } from "@/types";
import { formatRupiah } from "@/lib/utils";
import { storageUrl } from "@/lib/api";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";

export function MenuItemCard({ menu }: { menu: MenuItem }) {
  const { items, addItem, decreaseItem } = useCartStore();
  const inCart = items.find((i) => i.menu.id === menu.id);
  const fotoUrl = storageUrl(menu.foto);
  const tersedia = menu.status === "tersedia";

  return (
    <div className="flex gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-soft">
      <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
        {fotoUrl ? (
          <Image src={fotoUrl} alt={menu.nama_menu} fill className="object-cover" sizes="80px" />
        ) : (
          <UtensilsCrossed className="h-6 w-6 text-slate-300" />
        )}
        {!tersedia && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60">
            <span className="text-[10px] font-semibold text-white">Habis</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">{menu.nama_menu}</p>
          {menu.deskripsi && (
            <p className="line-clamp-1 text-xs text-slate-400">{menu.deskripsi}</p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-slate-900">{formatRupiah(menu.harga)}</p>
          {tersedia ? (
            inCart ? (
              <div className="flex items-center gap-2 rounded-full bg-sky-50 px-1.5 py-1">
                <button
                  onClick={() => decreaseItem(menu.id)}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-sky-600 shadow-sm"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-4 text-center text-sm font-semibold text-sky-700">
                  {inCart.jumlah}
                </span>
                <button
                  onClick={() => addItem(menu)}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-600 text-white shadow-sm"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <Button size="sm" variant="primary" onClick={() => addItem(menu)} className="h-8">
                <Plus className="h-3.5 w-3.5" /> Tambah
              </Button>
            )
          ) : (
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-400">
              Tidak tersedia
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
