import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/layout/theme-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "DocuAI — Verstehe jedes Dokument in Sekunden",
  description:
    "Lade PDFs hoch, erhalte KI-Zusammenfassungen, chatte mit deinen Dokumenten und generiere Lernkarten. Für Studenten, Freelancer und Profis.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "DocuAI",
    description: "KI-gestützte Dokumentenanalyse für alle.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              className: "!bg-card !text-card-foreground !border !border-border",
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
