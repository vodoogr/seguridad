import { ShieldCheck } from "lucide-react";
import { login } from "../actions";

export default function LoginPage() {
  return (
    <main className="login-page">
      <section className="login-panel">
        <div className="login-brand">
          <ShieldCheck size={34} />
          <div>
            <strong>Seguridad Almacen</strong>
            <span>Acceso privado</span>
          </div>
        </div>
        <form action={login} className="login-form">
          <label htmlFor="access_code">Codigo de acceso</label>
          <input id="access_code" name="access_code" type="password" required />
          <button type="submit">Entrar</button>
        </form>
      </section>
    </main>
  );
}
