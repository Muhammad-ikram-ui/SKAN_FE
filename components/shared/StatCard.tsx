import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = "sky",
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: "sky" | "amber" | "emerald" | "slate";
}) {
  const accentMap = {
    sky: "bg-sky-50 text-sky-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    slate: "bg-slate-100 text-slate-600",
  };

  return (
    <Card className="flex items-center gap-4 p-5">
      <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", accentMap[accent])}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-sm text-slate-400">{label}</p>
      </div>
    </Card>
  );
}
