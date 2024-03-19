import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import { ThemeToggle } from "./components/thetoggler";
import { Navbar } from "./components/navbar";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/lib/db";
import {unstable_noStore as noStore } from "next/cache";

const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "Listo",
  description: "Mantenha-se organizado e gerencie tarefas com facilidade em nosso site de listas de tarefas. Crie, priorize e acompanhe o progresso com nossa interface intuitiva. Perfeito para indivíduos, equipes e empresas. Experimente agora!",
};

async function getData(userId: string){
  noStore()

  if (userId) {
    const data = await prisma.user.findUnique({
      where: {
        id:userId,
      },
      select:{
        colorScheme:true
      },
    });
    return data;
  }
  
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
const {getUser} = getKindeServerSession();
const user = await  getUser();
const data = await getData(user?.id as string);

  return (
    <html lang="en">
      <body className={`${inter.className} ${data?.colorScheme ?? 'theme-cammo'}`}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
           
              <Navbar/>
              {children}

          </ThemeProvider>
      </body>
    </html>
  );
}
