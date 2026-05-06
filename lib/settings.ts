import { getSql, hasDatabase } from "./db";

export async function getAccessCode() {
  if (!hasDatabase) return process.env.APP_ACCESS_CODE ?? "";

  const sql = getSql();
  const [setting] = await sql`
    select value
    from app_settings
    where key = 'APP_ACCESS_CODE'
    limit 1
  `;

  return setting?.value ?? process.env.APP_ACCESS_CODE ?? "";
}
