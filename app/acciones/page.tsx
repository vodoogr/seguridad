import { AppShell } from "../components/AppShell";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/Tables";
import { closeCorrectiveAction, createCorrectiveAction, deleteCorrectiveAction } from "../actions";
import { getActions, getRisks } from "../../lib/repository";
import Link from "next/link";
import { ArrowDownAZ, ArrowUpAZ, Check, Filter, Trash2 } from "lucide-react";

export default async function AccionesPage({
  searchParams
}: {
  searchParams?: {
    owner?: string;
    status?: string;
    area?: string;
    sort?: string;
    dir?: string;
  };
}) {
  const actions = await getActions();
  const risks = await getRisks();
  const selectedOwner = searchParams?.owner?.trim() ?? "";
  const selectedStatus = searchParams?.status?.trim() ?? "";
  const selectedArea = searchParams?.area?.trim() ?? "";
  const sortField = searchParams?.sort?.trim() ?? "due";
  const sortDir = searchParams?.dir?.trim() === "desc" ? "desc" : "asc";
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
  }).sort((left, right) => compareActions(left, right, sortField, sortDir));

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
          <input name="sort" type="hidden" value={sortField} />
          <input name="dir" type="hidden" value={sortDir} />
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
            <SortHeader currentDir={sortDir} currentField={sortField} field="id" label="Codigo" query={buildSortQuery({ owner: selectedOwner, status: selectedStatus, area: selectedArea }, sortField, sortDir, "id")} />
            <SortHeader currentDir={sortDir} currentField={sortField} field="task" label="Medida" query={buildSortQuery({ owner: selectedOwner, status: selectedStatus, area: selectedArea }, sortField, sortDir, "task")} />
            <SortHeader currentDir={sortDir} currentField={sortField} field="risk" label="Riesgo" query={buildSortQuery({ owner: selectedOwner, status: selectedStatus, area: selectedArea }, sortField, sortDir, "risk")} />
            <SortHeader currentDir={sortDir} currentField={sortField} field="owner" label="Responsable" query={buildSortQuery({ owner: selectedOwner, status: selectedStatus, area: selectedArea }, sortField, sortDir, "owner")} />
            <SortHeader currentDir={sortDir} currentField={sortField} field="due" label="Vencimiento" query={buildSortQuery({ owner: selectedOwner, status: selectedStatus, area: selectedArea }, sortField, sortDir, "due")} />
            <SortHeader currentDir={sortDir} currentField={sortField} field="status" label="Estado" query={buildSortQuery({ owner: selectedOwner, status: selectedStatus, area: selectedArea }, sortField, sortDir, "status")} />
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

function compareActions(
  left: { id: string; task: string; risk: string; owner: string; due: string; status: string },
  right: { id: string; task: string; risk: string; owner: string; due: string; status: string },
  field: string,
  dir: string
) {
  const direction = dir === "desc" ? -1 : 1;
  const getValue = (item: typeof left) => {
    if (field === "id") return item.id;
    if (field === "task") return item.task;
    if (field === "risk") return item.risk;
    if (field === "owner") return item.owner;
    if (field === "status") return item.status;
    if (field === "due") return item.due.split("/").reverse().join("-");
    return item.due.split("/").reverse().join("-");
  };

  return getValue(left).localeCompare(getValue(right)) * direction;
}

function buildSortQuery(
  filters: { owner: string; status: string; area: string },
  currentField: string,
  currentDir: string,
  nextField: string
) {
  const dir = currentField === nextField && currentDir === "asc" ? "desc" : "asc";
  const params = new URLSearchParams();
  if (filters.owner) params.set("owner", filters.owner);
  if (filters.status) params.set("status", filters.status);
  if (filters.area) params.set("area", filters.area);
  params.set("sort", nextField);
  params.set("dir", dir);
  return `/acciones?${params.toString()}`;
}

function SortHeader({
  label,
  field,
  currentField,
  currentDir,
  query
}: {
  label: string;
  field: string;
  currentField: string;
  currentDir: string;
  query: string;
}) {
  const active = currentField === field;
  const Icon = active && currentDir === "desc" ? ArrowDownAZ : ArrowUpAZ;

  return (
    <Link className={`sort-link${active ? " active" : ""}`} href={query}>
      {label}
      <Icon size={14} />
    </Link>
  );
}
