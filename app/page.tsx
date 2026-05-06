import { CheckCircle2 } from "lucide-react";
import { AppShell } from "./components/AppShell";
import { PageHeader } from "./components/PageHeader";
import { RiskLevel } from "./components/Tables";
import { metrics } from "./data";
import { getCommittee, getDashboardStats, getRisks } from "../lib/repository";

export default async function Home() {
  const [committee, risks, stats] = await Promise.all([getCommittee(), getRisks(), getDashboardStats()]);

  return (
    <AppShell>
      <PageHeader eyebrow="Panel operativo" title="Control de riesgos laborales del almacen" />

      <section className="metrics">
        {metrics.map((item) => {
          const Icon = item.icon;
          const stat = stats.find((entry) => entry.label === item.label);
          return (
            <article className="metric" key={item.label}>
              <Icon size={22} />
              <span>{item.label}</span>
              <strong>{stat?.value ?? item.value}</strong>
              <small>{stat?.detail ?? item.detail}</small>
            </article>
          );
        })}
      </section>

      <section className="grid">
        <article className="panel large">
          <div className="panel-title">
            <h2>Matriz de riesgos prioritarios</h2>
            <span>Actualizado hoy</span>
          </div>
          <div className="table">
            <div className="row head">
              <span>Area</span>
              <span>Riesgo</span>
              <span>Nivel</span>
              <span>Responsable</span>
              <span>Fecha</span>
            </div>
            {risks.map((risk) => (
              <div className="row" key={risk.id}>
                <span>{risk.area}</span>
                <span>{risk.risk}</span>
                <RiskLevel level={risk.level} />
                <span>{risk.owner}</span>
                <span>{risk.due}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-title">
            <h2>Proxima reunion</h2>
          </div>
          <strong className="date">{committee.nextDate}</strong>
          <ul>
            {committee.agenda.map((item) => (
              <li key={item}>
                <CheckCircle2 size={17} />
                {item}
              </li>
            ))}
          </ul>
        </article>
      </section>
    </AppShell>
  );
}
