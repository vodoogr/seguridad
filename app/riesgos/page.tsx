import { AppShell } from "../components/AppShell";
import { PageHeader } from "../components/PageHeader";
import { RiskLevel, StatusBadge } from "../components/Tables";
import { controlRisk, createRisk, deleteRisk } from "../actions";
import { getRisks } from "../../lib/repository";
import { Check, ClipboardPlus, Trash2 } from "lucide-react";
import Link from "next/link";

export default async function RiesgosPage() {
  const risks = await getRisks();

  return (
    <AppShell>
      <PageHeader eyebrow="Riesgos" title="Registro y evaluacion de riesgos" action="Nuevo riesgo" actionHref="/riesgos/nuevo" />
      <form action={createRisk} className="form-panel">
        <input name="id" placeholder="Codigo" required />
        <input name="area" placeholder="Area" required />
        <input name="risk" placeholder="Riesgo detectado" required />
        <select name="level" defaultValue="Medio">
          <option>Critico</option>
          <option>Alto</option>
          <option>Medio</option>
          <option>Bajo</option>
        </select>
        <input name="owner" placeholder="Responsable" required />
        <input name="due_date" type="date" required />
        <select name="status" defaultValue="Abierto">
          <option>Abierto</option>
          <option>En curso</option>
          <option>Controlado</option>
        </select>
        <button type="submit">Guardar riesgo</button>
      </form>
      <article className="panel">
        <div className="panel-title">
          <h2>Inventario de riesgos</h2>
          <span>{risks.length} registros</span>
        </div>
        <div className="table">
          <div className="row risks-head head">
            <span>Codigo</span>
            <span>Area</span>
            <span>Riesgo</span>
            <span>Nivel</span>
            <span>Estado</span>
            <span>Responsable</span>
            <span>Acciones</span>
          </div>
          {risks.map((risk) => (
            <div className="row risks-head" key={risk.id}>
              <span>{risk.id}</span>
              <span>{risk.area}</span>
              <Link href={`/riesgos/${risk.id}`}>{risk.risk}</Link>
              <RiskLevel level={risk.level} />
              <StatusBadge status={risk.status} />
              <span>{risk.owner}</span>
              <div className="inline-actions">
                <span>{risk.due}</span>
                <Link
                  aria-label="Pasar a acciones"
                  className="icon-button"
                  href={`/acciones/nueva?risk_id=${encodeURIComponent(risk.id)}`}
                  title="Crear accion vinculada"
                >
                  <ClipboardPlus size={16} />
                </Link>
                {risk.status !== "Controlado" ? (
                  <form action={controlRisk} className="inline-form">
                    <input name="id" type="hidden" value={risk.id} />
                    <button aria-label="Controlar riesgo" className="icon-button" type="submit" title="Controlar">
                      <Check size={16} />
                    </button>
                  </form>
                ) : null}
                <form action={deleteRisk} className="inline-form">
                  <input name="id" type="hidden" value={risk.id} />
                  <button aria-label="Borrar riesgo" className="icon-button danger" type="submit" title="Borrar">
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
