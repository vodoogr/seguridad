import { AppShell } from "../../components/AppShell";
import { PageHeader } from "../../components/PageHeader";
import { createIncident } from "../../actions";

export default function NuevaIncidenciaPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Nueva incidencia" title="Registrar incidencia laboral" action="Ver incidencias" actionHref="/incidencias" />
      <form action={createIncident} className="form-panel expanded">
        <input name="id" placeholder="Codigo: INC-002" required />
        <input name="title" placeholder="Titulo" required />
        <input name="area" placeholder="Area" required />
        <select name="severity" defaultValue="Media">
          <option>Baja</option>
          <option>Media</option>
          <option>Alta</option>
          <option>Critica</option>
        </select>
        <input name="owner" placeholder="Responsable" required />
        <input name="incident_date" type="date" required />
        <select name="status" defaultValue="Abierta">
          <option>Abierta</option>
          <option>Investigacion</option>
          <option>Cerrada</option>
        </select>
        <textarea name="description" placeholder="Descripcion de la incidencia" />
        <button type="submit">Guardar incidencia</button>
      </form>
    </AppShell>
  );
}
