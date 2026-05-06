import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  FileWarning,
  HardHat,
  ShieldCheck,
  Users
} from "lucide-react";

const metrics = [
  { label: "Riesgos abiertos", value: "18", detail: "5 criticos", icon: AlertTriangle },
  { label: "Acciones pendientes", value: "27", detail: "9 vencen esta semana", icon: ClipboardCheck },
  { label: "Inspecciones", value: "12", detail: "3 programadas", icon: ShieldCheck },
  { label: "Comite PRL", value: "6", detail: "miembros activos", icon: Users }
];

const risks = [
  {
    area: "Muelles de carga",
    risk: "Atropello por carretillas",
    level: "Critico",
    owner: "Jefe de turno",
    due: "10/05/2026"
  },
  {
    area: "Picking altura",
    risk: "Caida de objetos",
    level: "Alto",
    owner: "Coordinador PRL",
    due: "14/05/2026"
  },
  {
    area: "Camara frigorifica",
    risk: "Exposicion a bajas temperaturas",
    level: "Medio",
    owner: "Mantenimiento",
    due: "22/05/2026"
  }
];

const meetings = [
  "Revision de accidentes e incidentes",
  "Seguimiento de medidas correctoras",
  "Planificacion de simulacro de evacuacion"
];

export default function Home() {
  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand">
          <HardHat size={28} />
          <div>
            <strong>Seguridad Almacen</strong>
            <span>Gestion PRL</span>
          </div>
        </div>
        <nav>
          <a className="active">Panel</a>
          <a>Riesgos</a>
          <a>Inspecciones</a>
          <a>Acciones</a>
          <a>Comite</a>
          <a>Documentacion</a>
        </nav>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p>Panel operativo</p>
            <h1>Control de riesgos laborales del almacen</h1>
          </div>
          <button>
            <FileWarning size={18} />
            Registrar incidencia
          </button>
        </header>

        <section className="metrics">
          {metrics.map((item) => {
            const Icon = item.icon;
            return (
              <article className="metric" key={item.label}>
                <Icon size={22} />
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <small>{item.detail}</small>
              </article>
            );
          })}
        </section>

        <section className="grid">
          <article className="panel large">
            <div className="panel-title">
              <h2>Matriz de riesgos prioritarios</h2>
              <span>Actualizado hoy</span>
            </div>
            <div className="table">
              <div className="row head">
                <span>Area</span>
                <span>Riesgo</span>
                <span>Nivel</span>
                <span>Responsable</span>
                <span>Fecha</span>
              </div>
              {risks.map((risk) => (
                <div className="row" key={risk.risk}>
                  <span>{risk.area}</span>
                  <span>{risk.risk}</span>
                  <span className={`badge ${risk.level.toLowerCase()}`}>{risk.level}</span>
                  <span>{risk.owner}</span>
                  <span>{risk.due}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="panel">
            <div className="panel-title">
              <h2>Proxima reunion</h2>
              <CalendarDays size={20} />
            </div>
            <strong className="date">15 mayo 2026</strong>
            <ul>
              {meetings.map((item) => (
                <li key={item}>
                  <CheckCircle2 size={17} />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </section>
      </section>
    </main>
  );
}
