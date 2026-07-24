import { MobileHeader } from "@/components/shared/MobileHeader";
import { BottomNav } from "@/components/shared/BottomNav";

export function MobileShell({
  children,
  showHeader = true,
}: {
  children: React.ReactNode;
  showHeader?: boolean;
}) {
  return (
    <div className="relative min-h-screen w-full bg-slate-50 pb-32">
      {showHeader && <MobileHeader />}
      <main className="relative z-0">{children}</main>
      <BottomNav />
    </div>
  );
}
