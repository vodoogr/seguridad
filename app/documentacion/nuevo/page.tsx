import { AppShell } from "../../components/AppShell";
import { PageHeader } from "../../components/PageHeader";
import { createDocument } from "../../actions";

export default function NuevoDocumentoPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Nuevo documento" title="Registrar documento preventivo" action="Ver documentacion" actionHref="/documentacion" />
      <form action={createDocument} className="form-panel expanded">
        <input name="name" placeholder="Nombre del documento" required />
        <input name="type" placeholder="Tipo" required />
        <button type="submit">Guardar documento</button>
      </form>
    </AppShell>
  );
}
