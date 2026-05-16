import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? "http://localhost:3000"),
  title: "27º Batalhão de Infantaria Paraquedista",
  description: "Brigada de Infantaria Paraquedista — Sistema institucional, recrutamento e gestão de candidatos.",
  openGraph: { title: "27º BI Pqdt", description: "Forja de soldados paraquedistas.", type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="min-h-screen bg-ink-900 antialiased">
        <Providers>{children}</Providers>
        <Toaster theme="dark" position="top-right" richColors />
      </body>
    </html>
  );
}
