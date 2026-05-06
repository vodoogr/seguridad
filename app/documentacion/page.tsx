import { AppShell } from "../components/AppShell";
import { PageHeader } from "../components/PageHeader";
import { documents } from "../data";

export default function DocumentacionPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Documentacion" title="Control documental de prevencion" action="Subir documento" />
      <section className="cards-list">
        {documents.map((doc) => {
          const Icon = doc.icon;
          return (
            <article className="panel item-card" key={doc.name}>
              <div className="document-title">
                <Icon size={22} />
                <div>
                  <h2>{doc.name}</h2>
                  <p>{doc.type}</p>
                </div>
              </div>
              <div className="item-meta">
                <span>Actualizado</span>
                <strong>{doc.updated}</strong>
              </div>
            </article>
          );
        })}
      </section>
    </AppShell>
  );
}
