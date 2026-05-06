import { FileWarning } from "lucide-react";
import Link from "next/link";

export function PageHeader({
  eyebrow,
  title,
  action = "Registrar incidencia",
  actionHref = "/incidencias/nueva"
}: {
  eyebrow: string;
  title: string;
  action?: string;
  actionHref?: string;
}) {
  return (
    <header className="topbar">
      <div>
        <p>{eyebrow}</p>
        <h1>{title}</h1>
      </div>
      <Link className="button-link" href={actionHref}>
        <FileWarning size={18} />
        {action}
      </Link>
    </header>
  );
}
