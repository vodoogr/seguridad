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
    owner?: string;
    status?: string;
    area?: string;
  };
}) {
  const actions = await getActions();
  const risks = await getRisks();
  const selectedOwner = searchParams?.owner?.trim() ?? "";
  const selectedStatus = searchParams?.status?.trim() ?? "";
  const selectedArea = searchParams?.area?.trim() ?? "";
  const owners = Array.from(new Set(actions.map((action) => action.owner))).sort((a, b) => a.localeCompare(b));
  const areaOptions = ["ALM", "EXP", "RECEP", "PERS", "SPV"];
  const riskAreaById = new Map(risks.map((risk) => [risk.id, risk.area]));

  const filteredActions = actions.filter((action) => {
    if (selectedOwner && action.owner !== selectedOwner) return false;
    if (selectedStatus && action.status !== selectedStatus) return false;
    if (selectedArea) {
      const area = riskAreaById.get(action.risk) ?? "";
      if (!area.toUpperCase().startsWith(resolveAreaPrefix(selectedArea))) return false;
    }
    return true;
  });

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
          <select defaultValue={selectedOwner} name="owner">
            <option value="">Todos los responsables</option>
            {owners.map((owner) => (
              <option key={owner} value={owner}>
                {owner}
              </option>
            ))}
          </select>
          <select defaultValue={selectedStatus} name="status">
            <option value="">Todas</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Cerrada">Cerrada</option>
            <option value="En curso">En curso</option>
            <option value="Planificada">Planificada</option>
          </select>
          <select defaultValue={selectedArea} name="area">
            <option value="">Todas las zonas</option>
            {areaOptions.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
          <button type="submit">Ver</button>
          <Link
            className="button-link secondary-link"
            href={`/acciones/reporte?owner=${encodeURIComponent(selectedOwner)}&status=${encodeURIComponent(selectedStatus)}&area=${encodeURIComponent(selectedArea)}`}
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

function resolveAreaPrefix(value: string) {
  if (value === "EXP") return "EXPEDICION";
  if (value === "RECEP") return "RECEPCION";
  if (value === "ALM") return "ALMACEN";
  if (value === "PERS") return "PERSONAL";
  if (value === "SPV") return "POSTVENTA";
  return value;
}
