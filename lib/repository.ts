import { actions, appUsers, committee, documents, incidents, inspections, risks } from "../app/data";
import { getSql, hasDatabase } from "./db";

type RiskRecord = {
  id: string;
  area: string;
  risk: string;
  level: string;
  owner: string;
  due: string;
  status: string;
};

type InspectionRecord = {
  id: string;
  area: string;
  type: string;
  date: string;
  owner: string;
  result: string;
};

type ActionRecord = {
  id: string;
  task: string;
  risk: string;
  owner: string;
  due: string;
  status: string;
};

type DocumentRecord = {
  id?: number;
  name: string;
  type: string;
  fileName?: string;
  fileType?: string;
  updated: string;
};

type MeetingRecord = {
  id: number;
  date: string;
  status: string;
  minutes?: string;
  fileName?: string;
};

type IncidentRecord = {
  id: string;
  title: string;
  area: string;
  severity: string;
  owner: string;
  date: string;
  status: string;
};

type AppUserRecord = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
};

export async function getDashboardStats() {
  const riskRows = await getRisks();
  const actionRows = await getActions();
  const inspectionRows = await getInspections();
  const committeeData = await getCommittee();

  return [
    {
      label: "Riesgos abiertos",
      value: String(riskRows.filter((risk) => risk.status !== "Controlado").length),
      detail: `${riskRows.filter((risk) => risk.level === "Critico").length} criticos`
    },
    {
      label: "Acciones pendientes",
      value: String(actionRows.filter((action) => action.status !== "Cerrada").length),
      detail: `${actionRows.filter((action) => action.status === "Pendiente").length} pendientes`
    },
    {
      label: "Inspecciones",
      value: String(inspectionRows.length),
      detail: `${inspectionRows.filter((inspection) => inspection.result === "Programada").length} programadas`
    },
    {
      label: "Comite PRL",
      value: String(committeeData.members.length),
      detail: "miembros activos"
    }
  ];
}

export async function getRisks() {
  if (!hasDatabase) return risks;
  const sql = getSql();

  const rows = await sql`
    select id, area, risk, level, owner, to_char(due_date, 'DD/MM/YYYY') as due, status
    from risks
    order by due_date asc
  `;
  return rows as RiskRecord[];
}

export async function getRisk(id: string) {
  const rows = await getRisks();
  return rows.find((risk) => risk.id === id);
}

export async function getInspections() {
  if (!hasDatabase) return inspections;
  const sql = getSql();

  const rows = await sql`
    select id, area, type, to_char(inspection_date, 'DD/MM/YYYY') as date, owner, result
    from inspections
    order by inspection_date desc
  `;
  return rows as InspectionRecord[];
}

export async function getInspection(id: string) {
  const rows = await getInspections();
  return rows.find((inspection) => inspection.id === id);
}

export async function getActions() {
  if (!hasDatabase) return actions;
  const sql = getSql();

  const rows = await sql`
    select id, task, risk_id as risk, owner, to_char(due_date, 'DD/MM/YYYY') as due, status
    from corrective_actions
    order by due_date asc
  `;
  return rows as ActionRecord[];
}

export async function getCommittee() {
  if (!hasDatabase) {
    return {
      ...committee,
      lastMinutesDate: "Sin acta"
    };
  }
  const sql = getSql();
  const [meeting] = await sql`
    select to_char(meeting_date, 'DD TMMonth YYYY') as "nextDate", to_char(meeting_date, 'DD/MM/YYYY') as "lastMinutesDate"
    from committee_meetings
    order by meeting_date desc
    limit 1
  `;
  const members = await sql`select name from committee_members where active = true order by name asc`;
  const agenda = await sql`
    select item
    from committee_agenda
    where meeting_id = (select id from committee_meetings order by meeting_date desc limit 1)
    order by position asc
  `;

  return {
    nextDate: meeting?.nextDate ?? committee.nextDate,
    lastMinutesDate: meeting?.lastMinutesDate ?? "Sin acta",
    members: members.map((member) => member.name),
    agenda: agenda.map((row) => row.item)
  };
}

export async function getCommitteeMeetings() {
  if (!hasDatabase) return [];
  const sql = getSql();

  const rows = await sql`
    select
      id,
      to_char(meeting_date, 'DD/MM/YYYY') as date,
      status,
      minutes,
      file_name as "fileName"
    from committee_meetings
    order by meeting_date desc
  `;
  return rows as MeetingRecord[];
}

export async function getDocuments() {
  if (!hasDatabase) return documents;
  const sql = getSql();

  const rows = await sql`
    select id, name, type, file_name as "fileName", file_type as "fileType", to_char(updated_at, 'DD/MM/YYYY') as updated
    from documents
    order by updated_at desc
  `;
  return rows as DocumentRecord[];
}

export async function getIncidents() {
  if (!hasDatabase) return incidents;
  const sql = getSql();

  const rows = await sql`
    select id, title, area, severity, owner, to_char(incident_date, 'DD/MM/YYYY') as date, status
    from incidents
    order by incident_date desc
  `;
  return rows as IncidentRecord[];
}

export async function getAppUsers() {
  if (!hasDatabase) return appUsers;
  const sql = getSql();

  const [authTable] = await sql`
    select to_regclass('neon_auth.users_sync') as auth_table
  `;

  if (!authTable?.auth_table) {
    const rows = await sql`
      select id, name, email, role, status
      from app_users
      order by created_at desc
    `;
    return rows as AppUserRecord[];
  }

  const rows = await sql`
    select
      au.id,
      coalesce(nu.name, au.name) as name,
      au.email,
      au.role,
      au.status
    from app_users au
    left join neon_auth.users_sync nu on lower(nu.email) = lower(au.email)
    order by au.created_at desc
  `;
  return rows as AppUserRecord[];
}
