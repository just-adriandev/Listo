import { SubmitBtn } from "@/app/components/SubmitBtn";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import prisma from "@/lib/db";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";

async function getData(userId: string) {
    noStore();
    const data = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            name:true,
            email:true,
            colorScheme:true
        },
    });

return data;
}

export default async function SetPage(){
    const {getUser} = getKindeServerSession();
    const user = await getUser();
    const data = await getData(user?.id as string);

    async function postData(formData : FormData){
    'use server'

    const name = formData.get('name') as string;
    const colorScheme = formData.get("tema") as string; 

        await prisma.user.update({
            where: {
                id: user?.id,
            },
            data: {
                name: name ?? undefined,
                colorScheme: colorScheme ?? undefined,
            },
        });

    revalidatePath('/', 'layout')
    }

    return(
        <div className="grid items-start gap-8">
            <div className="flex items-center justify-between px-2">
                <div className="grid gap-1">
                    <h1 className="text-3xl md:text-4xl ">Configurações</h1>
                </div>
            </div>
        
        <Card>
            <form action={postData} > 
                <CardHeader>
                    <CardTitle>Configurações gerais</CardTitle>
                </CardHeader>

               <CardContent>
                <div className="space-y-1">

                    <div className="space-y-2">
                        <Label>Nome</Label>
                        <Input name='name' id='name' placeholder="Nome" type="text" defaultValue={data?.name ?? undefined}/>
                    </div>

                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input name='email' id='email' placeholder="Email" type="email" disabled defaultValue={data?.email ?? undefined}/>
                    </div>

                    <div className="space-y-2">
                        <Label>Tema</Label>
                        <Select name="tema" defaultValue={data?.colorScheme}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder='Selecione um tema' />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="theme-green">Verde</SelectItem>           
                                    <SelectItem value="theme-blue">Azul</SelectItem> 
                                    <SelectItem value="theme-cammo">Verde Musgo</SelectItem>          
                                    <SelectItem value="theme-orange">Laranja</SelectItem>                                   
                                    <SelectItem value="theme-rose">Rosa</SelectItem> 
                                </SelectGroup>
                            </SelectContent>
                        
                        </Select>
                    </div>

                </div>
               </CardContent>

               <CardFooter>
                <SubmitBtn/>
               </CardFooter>
            </form>
        </Card>
        
        </div>
    )
}