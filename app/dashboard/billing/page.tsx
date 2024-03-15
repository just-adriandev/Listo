import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { PrismaClient } from "@prisma/client";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import { getStripeSession, stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import { StripePortal } from "@/app/components/SubmitBtn";

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
        customerId: dbUser.stripeCustomerId as string,
        domainUrl:'http://localhost:3000',
        priceId: process.env.STRIPE_PRICE_ID as string, 
    });

    return redirect(subscriptionUrl);
}

async function createCustomerPortal() {
    "use server";
    const session = await stripe.billingPortal.sessions.create({
      customer: data?.user.stripeCustomerId as string,
      return_url:"http://localhost:3000/dashboard",
    });

    return redirect(session.url);
  }

if (data?.status === "active") {
    return (
      <div className="grid items-start gap-8">

        <div className="flex items-center justify-between px-2">
          <div className="grid gap-1">
            <h1 className="text-3xl md:text-4xl ">Assinatura</h1>
          </div>
        </div>

        <Card className="w-full lg:w-2/3">
          <CardHeader>
            <CardTitle>Editar Assinatura</CardTitle>
            <CardDescription>
              Clicando no botão abaixo você pode gerenciar a sua assinatura.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createCustomerPortal}>
              <StripePortal />
            </form>
          </CardContent>
        </Card>

      </div>
    );
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
                                <Button className="w-full"> Assinar </Button>
                            </form>

                </div>
            
            </Card>
        </div>
    )
}