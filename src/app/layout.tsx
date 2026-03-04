import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BREVET MASTER | Plateforme Gamifiée",
  description: "La plateforme ultime de préparation au Brevet des collèges. Révise en t'amusant !",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body
        className={`${inter.variable} ${bebasNeue.variable} antialiased min-h-screen bg-background text-white flex`}
      >
        <Providers>
          <Sidebar />
          <div className="flex-1 flex flex-col min-h-screen max-w-full overflow-hidden">
            <TopBar />
            <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}