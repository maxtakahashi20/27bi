import "./globals.css";
import type { Metadata } from "next";
import { Bebas_Neue, Cinzel, Source_Serif_4 } from "next/font/google";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? "http://localhost:3000"),
  title: "27º Batalhão de Infantaria Paraquedista",
  description:
    "Brigada de Infantaria Paraquedista — Sistema institucional, recrutamento e gestão de candidatos.",
  openGraph: { title: "27º BI Pqdt", description: "Forja de soldados paraquedistas.", type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`dark ${bebas.variable} ${cinzel.variable} ${sourceSerif.variable}`}
      style={{ backgroundColor: "#0a0a0a", color: "#f0ede6" }}
    >
      <body
        className="min-h-screen bg-tactical font-body text-ice antialiased"
        style={{ backgroundColor: "#0a0a0a", color: "#f0ede6", minHeight: "100vh" }}
      >
        <Providers>{children}</Providers>
        <Toaster theme="dark" position="top-right" richColors />
      </body>
    </html>
  );
}
