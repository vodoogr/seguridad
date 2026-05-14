import { ShieldCheck } from "lucide-react";
import { login } from "../actions";

export default function LoginPage() {
  return (
    <main className="login-page">
      <section className="landing-login">
        <div className="landing-copy">
          <div className="login-brand">
            <ShieldCheck size={34} />
            <div>
              <strong>Seguridad Almacen</strong>
              <span>Gestion privada de PRL</span>
            </div>
          </div>
          <h1>Control operativo de prevencion para almacenes</h1>
          <p>
            Riesgos, incidencias, acciones correctoras, documentacion y comite de seguridad en un unico panel.
          </p>
        </div>

        <div className="login-panel">
          <div>
            <h2>Acceso administrador</h2>
            <p className="muted-text">Introduce la clave privada de administrador.</p>
          </div>
          <form action={login} className="login-form">
            <label htmlFor="access_code">Codigo de acceso</label>
            <input id="access_code" name="access_code" type="password" required />
            <button type="submit">Entrar como administrador</button>
          </form>
        </div>
      </section>
    </main>
  );
}
