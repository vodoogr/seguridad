import { FileText } from "lucide-react";
import { AppShell } from "../components/AppShell";
import { PageHeader } from "../components/PageHeader";
import { createDocument } from "../actions";
import { getDocuments } from "../../lib/repository";

export default async function DocumentacionPage() {
  const documents = await getDocuments();

  return (
    <AppShell>
      <PageHeader eyebrow="Documentacion" title="Control documental de prevencion" action="Subir documento" actionHref="/documentacion/nuevo" />
      <form action={createDocument} className="form-panel short">
        <input name="name" placeholder="Nombre del documento" required />
        <input name="type" placeholder="Tipo" required />
        <input accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" name="file" type="file" required />
        <button type="submit">Subir documento</button>
      </form>
      <section className="cards-list">
        {documents.map((doc) => {
          return (
            <article className="panel item-card" key={doc.name}>
              <div className="document-title">
                <FileText size={22} />
                <div>
                  <h2>{doc.name}</h2>
                  <p>{doc.type}{doc.fileName ? ` · ${doc.fileName}` : ""}</p>
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
