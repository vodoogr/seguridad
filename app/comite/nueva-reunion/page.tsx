import { AppShell } from "../../components/AppShell";
import { PageHeader } from "../../components/PageHeader";
import { createCommitteeMeeting } from "../../actions";

export default function NuevaReunionPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Nueva reunion" title="Preparar reunion del comite" action="Ver comite" actionHref="/comite" />
      <form action={createCommitteeMeeting} className="form-panel expanded">
        <input name="meeting_date" type="date" required />
        <select name="status" defaultValue="Programada">
          <option>Programada</option>
          <option>Celebrada</option>
          <option>Cancelada</option>
        </select>
        <input accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" name="file" type="file" />
        <textarea name="agenda" placeholder="Orden del dia, un punto por linea" required />
        <textarea name="minutes" placeholder="Contenido del acta" />
        <button type="submit">Guardar reunion</button>
      </form>
    </AppShell>
  );
}
