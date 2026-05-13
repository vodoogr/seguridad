import type { ReactNode } from "react";
import { Inbox } from "lucide-react";
import { Card, CardContent } from "../ui/card";

export function EmptyState({
  title,
  description,
  action
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center px-6 py-12 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
          <Inbox size={24} />
        </div>
        <h3 className="text-base font-semibold text-slate-950">{title}</h3>
        {description ? <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">{description}</p> : null}
        {action ? <div className="mt-5">{action}</div> : null}
      </CardContent>
    </Card>
  );
}
