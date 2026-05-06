import { AppShell } from "../components/AppShell";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/Tables";
import { createInspection } from "../actions";
import { getInspections } from "../../lib/repository";

export default async function InspeccionesPage() {
  const inspections = await getInspections();

  return (
    <AppShell>
      <PageHeader eyebrow="Inspecciones" title="Planificacion y resultados de inspecciones" action="Nueva inspeccion" />
      <form action={createInspection} className="form-panel">
        <input name="id" placeholder="Codigo" required />
        <input name="area" placeholder="Area" required />
        <input name="type" placeholder="Tipo de inspeccion" required />
        <input name="inspection_date" type="date" required />
        <input name="owner" placeholder="Responsable" required />
        <select name="result" defaultValue="Programada">
          <option>Programada</option>
          <option>Apta</option>
          <option>Con observaciones</option>
          <option>No apta</option>
        </select>
        <button type="submit">Guardar inspeccion</button>
      </form>
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
