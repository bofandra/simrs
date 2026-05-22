import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "SIMRS Prototype",
  description:
    "Prototype SIMRS berbasis Next.js yang merangkum alur layanan, modul inti, dan kebutuhan kepatuhan rumah sakit.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
