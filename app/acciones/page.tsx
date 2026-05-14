import { AppShell } from "../components/AppShell";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/Tables";
import { closeCorrectiveAction, createCorrectiveAction, deleteCorrectiveAction } from "../actions";
import { getActions, getRisks } from "../../lib/repository";
import Link from "next/link";
import { Check, Filter, Trash2 } from "lucide-react";

export default async function AccionesPage({
  searchParams
}: {
  searchParams?: {
    status?: string;
    export?: string;
  };
}) {
  const actions = await getActions();
  const risks = await getRisks();
  const selectedStatus = searchParams?.status?.trim() ?? "";
  const filteredActions = selectedStatus ? actions.filter((action) => action.status === selectedStatus) : actions;

  return (
    <AppShell>
      <PageHeader eyebrow="Acciones correctoras" title="Seguimiento de medidas preventivas" action="Nueva accion" actionHref="/acciones/nueva" />
      <form action={createCorrectiveAction} className="form-panel">
        <input name="id" placeholder="Codigo" required />
        <select name="risk_id" defaultValue="">
          <option value="">Riesgo asociado por codigo</option>
          {risks.map((risk) => (
            <option key={risk.id} value={risk.id}>
              {risk.id} - {risk.risk}
            </option>
          ))}
        </select>
        <input name="task" placeholder="Medida" required />
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

      <article className="panel filter-panel">
        <div className="panel-title">
          <h2>
            <Filter size={18} />
            Reporte
          </h2>
          <span>{filteredActions.length} acciones</span>
        </div>
        <form className="filter-form" method="get">
          <select defaultValue={selectedStatus} name="status">
            <option value="">Todas</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Cerrada">Cerrada</option>
            <option value="En curso">En curso</option>
            <option value="Planificada">Planificada</option>
          </select>
          <button type="submit">Ver</button>
          <Link
            className="button-link secondary-link"
            href={`/acciones/reporte${selectedStatus ? `?status=${encodeURIComponent(selectedStatus)}` : ""}`}
          >
            Exportar PDF
          </Link>
        </form>
      </article>

      <article className="panel">
        <div className="panel-title">
          <h2>Plan de accion</h2>
          <span>{filteredActions.length} medidas activas</span>
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
          {filteredActions.map((action) => (
            <div className="row actions-head" key={action.id}>
              <span>{action.id}</span>
              <span>{action.task}</span>
              <span>{action.risk}</span>
              <span>{action.owner}</span>
              <span>{action.due}</span>
              <div className="inline-actions">
                <form action={closeCorrectiveAction} className="inline-form">
                  <input name="id" type="hidden" value={action.id} />
                  <StatusBadge status={action.status} />
                  <button type="submit">
                    <Check size={16} />
                    Cerrar
                  </button>
                </form>
                <form action={deleteCorrectiveAction} className="inline-form">
                  <input name="id" type="hidden" value={action.id} />
                  <button className="icon-button danger" type="submit" title="Borrar accion" aria-label="Borrar accion">
                    <Trash2 size={16} />
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </article>
    </AppShell>
  );
}
