import { neon } from "@neondatabase/serverless";

export const hasDatabase = Boolean(process.env.DATABASE_URL);

export function getSql() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL no configurada");
  }

  return neon(process.env.DATABASE_URL);
}

export function getDatabaseInfo() {
  if (!process.env.DATABASE_URL) {
    return {
      connected: false,
      host: "No configurada",
      database: "No configurada"
    };
  }

  const url = new URL(process.env.DATABASE_URL);

  return {
    connected: true,
    host: url.hostname,
    database: url.pathname.replace("/", "") || "Sin nombre"
  };
}
