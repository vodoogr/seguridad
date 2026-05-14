import { AppShell } from "../../components/AppShell";
import { PageHeader } from "../../components/PageHeader";
import { createCorrectiveAction } from "../../actions";

export default function NuevaAccionPage({ searchParams }: { searchParams?: { risk_id?: string } }) {
  const riskId = searchParams?.risk_id ?? "";

  return (
    <AppShell>
      <PageHeader eyebrow="Nueva accion" title="Crear medida preventiva o correctora" action="Ver acciones" actionHref="/acciones" />
      <form action={createCorrectiveAction} className="form-panel expanded">
        <input name="id" placeholder="Codigo: A-022" required />
        <input name="task" placeholder="Medida correctora" required />
        <input defaultValue={riskId} name="risk_id" placeholder="Riesgo asociado" />
        <input name="owner" placeholder="Responsable" required />
        <input name="due_date" type="date" required />
        <select name="status" defaultValue="Pendiente">
          <option>Pendiente</option>
          <option>En curso</option>
          <option>Planificada</option>
          <option>Cerrada</option>
        </select>
        <button type="submit">Guardar accion</button>
      </form>
    </AppShell>
  );
}
