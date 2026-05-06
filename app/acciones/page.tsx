import { AppShell } from "../components/AppShell";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/Tables";
import { createCorrectiveAction } from "../actions";
import { getActions } from "../../lib/repository";

export default async function AccionesPage() {
  const actions = await getActions();

  return (
    <AppShell>
      <PageHeader eyebrow="Acciones correctoras" title="Seguimiento de medidas preventivas" action="Nueva accion" />
      <form action={createCorrectiveAction} className="form-panel">
        <input name="id" placeholder="Codigo" required />
        <input name="task" placeholder="Medida correctora" required />
        <input name="risk_id" placeholder="Riesgo asociado" />
        <input name="owner" placeholder="Responsable" required />
        <input name="due_date" type="date" required />
        <select name="status" defaultValue="Pendiente">
          <option>Pendiente</option>
          <option>En curso</option>
          <option>Planificada</option>
          <option>Cerrada</option>
        </select>
        <button type="submit">Guardar accion</button>
      </form>
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
