import { PDFFont, PDFDocument, PDFPage, StandardFonts, rgb } from "pdf-lib";
import { NextRequest, NextResponse } from "next/server";
import { getSql, hasDatabase } from "../../../lib/db";
import { getCompanyLogo } from "../../../lib/settings";
import { actions as mockActions, risks as mockRisks } from "../../data";

export async function GET(request: NextRequest) {
  const owner = request.nextUrl.searchParams.get("owner") ?? "";
  const status = request.nextUrl.searchParams.get("status") ?? "";
  const area = request.nextUrl.searchParams.get("area") ?? "";
  const actions = hasDatabase ? await getReportActions({ owner, status, area }) : getMockActions({ owner, status, area });
  const pdf = await PDFDocument.create();
  let page = pdf.addPage([842, 595]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let cursorY = 540;
  const logo = await getCompanyLogo();

  if (logo?.file_data) {
    const imageBytes = logo.file_data instanceof Uint8Array ? logo.file_data : Buffer.from(logo.file_data);
    const image = logo.file_type === "image/png" ? await pdf.embedPng(imageBytes) : await pdf.embedJpg(imageBytes);
    const scaled = image.scale(0.22);
    page.drawImage(image, { x: 42, y: 500, width: scaled.width, height: scaled.height });
  }

  page.drawText("Plan de accion", { x: 170, y: 540, size: 22, font: bold, color: rgb(0.06, 0.19, 0.37) });
  page.drawText(`Filtros: ${buildFilterLabel({ owner, status, area })}`, { x: 170, y: 516, size: 11, font, color: rgb(0.38, 0.45, 0.54) });
  page.drawLine({ start: { x: 42, y: 490 }, end: { x: 800, y: 490 }, thickness: 1, color: rgb(0.84, 0.89, 0.93) });

  const headers = ["Cod. accion", "Medida", "Cod. riesgo", "Descripcion riesgo", "Responsable", "Vencimiento", "Estado"];
  const columns = [42, 115, 340, 425, 610, 700, 765];
  const widths = [60, 210, 70, 175, 80, 55, 35];

  drawHeader(page, headers, columns, bold);

  cursorY = 442;
  for (const action of actions) {
    const wrappedId = wrapText(action.id, bold, 10, widths[0]);
    const wrappedTask = wrapText(action.task, font, 10, widths[1]);
    const wrappedRiskCode = wrapText(action.risk || "-", font, 10, widths[2]);
    const wrappedRiskDescription = wrapText(action.riskDescription || "-", font, 10, widths[3]);
    const wrappedOwner = wrapText(action.owner, font, 10, widths[4]);
    const wrappedDue = wrapText(action.due, font, 10, widths[5]);
    const wrappedStatus = wrapText(action.status, font, 10, widths[6]);
    const rowHeight = Math.max(
      28,
      Math.max(
        wrappedId.length,
        wrappedTask.length,
        wrappedRiskCode.length,
        wrappedRiskDescription.length,
        wrappedOwner.length,
        wrappedDue.length,
        wrappedStatus.length
      ) * 12 + 10
    );

    if (cursorY - rowHeight < 70) {
      const nextPage = pdf.addPage([842, 595]);
      drawHeader(nextPage, headers, columns, bold, 540, 528);
      page = nextPage;
      cursorY = 504;
    }

    drawActionRow(page, action, columns, cursorY, font, bold, {
      id: wrappedId,
      task: wrappedTask,
      risk: wrappedRiskCode,
      riskDescription: wrappedRiskDescription,
      owner: wrappedOwner,
      due: wrappedDue,
      status: wrappedStatus
    }, rowHeight);
    cursorY -= rowHeight;
  }

  const bytes = await pdf.save();
  return new NextResponse(bytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="plan-accion.pdf"`
    }
  });
}

async function getReportActions(filters: { owner: string; status: string; area: string }) {
  const sql = getSql();
  const rows = await sql`
    select
      ca.id,
      ca.task,
      ca.risk_id as risk,
      coalesce(r.risk, '') as "riskDescription",
      ca.owner,
      to_char(ca.due_date, 'DD/MM/YYYY') as due,
      ca.status,
      coalesce(r.area, '') as area
    from corrective_actions ca
    left join risks r on r.id = ca.risk_id
    where (${filters.owner} = '' or ca.owner = ${filters.owner})
      and (${filters.status} = '' or ca.status = ${filters.status})
      and (${filters.area} = '' or upper(coalesce(r.area, '')) like ${resolveAreaPrefix(filters.area)} || '%')
    order by ca.due_date asc
  `;

  return rows as Array<{ id: string; task: string; risk: string; riskDescription: string; owner: string; due: string; status: string; area: string }>;
}

function getMockActions(filters: { owner: string; status: string; area: string }) {
  return mockActions.filter((action) => {
    if (filters.owner && action.owner !== filters.owner) return false;
    if (filters.status && action.status !== filters.status) return false;
    if (filters.area && !action.risk.toUpperCase().startsWith(filters.area.toUpperCase())) return false;
    return true;
  }).map((action) => ({
    ...action,
    riskDescription: mockRisks.find((risk) => risk.id === action.risk)?.risk ?? ""
  }));
}

function drawActionRow(
  page: PDFPage,
  action: { id: string; task: string; risk: string; riskDescription: string; owner: string; due: string; status: string },
  columns: number[],
  y: number,
  font: PDFFont,
  bold: PDFFont,
  wrapped: {
    id: string[];
    task: string[];
    risk: string[];
    riskDescription: string[];
    owner: string[];
    due: string[];
    status: string[];
  },
  rowHeight: number
) {
  const baseY = y;
  wrapped.id.forEach((line, index) => {
    page.drawText(line, { x: columns[0], y: baseY - index * 12, size: 10, font: bold, color: rgb(0.06, 0.13, 0.2) });
  });
  wrapped.task.forEach((line, index) => {
    page.drawText(line, { x: columns[1], y: baseY - index * 12, size: 10, font, color: rgb(0.06, 0.13, 0.2) });
  });
  wrapped.risk.forEach((line, index) => {
    page.drawText(line, { x: columns[2], y: baseY - index * 12, size: 10, font, color: rgb(0.06, 0.13, 0.2) });
  });
  wrapped.riskDescription.forEach((line, index) => {
    page.drawText(line, { x: columns[3], y: baseY - index * 12, size: 10, font, color: rgb(0.06, 0.13, 0.2) });
  });
  wrapped.owner.forEach((line, index) => {
    page.drawText(line, { x: columns[4], y: baseY - index * 12, size: 10, font, color: rgb(0.06, 0.13, 0.2) });
  });
  wrapped.due.forEach((line, index) => {
    page.drawText(line, { x: columns[5], y: baseY - index * 12, size: 10, font, color: rgb(0.06, 0.13, 0.2) });
  });
  wrapped.status.forEach((line, index) => {
    page.drawText(line, { x: columns[6], y: baseY - index * 12, size: 10, font, color: rgb(0.06, 0.13, 0.2) });
  });
  page.drawLine({ start: { x: 42, y: baseY - rowHeight + 10 }, end: { x: 800, y: baseY - rowHeight + 10 }, thickness: 0.8, color: rgb(0.9, 0.93, 0.96) });
}

function drawHeader(page: PDFPage, headers: string[], columns: number[], font: PDFFont, y = 466, lineY = 454) {
  headers.forEach((header, index) => {
    page.drawText(header, { x: columns[index], y, size: 10, font, color: rgb(0.38, 0.45, 0.54) });
  });
  page.drawLine({ start: { x: 42, y: lineY }, end: { x: 800, y: lineY }, thickness: 1, color: rgb(0.84, 0.89, 0.93) });
}

function wrapText(value: string, font: PDFFont, size: number, maxWidth: number) {
  const words = value.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      currentLine = candidate;
      continue;
    }

    if (currentLine) {
      lines.push(currentLine);
      currentLine = word;
      continue;
    }

    lines.push(word);
  }

  if (currentLine) lines.push(currentLine);
  return lines.length ? lines : [value];
}

function resolveAreaPrefix(value: string) {
  if (value === "EXP") return "EXPEDICION";
  if (value === "RECEP") return "RECEPCION";
  if (value === "ALM") return "ALMACEN";
  if (value === "PERS") return "PERSONAL";
  if (value === "SPV") return "POSTVENTA";
  return value;
}

function buildFilterLabel(filters: { owner: string; status: string; area: string }) {
  const parts = [];
  if (filters.owner) parts.push(`Responsable ${filters.owner}`);
  if (filters.status) parts.push(`Estado ${filters.status}`);
  if (filters.area) parts.push(`Zona ${filters.area}`);
  return parts.length ? parts.join(" | ") : "Todas";
}
