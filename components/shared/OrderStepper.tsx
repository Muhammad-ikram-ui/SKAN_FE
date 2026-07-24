import { Check } from "lucide-react";
import { OrderStatus } from "@/types";
import { cn } from "@/lib/utils";

const STEPS: { key: OrderStatus; label: string }[] = [
  { key: "pending", label: "Pesanan Dibuat" },
  { key: "diproses", label: "Diproses" },
  { key: "siap_diambil", label: "Siap Diambil" },
  { key: "selesai", label: "Selesai" },
];

export function OrderStepper({ status }: { status: OrderStatus }) {
  const currentIndex = STEPS.findIndex((s) => s.key === status);

  if (status === "dibatalkan") {
    return (
      <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
        Pesanan ini telah dibatalkan.
      </div>
    );
  }

  return (
    <div className="flex items-start">
      {STEPS.map((step, idx) => {
        const done = idx < currentIndex;
        const active = idx === currentIndex;
        return (
          <div key={step.key} className="flex flex-1 flex-col items-center last:flex-none">
            <div className="flex w-full items-center">
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors",
                  done && "border-emerald-600 bg-emerald-600 text-white",
                  active && "border-sky-600 bg-sky-600 text-white animate-pulse-soft",
                  !done && !active && "border-slate-200 bg-white text-slate-300"
                )}
              >
                {done ? <Check className="h-4 w-4" /> : idx + 1}
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1",
                    idx < currentIndex ? "bg-emerald-600" : "bg-slate-200"
                  )}
                />
              )}
            </div>
            <p
              className={cn(
                "mt-1.5 text-center text-[11px] font-medium",
                active ? "text-sky-700" : done ? "text-emerald-700" : "text-slate-400"
              )}
            >
              {step.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
