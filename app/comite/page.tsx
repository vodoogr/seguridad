import {
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Edit3,
  FileUp,
  Save,
  Trash2,
  UserRound,
  UsersRound
} from "lucide-react";
import { AppShell } from "../components/AppShell";
import { PageHeader } from "../components/PageHeader";
import {
  createCommitteeMeeting,
  createCommitteeMember,
  deleteCommitteeMeeting,
  deleteCommitteeMeetingDocument,
  deleteCommitteeMember,
  updateCommitteeMeeting,
  updateCommitteeMember
} from "../actions";
import { getCommittee, getCommitteeMeetings } from "../../lib/repository";
import Link from "next/link";

export default async function ComitePage() {
  const [committee, meetings] = await Promise.all([getCommittee(), getCommitteeMeetings()]);

  return (
    <AppShell>
      <PageHeader eyebrow="Comite PRL" title="Gestion del comite de seguridad y salud" action="Nueva reunion" actionHref="/comite/nueva-reunion" />
      <section className="grid">
        <article className="panel">
          <div className="panel-title">
            <h2><UsersRound size={20} /> Miembros</h2>
            <span>{committee.members.length} activos</span>
          </div>
          <form action={createCommitteeMember} className="stack-form">
            <input name="name" placeholder="Nombre" required />
            <input name="role" placeholder="Cargo" required />
            <input name="email" type="email" placeholder="email@empresa.com" />
            <button type="submit"><Save size={18} /> Crear miembro</button>
          </form>
          <ul>
            {committee.members.map((member) => (
              <li className="list-row" key={member.id}>
                <form action={updateCommitteeMember} className="edit-row">
                  <input name="id" type="hidden" value={member.id} />
                  <UserRound size={17} />
                  <input name="name" defaultValue={member.name} required />
                  <input name="role" defaultValue={member.role ?? ""} placeholder="Cargo" />
                  <input name="email" type="email" defaultValue={member.email ?? ""} placeholder="Email" />
                  <button aria-label="Guardar miembro" className="icon-button" type="submit" title="Guardar">
                    <Save size={16} />
                  </button>
                </form>
                <form action={deleteCommitteeMember}>
                  <input name="id" type="hidden" value={member.id} />
                  <button aria-label="Borrar miembro" className="icon-button danger" type="submit" title="Borrar">
                    <Trash2 size={16} />
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </article>
        <article className="panel">
          <div className="panel-title">
            <h2><ClipboardList size={20} /> Orden del dia</h2>
            <span>Ultima acta: {committee.lastMinutesDate}</span>
          </div>
          <strong className="date">{committee.nextDate}</strong>
          <ul>
            {committee.agenda.map((item) => (
              <li key={item}>
                <CheckCircle2 size={17} />
                {item}
              </li>
            ))}
          </ul>
        </article>
      </section>

      <article className="panel meetings-panel">
        <div className="panel-title">
          <h2><CalendarDays size={20} /> Actas y reuniones</h2>
          <span>{meetings.length} reuniones</span>
        </div>
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
          <button type="submit"><Save size={18} /> Crear acta</button>
        </form>

        <section className="cards-list">
          {meetings.map((meeting) => (
            <article className="item-card compact meeting-card" key={meeting.id}>
              <div className="meeting-main">
                <span className="code">REU-{meeting.id}</span>
                <form action={updateCommitteeMeeting} className="meeting-form">
                  <input name="id" type="hidden" value={meeting.id} />
                  <input name="meeting_date" type="date" defaultValue={meeting.rawDate} required />
                  <select name="status" defaultValue={meeting.status}>
                    <option>Programada</option>
                    <option>Celebrada</option>
                    <option>Cancelada</option>
                  </select>
                  <textarea name="agenda" defaultValue={(meeting.agenda ?? []).join("\n")} placeholder="Orden del dia" />
                  <textarea name="minutes" defaultValue={meeting.minutes ?? ""} placeholder="Contenido del acta" />
                  <label className="file-control">
                    <FileUp size={18} />
                    <span>Anadir adjuntos</span>
                    <input accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" name="files" type="file" multiple />
                  </label>
                  <button type="submit"><Edit3 size={18} /> Guardar cambios</button>
                </form>

                <div className="attachment-list">
                  {(meeting.documents ?? []).map((document) => (
                    <form action={deleteCommitteeMeetingDocument} className="attachment-row" key={document.id}>
                      <input name="id" type="hidden" value={document.id} />
                      <Link href={`/comite/adjuntos/${document.id}`}>{document.fileName}</Link>
                      <button aria-label="Borrar adjunto" className="icon-button danger" type="submit" title="Borrar adjunto">
                        <Trash2 size={16} />
                      </button>
                    </form>
                  ))}
                </div>

                <form action={deleteCommitteeMeeting}>
                  <input name="id" type="hidden" value={meeting.id} />
                  <button className="danger-button" type="submit"><Trash2 size={18} /> Borrar acta</button>
                </form>
              </div>
            </article>
          ))}
        </section>
      </article>
    </AppShell>
  );
}
