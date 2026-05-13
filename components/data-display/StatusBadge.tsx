import { Badge } from "../ui/badge";

export function StatusBadgeV2({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const tone =
    normalized.includes("crit") || normalized.includes("abierta") ? "danger" :
    normalized.includes("pendiente") || normalized.includes("curso") ? "warning" :
    normalized.includes("controlado") || normalized.includes("cerrada") || normalized.includes("apta") ? "success" :
    "info";

  return <Badge tone={tone}>{status}</Badge>;
}
