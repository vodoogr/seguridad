import { getSql, hasDatabase } from "./db";

export async function getAccessCode() {
  if (!hasDatabase) return process.env.APP_ACCESS_CODE ?? "";

  try {
    const sql = getSql();
    const [setting] = await sql`
      select value
      from app_settings
      where key = 'APP_ACCESS_CODE'
      limit 1
    `;

    return setting?.value ?? process.env.APP_ACCESS_CODE ?? "";
  } catch {
    return process.env.APP_ACCESS_CODE ?? "";
  }
}

export async function getCompanyLogo() {
  if (!hasDatabase) return null;

  try {
    const sql = getSql();
    const [asset] = await sql`
      select file_name, file_type, file_data
      from app_assets
      where key = 'COMPANY_LOGO'
      limit 1
    `;

    return asset ?? null;
  } catch {
    return null;
  }
}
