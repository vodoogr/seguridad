import { AppShell } from "../components/AppShell";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/Tables";
import { actions } from "../data";

export default function AccionesPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Acciones correctoras" title="Seguimiento de medidas preventivas" action="Nueva accion" />
      <article className="panel">
        <div className="panel-title">
          <h2>Plan de accion</h2>
          <span>{actions.length} medidas activas</span>
        </div>
        <div className="table">
          <div className="row actions-head head">
            <span>Codigo</span>
            <span>Medida</span>
            <span>Riesgo</span>
            <span>Responsable</span>
            <span>Vencimiento</span>
            <span>Estado</span>
          </div>
          {actions.map((action) => (
            <div className="row actions-head" key={action.id}>
              <span>{action.id}</span>
              <span>{action.task}</span>
              <span>{action.risk}</span>
              <span>{action.owner}</span>
              <span>{action.due}</span>
              <StatusBadge status={action.status} />
            </div>
          ))}
        </div>
      </article>
    </AppShell>
  );
}
