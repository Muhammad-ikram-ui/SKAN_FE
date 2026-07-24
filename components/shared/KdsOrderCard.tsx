"use client";

import { Order, OrderStatus, isPriorityOrder } from "@/types";
import { formatRupiah, formatWaktu, cn } from "@/lib/utils";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

const NEXT_ACTION: Partial<Record<OrderStatus, { label: string; next: OrderStatus }>> = {
  pending: { label: "Terima Pesanan", next: "diproses" },
  diproses: { label: "Siap Diambil", next: "siap_diambil" },
  siap_diambil: { label: "Selesai", next: "selesai" },
};

export function KdsOrderCard({
  order,
  onUpdateStatus,
}: {
  order: Order;
  onUpdateStatus: (orderId: number, status: OrderStatus) => void;
}) {
  const action = NEXT_ACTION[order.status];
  const priority = isPriorityOrder(order);

  return (
    <Card
      className={cn(
        "p-4",
        priority && "border-amber-300 bg-amber-50/60 ring-1 ring-amber-200"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-mono text-sm font-bold text-slate-900">
              {order.kode_transaksi}
            </p>
            {priority && <PriorityBadge />}
          </div>
          <p className="text-xs text-slate-500">
            {order.user?.name ?? "Pengguna"} · {formatWaktu(order.created_at)}
          </p>
        </div>
        <p className="text-sm font-bold text-slate-900">{formatRupiah(order.total_harga)}</p>
      </div>

      <ul className="mt-3 space-y-1 border-t border-dashed border-slate-200 pt-3">
        {order.details?.map((item) => (
          <li key={item.id} className="flex justify-between text-sm">
            <span className="text-slate-700">
              {item.jumlah}x {item.menu?.nama_menu ?? `Menu #${item.menu_id}`}
            </span>
          </li>
        ))}
      </ul>

      {order.catatan && (
        <p className="mt-2 text-xs italic text-slate-400">Catatan: {order.catatan}</p>
      )}

      {action && (
        <Button
          className="mt-3 w-full"
          variant={priority ? "priority" : "primary"}
          onClick={() => onUpdateStatus(order.id, action.next)}
        >
          {action.label}
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </Card>
  );
}
