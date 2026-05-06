import { CheckCircle2, UserRound } from "lucide-react";
import { AppShell } from "../components/AppShell";
import { PageHeader } from "../components/PageHeader";
import { getCommittee } from "../../lib/repository";

export default async function ComitePage() {
  const committee = await getCommittee();

  return (
    <AppShell>
      <PageHeader eyebrow="Comite PRL" title="Gestion del comite de seguridad y salud" action="Nueva reunion" actionHref="/comite/nueva-reunion" />
      <section className="grid">
        <article className="panel">
          <div className="panel-title">
            <h2>Miembros</h2>
            <span>{committee.members.length} activos</span>
          </div>
          <ul>
            {committee.members.map((member) => (
              <li key={member}>
                <UserRound size={17} />
                {member}
              </li>
            ))}
          </ul>
        </article>
        <article className="panel">
          <div className="panel-title">
            <h2>Orden del dia</h2>
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
    </AppShell>
  );
}
