import type { ComponentType } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

export function KpiCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "info"
}: {
  label: string;
  value: string;
  detail?: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  tone?: "neutral" | "info" | "success" | "warning" | "danger";
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-slate-600">{label}</CardTitle>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
          <Icon size={20} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-slate-950">{value}</div>
        {detail ? <Badge className="mt-3" tone={tone}>{detail}</Badge> : null}
      </CardContent>
    </Card>
  );
}
