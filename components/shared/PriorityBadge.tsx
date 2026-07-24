import { Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function PriorityBadge({ className }: { className?: string }) {
  return (
    <Badge variant="priority" className={className}>
      <Zap className="h-3 w-3 fill-amber-600 text-amber-600" />
      PRIORITAS (GURU)
    </Badge>
  );
}
