import { AppShell } from "../../components/AppShell";
import { PageHeader } from "../../components/PageHeader";

export default function NuevaReunionPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Nueva reunion" title="Preparar reunion del comite" action="Ver comite" actionHref="/comite" />
      <article className="panel">
        <h2>Modulo pendiente de actas</h2>
        <p className="muted-text">Siguiente paso: guardar reuniones, asistentes, orden del dia y actas en Neon.</p>
      </article>
    </AppShell>
  );
}
