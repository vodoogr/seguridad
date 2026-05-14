"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSql, hasDatabase } from "../lib/db";
import { getAccessCode } from "../lib/settings";

function resolveRiskArea(code: string, fallback: string) {
  const prefix = code.trim().toUpperCase().split(/[-\s]/)[0] ?? "";

  if (prefix.startsWith("EXP")) return "EXPEDICION";
  if (prefix.startsWith("RECEP")) return "RECEPCION";
  if (prefix.startsWith("ALM")) return "ALMACEN";
  if (prefix.startsWith("PERS")) return "PERSONAL";
  if (prefix.startsWith("SPV")) return "POSTVENTA";

  return fallback;
}

export async function login(formData: FormData) {
  const accessCode = String(formData.get("access_code"));
  const validCode = await getAccessCode();

  if (!validCode || accessCode !== validCode) {
    redirect("/login");
  }

  cookies().set("app_session", "ok", {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 8
  });
  redirect("/");
}

export async function logout() {
  cookies().delete("app_session");
  redirect("/login");
}

export async function createRisk(formData: FormData) {
  if (!hasDatabase) redirect("/riesgos");
  const sql = getSql();
  const id = String(formData.get("id"));
  const area = resolveRiskArea(id, String(formData.get("area")));

  await sql`
    insert into risks (id, area, risk, level, owner, due_date, status)
    values (
      ${id},
      ${area},
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

export async function deleteCorrectiveAction(formData: FormData) {
  if (!hasDatabase) return;
  const sql = getSql();

  await sql`
    delete from corrective_actions
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

export async function deleteRisk(formData: FormData) {
  if (!hasDatabase) return;
  const sql = getSql();
  const id = String(formData.get("id"));

  await sql`
    delete from risks
    where id = ${id}
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

export async function updateAccessCode(formData: FormData) {
  if (!hasDatabase) redirect("/administrador");

  const currentCode = String(formData.get("current_code"));
  const newCode = String(formData.get("new_code"));
  const repeatCode = String(formData.get("repeat_code"));
  const validCode = await getAccessCode();

  if (!validCode || currentCode !== validCode || newCode.length < 8 || newCode !== repeatCode) {
    redirect("/administrador");
  }

  const sql = getSql();
  await sql`
    create table if not exists app_settings (
      key text primary key,
      value text not null,
      updated_at timestamptz not null default now()
    )
  `;
  await sql`
    insert into app_settings (key, value)
    values ('APP_ACCESS_CODE', ${newCode})
    on conflict (key) do update set value = excluded.value, updated_at = now()
  `;

  cookies().set("app_session", "ok", {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 8
  });
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

export async function updateCommitteeMember(formData: FormData) {
  if (!hasDatabase) return;
  const sql = getSql();

  await sql`
    update committee_members
    set
      name = ${String(formData.get("name"))},
      role = ${String(formData.get("role"))},
      email = ${String(formData.get("email"))}
    where id = ${Number(formData.get("id"))}
  `;
  revalidatePath("/comite");
  revalidatePath("/");
}

export async function deleteCommitteeMember(formData: FormData) {
  if (!hasDatabase) return;
  const sql = getSql();

  await sql`
    update committee_members
    set active = false
    where id = ${Number(formData.get("id"))}
  `;
  revalidatePath("/comite");
  revalidatePath("/");
}

export async function createCommitteeMeeting(formData: FormData) {
  if (!hasDatabase) redirect("/comite");
  const sql = getSql();
  const minutes = String(formData.get("minutes"));

  const [meeting] = await sql`
    insert into committee_meetings (meeting_date, status, minutes)
    values (
      ${String(formData.get("meeting_date"))},
      ${String(formData.get("status"))},
      ${minutes}
    )
    returning id
  `;

  const agenda = String(formData.get("agenda"))
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

  for (let index = 0; index < agenda.length; index += 1) {
    const item = agenda[index];
    await sql`
      insert into committee_agenda (meeting_id, item, position)
      values (${meeting.id}, ${item}, ${index + 1})
    `;
  }

  await saveMeetingDocuments(Number(meeting.id), formData);
  revalidatePath("/comite");
  redirect("/comite");
}

export async function updateCommitteeMeeting(formData: FormData) {
  if (!hasDatabase) return;
  const sql = getSql();
  const meetingId = Number(formData.get("id"));

  await sql`
    update committee_meetings
    set
      meeting_date = ${String(formData.get("meeting_date"))},
      status = ${String(formData.get("status"))},
      minutes = ${String(formData.get("minutes"))}
    where id = ${meetingId}
  `;

  await sql`delete from committee_agenda where meeting_id = ${meetingId}`;
  const agenda = String(formData.get("agenda"))
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

  for (let index = 0; index < agenda.length; index += 1) {
    await sql`
      insert into committee_agenda (meeting_id, item, position)
      values (${meetingId}, ${agenda[index]}, ${index + 1})
    `;
  }

  await saveMeetingDocuments(meetingId, formData);
  revalidatePath("/comite");
  revalidatePath("/");
}

export async function deleteCommitteeMeeting(formData: FormData) {
  if (!hasDatabase) return;
  const sql = getSql();

  await sql`
    delete from committee_meetings
    where id = ${Number(formData.get("id"))}
  `;
  revalidatePath("/comite");
  revalidatePath("/");
}

export async function deleteCommitteeMeetingDocument(formData: FormData) {
  if (!hasDatabase) return;
  const sql = getSql();

  await sql`
    delete from committee_meeting_documents
    where id = ${Number(formData.get("id"))}
  `;
  revalidatePath("/comite");
}

async function saveMeetingDocuments(meetingId: number, formData: FormData) {
  const sql = getSql();
  const files = formData.getAll("files").filter((file): file is File => file instanceof File && file.size > 0);

  for (const file of files) {
    const fileData = Buffer.from(await file.arrayBuffer());
    await sql`
      insert into committee_meeting_documents (meeting_id, file_name, file_type, file_data)
      values (${meetingId}, ${file.name}, ${file.type}, ${fileData})
    `;
  }
}
