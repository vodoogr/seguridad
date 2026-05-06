import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "../../components/AppShell";
import { PageHeader } from "../../components/PageHeader";
import { StatusBadge } from "../../components/Tables";
import { getInspection } from "../../../lib/repository";

export default async function InspectionDetailPage({ params }: { params: { id: string } }) {
  const inspection = await getInspection(params.id);
  if (!inspection) notFound();

  return (
    <AppShell>
      <PageHeader eyebrow="Detalle de inspeccion" title={inspection.id} action="Registrar resultado" />
      <article className="panel detail">
        <Link href="/inspecciones" className="back-link">Volver a inspecciones</Link>
        <h2>{inspection.area}</h2>
        <dl>
          <div><dt>Tipo</dt><dd>{inspection.type}</dd></div>
          <div><dt>Fecha</dt><dd>{inspection.date}</dd></div>
          <div><dt>Responsable</dt><dd>{inspection.owner}</dd></div>
          <div><dt>Resultado</dt><dd><StatusBadge status={inspection.result} /></dd></div>
        </dl>
      </article>
    </AppShell>
  );
}
