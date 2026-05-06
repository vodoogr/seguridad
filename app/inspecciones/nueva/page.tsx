import { AppShell } from "../../components/AppShell";
import { PageHeader } from "../../components/PageHeader";
import { createInspection } from "../../actions";

export default function NuevaInspeccionPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Nueva inspeccion" title="Programar inspeccion" action="Ver inspecciones" actionHref="/inspecciones" />
      <form action={createInspection} className="form-panel expanded">
        <input name="id" placeholder="Codigo: I-015" required />
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
    </AppShell>
  );
}
