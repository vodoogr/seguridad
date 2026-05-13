import { NextResponse } from "next/server";
import { getSql, hasDatabase } from "../../../../lib/db";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  if (!hasDatabase) {
    return NextResponse.json({ error: "Base de datos no configurada" }, { status: 404 });
  }

  const sql = getSql();
  const [document] = await sql`
    select file_name, file_type, file_data
    from committee_meeting_documents
    where id = ${Number(params.id)}
    limit 1
  `;

  if (!document?.file_data) {
    return NextResponse.json({ error: "Adjunto no encontrado" }, { status: 404 });
  }

  const fileData = document.file_data instanceof Uint8Array ? document.file_data : Buffer.from(document.file_data);

  return new NextResponse(fileData, {
    headers: {
      "Content-Disposition": `attachment; filename="${document.file_name}"`,
      "Content-Type": document.file_type || "application/octet-stream"
    }
  });
}
