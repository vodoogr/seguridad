import { AppShell } from "../components/AppShell";
import { PageHeader } from "../components/PageHeader";
import { RiskLevel, StatusBadge } from "../components/Tables";
import { controlRisk, createRisk } from "../actions";
import { getRisks } from "../../lib/repository";
import Link from "next/link";

export default async function RiesgosPage() {
  const risks = await getRisks();

  return (
    <AppShell>
      <PageHeader eyebrow="Riesgos" title="Registro y evaluacion de riesgos" action="Nuevo riesgo" />
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
            <span>Fecha limite</span>
          </div>
          {risks.map((risk) => (
            <div className="row risks-head" key={risk.id}>
              <span>{risk.id}</span>
              <span>{risk.area}</span>
              <Link href={`/riesgos/${risk.id}`}>{risk.risk}</Link>
              <RiskLevel level={risk.level} />
              <StatusBadge status={risk.status} />
              <span>{risk.owner}</span>
              <form action={controlRisk} className="inline-form">
                <input name="id" type="hidden" value={risk.id} />
                <span>{risk.due}</span>
                <button type="submit">Controlar</button>
              </form>
            </div>
          ))}
        </div>
      </article>
    </AppShell>
  );
}
