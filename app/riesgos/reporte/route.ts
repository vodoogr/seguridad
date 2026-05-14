import { PDFFont, PDFDocument, PDFPage, StandardFonts, rgb } from "pdf-lib";
import { NextRequest, NextResponse } from "next/server";
import { getSql, hasDatabase } from "../../../lib/db";
import { getCompanyLogo } from "../../../lib/settings";
import { risks as mockRisks } from "../../data";

type RiskRow = {
  id: string;
  area: string;
  risk: string;
  level: string;
  owner: string;
  due: string;
  status: string;
};

export async function GET(request: NextRequest) {
  const filters = {
    area: request.nextUrl.searchParams.get("area") ?? "",
    level: request.nextUrl.searchParams.get("level") ?? "",
    owner: request.nextUrl.searchParams.get("owner") ?? "",
    status: request.nextUrl.searchParams.get("status") ?? ""
  };

  const risks = hasDatabase ? await getReportRisks(filters) : getMockRisks(filters);
  const pdf = await PDFDocument.create();
  let page = pdf.addPage([842, 595]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const logo = await getCompanyLogo();
  let cursorY = 540;

  if (logo?.file_data) {
    const imageBytes = logo.file_data instanceof Uint8Array ? logo.file_data : Buffer.from(logo.file_data);
    const image = logo.file_type === "image/png" ? await pdf.embedPng(imageBytes) : await pdf.embedJpg(imageBytes);
    const scaled = image.scale(0.22);
    page.drawImage(image, { x: 42, y: 500, width: scaled.width, height: scaled.height });
  }

  page.drawText("Inventario de riesgos", { x: 170, y: 540, size: 22, font: bold, color: rgb(0.06, 0.19, 0.37) });
  page.drawText(`Filtros: ${buildFilterLabel(filters)}`, { x: 170, y: 516, size: 11, font, color: rgb(0.38, 0.45, 0.54) });
  page.drawLine({ start: { x: 42, y: 490 }, end: { x: 800, y: 490 }, thickness: 1, color: rgb(0.84, 0.89, 0.93) });

  const headers = ["Codigo", "Area", "Descripcion del riesgo", "Nivel", "Estado", "Responsable", "Fecha"];
  const columns = [42, 105, 190, 475, 545, 625, 730];
  const descriptionWidth = 270;

  drawHeader(page, headers, columns, bold);
  cursorY = 442;

  for (const risk of risks) {
    const wrappedArea = wrapText(risk.area, font, 10, 74);
    const wrappedRisk = wrapText(risk.risk, font, 10, descriptionWidth);
    const wrappedOwner = wrapText(risk.owner, font, 10, 96);
    const lineCount = Math.max(wrappedArea.length, wrappedRisk.length, wrappedOwner.length, 1);
    const rowHeight = Math.max(26, lineCount * 12 + 10);

    if (cursorY - rowHeight < 70) {
      page = pdf.addPage([842, 595]);
      drawHeader(page, headers, columns, bold, 540, 528);
      cursorY = 504;
    }

    drawRiskRow(page, risk, columns, cursorY, font, bold, wrappedArea, wrappedRisk, wrappedOwner, rowHeight);
    cursorY -= rowHeight;
  }

  const bytes = await pdf.save();
  return new NextResponse(bytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="inventario-riesgos.pdf"'
    }
  });
}

async function getReportRisks(filters: { area: string; level: string; owner: string; status: string }) {
  const sql = getSql();
  const rows = await sql`
    select id, area, risk, level, owner, to_char(due_date, 'DD/MM/YYYY') as due, status
    from risks
    where (${filters.area} = '' or area = ${filters.area})
      and (${filters.level} = '' or level = ${filters.level})
      and (${filters.owner} = '' or owner = ${filters.owner})
      and (${filters.status} = '' or status = ${filters.status})
    order by due_date asc
  `;

  return rows as RiskRow[];
}

function getMockRisks(filters: { area: string; level: string; owner: string; status: string }) {
  return mockRisks.filter((risk) => {
    if (filters.area && risk.area !== filters.area) return false;
    if (filters.level && risk.level !== filters.level) return false;
    if (filters.owner && risk.owner !== filters.owner) return false;
    if (filters.status && risk.status !== filters.status) return false;
    return true;
  });
}

function drawHeader(page: PDFPage, headers: string[], columns: number[], font: PDFFont, y = 466, lineY = 454) {
  headers.forEach((header, index) => {
    page.drawText(header, { x: columns[index], y, size: 10, font, color: rgb(0.38, 0.45, 0.54) });
  });
  page.drawLine({ start: { x: 42, y: lineY }, end: { x: 800, y: lineY }, thickness: 1, color: rgb(0.84, 0.89, 0.93) });
}

function drawRiskRow(
  page: PDFPage,
  risk: RiskRow,
  columns: number[],
  y: number,
  font: PDFFont,
  bold: PDFFont,
  wrappedArea: string[],
  wrappedRisk: string[],
  wrappedOwner: string[],
  rowHeight: number
) {
  page.drawText(risk.id, { x: columns[0], y, size: 10, font: bold, color: rgb(0.06, 0.13, 0.2) });
  wrappedArea.forEach((line, index) => {
    page.drawText(line, { x: columns[1], y: y - index * 12, size: 10, font, color: rgb(0.06, 0.13, 0.2) });
  });
  wrappedRisk.forEach((line, index) => {
    page.drawText(line, { x: columns[2], y: y - index * 12, size: 10, font, color: rgb(0.06, 0.13, 0.2) });
  });
  page.drawText(risk.level, { x: columns[3], y, size: 10, font, color: rgb(0.06, 0.13, 0.2) });
  page.drawText(risk.status, { x: columns[4], y, size: 10, font, color: rgb(0.06, 0.13, 0.2) });
  wrappedOwner.forEach((line, index) => {
    page.drawText(line, { x: columns[5], y: y - index * 12, size: 10, font, color: rgb(0.06, 0.13, 0.2) });
  });
  page.drawText(risk.due, { x: columns[6], y, size: 10, font, color: rgb(0.06, 0.13, 0.2) });
  page.drawLine({ start: { x: 42, y: y - rowHeight + 10 }, end: { x: 800, y: y - rowHeight + 10 }, thickness: 0.8, color: rgb(0.9, 0.93, 0.96) });
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

function buildFilterLabel(filters: { area: string; level: string; owner: string; status: string }) {
  const parts = [];
  if (filters.area) parts.push(`Area ${filters.area}`);
  if (filters.level) parts.push(`Nivel ${filters.level}`);
  if (filters.owner) parts.push(`Responsable ${filters.owner}`);
  if (filters.status) parts.push(`Estado ${filters.status}`);
  return parts.length ? parts.join(" | ") : "Todas";
}
