import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import { ThemeToggle } from "./components/thetoggler";
import { Navbar } from "./components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Listo",
  description: "Mantenha-se organizado e gerencie tarefas com facilidade em nosso site de listas de tarefas. Crie, priorize e acompanhe o progresso com nossa interface intuitiva. Perfeito para indivíduos, equipes e empresas. Experimente agora!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
           
              <Navbar/>
              {children}

          </ThemeProvider>
      </body>
    </html>
  );
}
