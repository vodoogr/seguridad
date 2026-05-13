import { AppShell } from "../../components/AppShell";
import { PageHeader } from "../../components/PageHeader";
import { createCommitteeMeeting } from "../../actions";
import { FileUp, Save } from "lucide-react";

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
        <label className="file-control">
          <FileUp size={18} />
          <span>Adjuntar documentos</span>
          <input accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" name="files" type="file" multiple />
        </label>
        <textarea name="agenda" placeholder="Orden del dia, un punto por linea" required />
        <textarea name="minutes" placeholder="Contenido del acta" />
        <button type="submit"><Save size={18} /> Guardar reunion</button>
      </form>
    </AppShell>
  );
}
