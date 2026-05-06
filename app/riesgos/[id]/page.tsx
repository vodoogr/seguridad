import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "../../components/AppShell";
import { PageHeader } from "../../components/PageHeader";
import { RiskLevel, StatusBadge } from "../../components/Tables";
import { getRisk } from "../../../lib/repository";

export default async function RiskDetailPage({ params }: { params: { id: string } }) {
  const risk = await getRisk(params.id);
  if (!risk) notFound();

  return (
    <AppShell>
      <PageHeader eyebrow="Detalle de riesgo" title={risk.id} action="Nueva accion" />
      <article className="panel detail">
        <Link href="/riesgos" className="back-link">Volver a riesgos</Link>
        <h2>{risk.risk}</h2>
        <dl>
          <div><dt>Area</dt><dd>{risk.area}</dd></div>
          <div><dt>Nivel</dt><dd><RiskLevel level={risk.level} /></dd></div>
          <div><dt>Estado</dt><dd><StatusBadge status={risk.status} /></dd></div>
          <div><dt>Responsable</dt><dd>{risk.owner}</dd></div>
          <div><dt>Fecha limite</dt><dd>{risk.due}</dd></div>
        </dl>
      </article>
    </AppShell>
  );
}
