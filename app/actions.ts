"use server";

import { revalidatePath } from "next/cache";
import { getSql, hasDatabase } from "../lib/db";

export async function createRisk(formData: FormData) {
  if (!hasDatabase) return;
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
}

export async function createInspection(formData: FormData) {
  if (!hasDatabase) return;
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
}

export async function createCorrectiveAction(formData: FormData) {
  if (!hasDatabase) return;
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
}

export async function createDocument(formData: FormData) {
  if (!hasDatabase) return;
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
}
