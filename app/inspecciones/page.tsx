import { AppShell } from "../components/AppShell";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/Tables";
import { inspections } from "../data";

export default function InspeccionesPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Inspecciones" title="Planificacion y resultados de inspecciones" action="Nueva inspeccion" />
      <section className="cards-list">
        {inspections.map((item) => (
          <article className="panel item-card" key={item.id}>
            <div>
              <span className="code">{item.id}</span>
              <h2>{item.area}</h2>
              <p>{item.type}</p>
            </div>
            <div className="item-meta">
              <span>{item.date}</span>
              <span>{item.owner}</span>
              <StatusBadge status={item.result} />
            </div>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
