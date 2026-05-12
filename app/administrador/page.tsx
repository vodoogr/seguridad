import { AppShell } from "../components/AppShell";
import { PageHeader } from "../components/PageHeader";
import { updateAccessCode } from "../actions";
import { getDatabaseInfo } from "../../lib/db";
import { Database, KeyRound, Power, ShieldCheck } from "lucide-react";

export default async function AdministradorPage() {
  const database = getDatabaseInfo();

  return (
    <AppShell>
      <PageHeader eyebrow="Administrador" title="Acceso administrador" />
      <section className="admin-status">
        <article className="panel status-card">
          <div className={database.connected ? "status-icon on" : "status-icon off"}>
            <Power size={22} />
          </div>
          <div>
            <span>Base de datos</span>
            <strong>{database.connected ? "ON" : "OFF"}</strong>
          </div>
        </article>
        <article className="panel status-card wide">
          <Database size={24} />
          <div>
            <span>Destino Neon</span>
            <strong>{database.host}</strong>
            <small>{database.database}</small>
          </div>
        </article>
      </section>

      <article className="panel admin-section status-card">
        <div className="status-icon on">
          <ShieldCheck size={22} />
        </div>
        <div>
          <span>Usuario activo</span>
          <strong>Administrador</strong>
          <small>Acceso unico mediante clave privada</small>
        </div>
      </article>

      <article className="panel admin-section">
        <div className="panel-title">
          <h2><KeyRound size={20} /> Cambiar clave de acceso</h2>
          <span>Minimo 8 caracteres</span>
        </div>
        <form action={updateAccessCode} className="form-panel">
          <input name="current_code" type="password" placeholder="Clave actual" required />
          <input name="new_code" type="password" placeholder="Nueva clave" required minLength={8} />
          <input name="repeat_code" type="password" placeholder="Repetir nueva clave" required minLength={8} />
          <button type="submit">Actualizar clave</button>
        </form>
      </article>
    </AppShell>
  );
}
