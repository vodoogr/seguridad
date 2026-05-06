import { AppShell } from "../components/AppShell";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/Tables";
import { createAppUser, updateAccessCode } from "../actions";
import { getAppUsers } from "../../lib/repository";
import { getDatabaseInfo } from "../../lib/db";
import { Database, Power } from "lucide-react";

export default async function AdministradorPage() {
  const users = await getAppUsers();
  const database = getDatabaseInfo();

  return (
    <AppShell>
      <PageHeader eyebrow="Administrador" title="Usuarios y permisos" action="Crear usuario" actionHref="/administrador" />
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
      <form action={createAppUser} className="form-panel">
        <input name="id" placeholder="Codigo: USR-002" required />
        <input name="name" placeholder="Nombre" required />
        <input name="email" type="email" placeholder="email@empresa.com" required />
        <select name="role" defaultValue="Usuario">
          <option>Usuario</option>
          <option>Administrador</option>
        </select>
        <button type="submit">Guardar usuario</button>
      </form>

      <article className="panel admin-section">
        <div className="panel-title">
          <h2>Cambiar clave de acceso</h2>
          <span>Minimo 8 caracteres</span>
        </div>
        <form action={updateAccessCode} className="form-panel">
          <input name="current_code" type="password" placeholder="Clave actual" required />
          <input name="new_code" type="password" placeholder="Nueva clave" required minLength={8} />
          <input name="repeat_code" type="password" placeholder="Repetir nueva clave" required minLength={8} />
          <button type="submit">Actualizar clave</button>
        </form>
      </article>

      <article className="panel">
        <div className="panel-title">
          <h2>Usuarios registrados</h2>
          <span>{users.length} usuarios</span>
        </div>
        <div className="table">
          <div className="row users-head head">
            <span>Codigo</span>
            <span>Nombre</span>
            <span>Email</span>
            <span>Rol</span>
            <span>Estado</span>
          </div>
          {users.map((user) => (
            <div className="row users-head" key={user.id}>
              <span>{user.id}</span>
              <span>{user.name}</span>
              <span>{user.email}</span>
              <span>{user.role}</span>
              <StatusBadge status={user.status} />
            </div>
          ))}
        </div>
      </article>
    </AppShell>
  );
}
