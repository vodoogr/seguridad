"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSql, hasDatabase } from "../lib/db";

export async function createRisk(formData: FormData) {
  if (!hasDatabase) redirect("/riesgos");
  const sql = getSql();

  await sql`
    insert into risks (id, area, risk, level, owner, due_date, status)
    values (
      ${String(formData.get("id"))},
      ${String(formData.get("area"))},
      ${String(formData.get("risk"))},
      ${String(formData.get("level"))},
      ${String(formData.get("owner"))},
      ${String(formData.get("due_date"))},
      ${String(formData.get("status"))}
    )
  `;
  revalidatePath("/riesgos");
  revalidatePath("/");
  redirect("/riesgos");
}

export async function createInspection(formData: FormData) {
  if (!hasDatabase) redirect("/inspecciones");
  const sql = getSql();

  await sql`
    insert into inspections (id, area, type, inspection_date, owner, result)
    values (
      ${String(formData.get("id"))},
      ${String(formData.get("area"))},
      ${String(formData.get("type"))},
      ${String(formData.get("inspection_date"))},
      ${String(formData.get("owner"))},
      ${String(formData.get("result"))}
    )
  `;
  revalidatePath("/inspecciones");
  redirect("/inspecciones");
}

export async function createCorrectiveAction(formData: FormData) {
  if (!hasDatabase) redirect("/acciones");
  const sql = getSql();

  await sql`
    insert into corrective_actions (id, task, risk_id, owner, due_date, status)
    values (
      ${String(formData.get("id"))},
      ${String(formData.get("task"))},
      ${String(formData.get("risk_id"))},
      ${String(formData.get("owner"))},
      ${String(formData.get("due_date"))},
      ${String(formData.get("status"))}
    )
  `;
  revalidatePath("/acciones");
  revalidatePath("/");
  redirect("/acciones");
}

export async function createDocument(formData: FormData) {
  if (!hasDatabase) redirect("/documentacion");
  const sql = getSql();

  await sql`
    insert into documents (name, type, updated_at)
    values (
      ${String(formData.get("name"))},
      ${String(formData.get("type"))},
      current_date
    )
  `;
  revalidatePath("/documentacion");
  redirect("/documentacion");
}

export async function closeCorrectiveAction(formData: FormData) {
  if (!hasDatabase) return;
  const sql = getSql();

  await sql`
    update corrective_actions
    set status = 'Cerrada'
    where id = ${String(formData.get("id"))}
  `;
  revalidatePath("/acciones");
  revalidatePath("/");
}

export async function controlRisk(formData: FormData) {
  if (!hasDatabase) return;
  const sql = getSql();

  await sql`
    update risks
    set status = 'Controlado'
    where id = ${String(formData.get("id"))}
  `;
  revalidatePath("/riesgos");
  revalidatePath("/");
}

export async function createIncident(formData: FormData) {
  if (!hasDatabase) redirect("/incidencias");
  const sql = getSql();

  await sql`
    insert into incidents (id, title, area, severity, owner, incident_date, status, description)
    values (
      ${String(formData.get("id"))},
      ${String(formData.get("title"))},
      ${String(formData.get("area"))},
      ${String(formData.get("severity"))},
      ${String(formData.get("owner"))},
      ${String(formData.get("incident_date"))},
      ${String(formData.get("status"))},
      ${String(formData.get("description"))}
    )
  `;
  revalidatePath("/incidencias");
  revalidatePath("/");
  redirect("/incidencias");
}

export async function createAppUser(formData: FormData) {
  if (!hasDatabase) redirect("/administrador");
  const sql = getSql();

  await sql`
    insert into app_users (id, name, email, role, status)
    values (
      ${String(formData.get("id"))},
      ${String(formData.get("name"))},
      ${String(formData.get("email"))},
      ${String(formData.get("role"))},
      'Activo'
    )
  `;
  revalidatePath("/administrador");
  redirect("/administrador");
}
