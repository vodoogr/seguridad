import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Seguridad Almacen",
  description: "Gestion de PRL y comite de seguridad para almacenes"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
