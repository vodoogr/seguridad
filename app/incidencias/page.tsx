import { AppShell } from "../components/AppShell";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/Tables";
import { deleteIncident } from "../actions";
import { getIncidents } from "../../lib/repository";
import { Trash2 } from "lucide-react";

export default async function IncidenciasPage() {
  const incidents = await getIncidents();

  return (
    <AppShell>
      <PageHeader eyebrow="Incidencias" title="Registro de incidentes y accidentes" action="Nueva incidencia" actionHref="/incidencias/nueva" />
      <section className="cards-list">
        {incidents.map((incident) => (
          <article className="panel item-card" key={incident.id}>
            <div>
              <span className="code">{incident.id}</span>
              <h2>{incident.title}</h2>
              <p>{incident.area} · {incident.severity} · {incident.owner}</p>
            </div>
            <div className="item-meta">
              <span>{incident.date}</span>
              <StatusBadge status={incident.status} />
              <form action={deleteIncident}>
                <input name="id" type="hidden" value={incident.id} />
                <button aria-label="Borrar incidencia" className="icon-button danger" title="Borrar incidencia" type="submit">
                  <Trash2 size={16} />
                </button>
              </form>
            </div>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
