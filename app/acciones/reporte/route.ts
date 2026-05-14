import { PDFFont, PDFDocument, PDFPage, StandardFonts, rgb } from "pdf-lib";
import { NextRequest, NextResponse } from "next/server";
import { getSql, hasDatabase } from "../../../lib/db";
import { getCompanyLogo } from "../../../lib/settings";
import { actions as mockActions } from "../../data";

export async function GET(request: NextRequest) {
  const status = request.nextUrl.searchParams.get("status") ?? "";
  const actions = hasDatabase ? await getReportActions(status) : getMockActions(status);
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
  page.drawText(`Filtro: ${status || "Todas"}`, { x: 170, y: 516, size: 11, font, color: rgb(0.38, 0.45, 0.54) });
  page.drawLine({ start: { x: 42, y: 490 }, end: { x: 800, y: 490 }, thickness: 1, color: rgb(0.84, 0.89, 0.93) });

  const headers = ["Codigo", "Medida", "Riesgo", "Responsable", "Vencimiento", "Estado"];
  const columns = [42, 110, 420, 500, 620, 710];

  headers.forEach((header, index) => {
    page.drawText(header, { x: columns[index], y: 466, size: 10, font: bold, color: rgb(0.38, 0.45, 0.54) });
  });

  cursorY = 442;
  for (const action of actions) {
    if (cursorY < 70) {
      cursorY = 540;
      const nextPage = pdf.addPage([842, 595]);
      headers.forEach((header, index) => {
        nextPage.drawText(header, { x: columns[index], y: 540, size: 10, font: bold, color: rgb(0.38, 0.45, 0.54) });
      });
      nextPage.drawLine({ start: { x: 42, y: 528 }, end: { x: 800, y: 528 }, thickness: 1, color: rgb(0.84, 0.89, 0.93) });
      page = nextPage;
      cursorY = 504;
      drawActionRow(page, action, columns, cursorY, font, bold);
      cursorY -= 34;
      continue;
    }

    drawActionRow(page, action, columns, cursorY, font, bold);
    cursorY -= 34;
  }

  const bytes = await pdf.save();
  return new NextResponse(bytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="plan-accion${status ? `-${status.toLowerCase()}` : ""}.pdf"`
    }
  });
}

async function getReportActions(status: string) {
  const sql = getSql();
  const rows = status
    ? await sql`
        select id, task, risk_id as risk, owner, to_char(due_date, 'DD/MM/YYYY') as due, status
        from corrective_actions
        where status = ${status}
        order by due_date asc
      `
    : await sql`
        select id, task, risk_id as risk, owner, to_char(due_date, 'DD/MM/YYYY') as due, status
        from corrective_actions
        order by due_date asc
      `;

  return rows as Array<{ id: string; task: string; risk: string; owner: string; due: string; status: string }>;
}

function getMockActions(status: string) {
  return status ? mockActions.filter((action) => action.status === status) : mockActions;
}

function drawActionRow(
  page: PDFPage,
  action: { id: string; task: string; risk: string; owner: string; due: string; status: string },
  columns: number[],
  y: number,
  font: PDFFont,
  bold: PDFFont
) {
  page.drawText(action.id, { x: columns[0], y, size: 10, font: bold, color: rgb(0.06, 0.13, 0.2) });
  page.drawText(trimText(action.task, 44), { x: columns[1], y, size: 10, font, color: rgb(0.06, 0.13, 0.2) });
  page.drawText(action.risk || "-", { x: columns[2], y, size: 10, font, color: rgb(0.06, 0.13, 0.2) });
  page.drawText(trimText(action.owner, 16), { x: columns[3], y, size: 10, font, color: rgb(0.06, 0.13, 0.2) });
  page.drawText(action.due, { x: columns[4], y, size: 10, font, color: rgb(0.06, 0.13, 0.2) });
  page.drawText(action.status, { x: columns[5], y, size: 10, font, color: rgb(0.06, 0.13, 0.2) });
  page.drawLine({ start: { x: 42, y: y - 10 }, end: { x: 800, y: y - 10 }, thickness: 0.8, color: rgb(0.9, 0.93, 0.96) });
}

function trimText(value: string, limit: number) {
  return value.length > limit ? `${value.slice(0, limit - 1)}...` : value;
}
