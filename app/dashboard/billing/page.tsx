import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { PrismaClient } from "@prisma/client";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import { getStripeSession } from "@/lib/stripe";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

const Vantagens = [
    {name: 'Acesso a versão premium'}
]

async function getData(userId: string) {
    const data = await prisma.subscription.findUnique({
      where: {
        userId: userId,
      },
      select: {
        status: true,
        user: {
          select: { stripeCustomerId: true },
        },
      },
    });

if (data?.user) {
    const stripeCustomerId = data.user.stripeCustomerId;
    return { ...data, stripeCustomerId };
  }

return data;
}

export default async function BillingPage() {

const {getUser} = getKindeServerSession();
const user = await getUser();
const data = await getData(user?.id as string);

async function createSubscription() {
    'use server'
    
    const dbUser = await prisma.user.findUnique({
        where: {
          id: user?.id
        },
        select: {
           stripeCustomerId: true,
        },
      });

      
    if (!dbUser?.stripeCustomerId) {
        throw new Error('unable to get customer ID')
    }

    const subscriptionUrl = await getStripeSession({
        customerId: dbUser.stripeCustomerId,
        domainUrl:'http://localhost:3000',
        priceId: process.env.STRIPE_PRICE_ID as string, 
    });

    return redirect(subscriptionUrl);
}


    return (
        <div className="max-w-md mx-auto space-y-3">
            <Card className='flex flex-col'>
                <CardContent className="py-8">
                    <div className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-primary/10 text-primary"><h3>
                    Mensal        
                    </h3></div>

                    <div className="mt-4 flex items-baseline text-6xl font-extrabold">
                        R$ 3 <span className="ml-1 text-2xl text-muted-foreground">mês</span>
                    </div>
                    
                    <p className="mt-5 text-lg text-muted-foreground">Colabore com a criação do sistema e tenha acesso ao futuro modo premium, que já está em desenvolvimento.</p>
                </CardContent>
                
                <div className="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 bg-primary/10 rounded-lg m-1 space-y-6 sm:p-10 sm:p-6">
                    <ul className="space-y-4">
                        {Vantagens.map((item, index) => (
                        <li key={index} className="flex itens-center">

                            <div className="flex-shrink-0">
                                <CheckCircle2 className="w-6 text-green-800 h-6"/>
                            </div>

                            <p className="ml-3 text-base ">{item.name}</p>

                        </li>    
                        ) )}
                    </ul>

                            <form className="w-full" action={createSubscription}>
                                <Button className="w-full"> Assine </Button>
                            </form>

                </div>
            
            </Card>
        </div>
    )
}