import type { ReactNode } from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

export function StatusCard({
  title,
  subtitle,
  status,
  icon
}: {
  title: string;
  subtitle?: string;
  status: string;
  icon?: ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        {icon ? <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-700">{icon}</div> : null}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-slate-950">{title}</h3>
          {subtitle ? <p className="mt-1 truncate text-sm text-slate-600">{subtitle}</p> : null}
        </div>
        <Badge tone="info">{status}</Badge>
      </CardContent>
    </Card>
  );
}
