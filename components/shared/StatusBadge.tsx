import { Badge } from "@/components/ui/badge";
import { OrderStatus, STATUS_LABEL } from "@/types";

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <Badge variant={status}>{STATUS_LABEL[status]}</Badge>;
}
