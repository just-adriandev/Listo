import { ReactNode } from 'react';
import { DashboardNav } from '../components/dashboardNavbar';
import { redirect } from 'next/navigation';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from '@/lib/db';
import { stripe } from '@/lib/stripe';
import {unstable_noStore as noStore } from "next/cache";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  async function getData({
    email,
    id,
    firstName,
    lastName,
    profileImage,
  }: {
    email: string;
    id: string;
    firstName: string | undefined | null;
    lastName: string | undefined | null;
    profileImage: string | undefined | null;
  }) {

    noStore()
    
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        stripeCustomerId: true,
      },

    });

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      if (existingUser) {
        await prisma.user.update({
          where: {
            id: existingUser.id,
          },
          data: {
            id: id,
            email: email,
            name: `${firstName?? ''} ${lastName?? ''}`,
          },
        });
      } else {
        await prisma.user.create({
          data: {
            id: id,
            email: email,
            name: `${firstName?? ''} ${lastName?? ''}`,
          },
        });
      }
    }
  
    if (!user?.stripeCustomerId &&!existingUser?.stripeCustomerId) {
      const data = await stripe.customers.create({
        email: email,
      });
  

      await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          stripeCustomerId: data.id,
        },
      });

    }
  }

  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) {
    return redirect('/');
  }

  await getData({
    email: user.email as string,
    id: user.id as string,
    firstName: user.given_name as string,
    lastName: user.family_name as string,
    profileImage: user.picture as string,
  });

  return (
    <div className='flex flex-col space-y-6 mt-10'>
      <div className='container grid flex-1 gap-12 md:grid-cols-[200px_1fr]'>
        <aside className='hidden w-[200px] flex-col md:flex'>
          <DashboardNav />
        </aside>
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}