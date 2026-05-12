import { CheckCircle2, Trash2, UserRound } from "lucide-react";
import { AppShell } from "../components/AppShell";
import { PageHeader } from "../components/PageHeader";
import { createCommitteeMember, deleteCommitteeMember } from "../actions";
import { getCommittee, getCommitteeMeetings } from "../../lib/repository";

export default async function ComitePage() {
  const [committee, meetings] = await Promise.all([getCommittee(), getCommitteeMeetings()]);

  return (
    <AppShell>
      <PageHeader eyebrow="Comite PRL" title="Gestion del comite de seguridad y salud" action="Nueva reunion" actionHref="/comite/nueva-reunion" />
      <section className="grid">
        <article className="panel">
          <div className="panel-title">
            <h2>Miembros</h2>
            <span>{committee.members.length} activos</span>
          </div>
          <form action={createCommitteeMember} className="stack-form">
            <input name="name" placeholder="Nombre" required />
            <input name="role" placeholder="Cargo" required />
            <input name="email" type="email" placeholder="email@empresa.com" />
            <button type="submit">Crear miembro</button>
          </form>
          <ul>
            {committee.members.map((member) => (
              <li className="list-row" key={member.id}>
                <span>
                  <UserRound size={17} />
                  {member.name}
                </span>
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
            <h2>Orden del dia</h2>
            <span>Ultima acta: {committee.lastMinutesDate}</span>
          </div>
          <strong className="date">{committee.nextDate}</strong>
          <input className="calendar-input" type="date" aria-label="Elegir fecha de reunion" />
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
          <h2>Actas y reuniones</h2>
          <span>{meetings.length} reuniones</span>
        </div>
        <section className="cards-list">
          {meetings.map((meeting) => (
            <article className="item-card compact" key={meeting.id}>
              <div>
                <span className="code">REU-{meeting.id}</span>
                <h2>{meeting.date}</h2>
                <p>{meeting.status}{meeting.fileName ? ` · ${meeting.fileName}` : ""}</p>
              </div>
              <div className="summary-box">
                <strong>Acta</strong>
                <p>{meeting.minutes || "Sin texto de acta"}</p>
              </div>
            </article>
          ))}
        </section>
      </article>
    </AppShell>
  );
}
