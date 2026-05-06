import { AppShell } from "../../components/AppShell";
import { PageHeader } from "../../components/PageHeader";
import { createRisk } from "../../actions";

export default function NuevoRiesgoPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Nuevo riesgo" title="Registrar nuevo riesgo" action="Ver riesgos" actionHref="/riesgos" />
      <form action={createRisk} className="form-panel expanded">
        <input name="id" placeholder="Codigo: R-004" required />
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
    </AppShell>
  );
}
