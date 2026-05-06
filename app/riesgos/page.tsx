import { AppShell } from "../components/AppShell";
import { PageHeader } from "../components/PageHeader";
import { RiskLevel, StatusBadge } from "../components/Tables";
import { risks } from "../data";

export default function RiesgosPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Riesgos" title="Registro y evaluacion de riesgos" action="Nuevo riesgo" />
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
              <span>{risk.risk}</span>
              <RiskLevel level={risk.level} />
              <StatusBadge status={risk.status} />
              <span>{risk.owner}</span>
              <span>{risk.due}</span>
            </div>
          ))}
        </div>
      </article>
    </AppShell>
  );
}
