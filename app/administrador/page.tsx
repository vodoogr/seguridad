import { AppShell } from "../components/AppShell";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/Tables";
import { createAppUser } from "../actions";
import { getAppUsers } from "../../lib/repository";

export default async function AdministradorPage() {
  const users = await getAppUsers();

  return (
    <AppShell>
      <PageHeader eyebrow="Administrador" title="Usuarios y permisos" action="Crear usuario" actionHref="/administrador" />
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
