import { NextResponse } from "next/server";
import { getCompanyLogo } from "../../../lib/settings";

export async function GET() {
  const logo = await getCompanyLogo();

  if (!logo?.file_data) {
    return new NextResponse(null, { status: 404 });
  }

  const fileData = logo.file_data instanceof Uint8Array ? logo.file_data : Buffer.from(logo.file_data);

  return new NextResponse(fileData, {
    headers: {
      "Content-Type": logo.file_type || "application/octet-stream",
      "Cache-Control": "no-store"
    }
  });
}
