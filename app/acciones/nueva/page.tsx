import { AppShell } from "../../components/AppShell";
import { PageHeader } from "../../components/PageHeader";
import { getRisks } from "../../../lib/repository";
import { createCorrectiveAction } from "../../actions";

export default async function NuevaAccionPage({ searchParams }: { searchParams?: { risk_id?: string } }) {
  const riskId = searchParams?.risk_id ?? "";
  const risks = await getRisks();

  return (
    <AppShell>
      <PageHeader eyebrow="Nueva accion" title="Crear medida preventiva o correctora" action="Ver acciones" actionHref="/acciones" />
      <form action={createCorrectiveAction} className="form-panel expanded">
        <input name="id" placeholder="Codigo: A-022" required />
        <input name="task" placeholder="Medida correctora" required />
        <select defaultValue={riskId} name="risk_id">
          <option value="">Riesgo asociado por codigo</option>
          {risks.map((risk) => (
            <option key={risk.id} value={risk.id}>
              {risk.id} - {risk.risk}
            </option>
          ))}
        </select>
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
