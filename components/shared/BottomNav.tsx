"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, ClipboardList, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";

const NAV_ITEMS = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/cart", label: "Keranjang", icon: ShoppingCart },
  { href: "/orders", label: "Pesanan", icon: ClipboardList },
  { href: "/profil", label: "Akun", icon: UserCircle },
];

export function BottomNav() {
  const pathname = usePathname();
  const totalQty = useCartStore((s) => s.totalQty());

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur pointer-events-auto">
      <div className="mx-auto flex max-w-md items-center justify-between gap-2 px-3 py-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-2xl px-3 py-2 text-[11px] font-semibold transition pointer-events-auto",
                active
                  ? "bg-sky-600 text-white shadow-[0_10px_20px_-12px_rgba(56,189,248,0.75)]"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <div className="relative pointer-events-none">
                <Icon className={cn("h-5 w-5", active && "fill-current")} />
                {href === "/cart" && totalQty > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] text-white">
                    {totalQty}
                  </span>
                )}
              </div>
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
