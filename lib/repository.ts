import { actions, committee, documents, inspections, risks } from "../app/data";
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
  name: string;
  type: string;
  updated: string;
};

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
  if (!hasDatabase) return committee;
  const sql = getSql();
  const [meeting] = await sql`
    select to_char(meeting_date, 'DD TMMonth YYYY') as "nextDate"
    from committee_meetings
    order by meeting_date asc
    limit 1
  `;
  const members = await sql`select name from committee_members order by name asc`;
  const agenda = await sql`
    select item
    from committee_agenda
    where meeting_id = (select id from committee_meetings order by meeting_date asc limit 1)
    order by position asc
  `;

  return {
    nextDate: meeting?.nextDate ?? committee.nextDate,
    members: members.map((member) => member.name),
    agenda: agenda.map((row) => row.item)
  };
}

export async function getDocuments() {
  if (!hasDatabase) return documents;
  const sql = getSql();

  const rows = await sql`
    select name, type, to_char(updated_at, 'DD/MM/YYYY') as updated
    from documents
    order by updated_at desc
  `;
  return rows as DocumentRecord[];
}
