"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSql, hasDatabase } from "../lib/db";

export async function login(formData: FormData) {
  const accessCode = String(formData.get("access_code"));

  if (!process.env.APP_ACCESS_CODE || accessCode !== process.env.APP_ACCESS_CODE) {
    redirect("/login");
  }

  cookies().set("app_session", accessCode, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 8
  });
  redirect("/");
}

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
  const file = formData.get("file");
  const uploadedFile = file instanceof File && file.size > 0 ? file : null;
  const fileData = uploadedFile ? Buffer.from(await uploadedFile.arrayBuffer()) : null;

  await sql`
    insert into documents (name, type, file_name, file_type, file_data, updated_at)
    values (
      ${String(formData.get("name"))},
      ${String(formData.get("type"))},
      ${uploadedFile?.name ?? null},
      ${uploadedFile?.type ?? null},
      ${fileData},
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

export async function createCommitteeMember(formData: FormData) {
  if (!hasDatabase) redirect("/comite");
  const sql = getSql();

  await sql`
    insert into committee_members (name, role, email, active)
    values (
      ${String(formData.get("name"))},
      ${String(formData.get("role"))},
      ${String(formData.get("email"))},
      true
    )
  `;
  revalidatePath("/comite");
  redirect("/comite");
}

async function summarizeMinutes(minutes: string) {
  if (!process.env.OPENAI_API_KEY || !minutes.trim()) return null;

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      input: `Resume esta acta del comite de seguridad en decisiones, responsables y acciones pendientes:\n\n${minutes}`
    })
  });

  if (!response.ok) return null;
  const data = await response.json();
  return data.output_text ?? null;
}

export async function createCommitteeMeeting(formData: FormData) {
  if (!hasDatabase) redirect("/comite");
  const sql = getSql();
  const file = formData.get("file");
  const uploadedFile = file instanceof File && file.size > 0 ? file : null;
  const fileData = uploadedFile ? Buffer.from(await uploadedFile.arrayBuffer()) : null;
  const minutes = String(formData.get("minutes"));
  const summary = await summarizeMinutes(minutes);

  const [meeting] = await sql`
    insert into committee_meetings (meeting_date, status, minutes, ai_summary, file_name, file_type, file_data)
    values (
      ${String(formData.get("meeting_date"))},
      ${String(formData.get("status"))},
      ${minutes},
      ${summary},
      ${uploadedFile?.name ?? null},
      ${uploadedFile?.type ?? null},
      ${fileData}
    )
    returning id
  `;

  const agenda = String(formData.get("agenda"))
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

  for (const [index, item] of agenda.entries()) {
    await sql`
      insert into committee_agenda (meeting_id, item, position)
      values (${meeting.id}, ${item}, ${index + 1})
    `;
  }

  revalidatePath("/comite");
  redirect("/comite");
}
