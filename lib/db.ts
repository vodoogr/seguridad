import { neon } from "@neondatabase/serverless";

export const hasDatabase = Boolean(process.env.DATABASE_URL);

export function getSql() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL no configurada");
  }

  return neon(process.env.DATABASE_URL);
}
