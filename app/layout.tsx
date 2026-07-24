import type { Metadata } from "next";
import { RoleSwitcher } from "@/components/shared/RoleSwitcher";
import "./globals.css";

export const metadata: Metadata = {
  title: "SKAN - Sistem Kantin Sekolah",
  description: "Pesan makanan dari 5 gerai kantin sekolah dengan mudah dan cepat.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="min-h-screen bg-slate-100 text-slate-900">
        <RoleSwitcher />
        {children}
      </body>
    </html>
  );
}
