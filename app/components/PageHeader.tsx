import { FileWarning } from "lucide-react";

export function PageHeader({
  eyebrow,
  title,
  action = "Registrar incidencia"
}: {
  eyebrow: string;
  title: string;
  action?: string;
}) {
  return (
    <header className="topbar">
      <div>
        <p>{eyebrow}</p>
        <h1>{title}</h1>
      </div>
      <button>
        <FileWarning size={18} />
        {action}
      </button>
    </header>
  );
}
