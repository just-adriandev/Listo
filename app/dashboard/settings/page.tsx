import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import prisma from "@/lib/db";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";

interface Data {
    name?: string;
    email?: string;
    colorScheme?: string;
  }

async function getData(userId: string): Promise <Data> {
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



    return(
        <div className="grid items-start gap-8">
            <div className="flex items-center justify-between px-2">
                <div className="grid gap-1">
                    <h1 className="text-3xl md:text-4xl ">Configurações</h1>
                    <p className="text-lg text-muted-foreground">Configurações do seu perfil</p>
                </div>
            </div>
        
        <Card>
            <form> 
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
                                    <SelectItem value="theme-orange">Laranja</SelectItem>           
                                </SelectGroup>
                            </SelectContent>
                        
                        </Select>
                    </div>

                </div>
               </CardContent>

               <CardFooter>
                <Button>Salvar alterações</Button>
               </CardFooter>
            </form>
        </Card>
        
        </div>
    )
}