import { SubmitBtn } from "@/app/components/SubmitBtn";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import prisma from "@/lib/db";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";

async function getData({userId, noteId}: {userId: string, noteId: string}) {
    noStore()
const data = await prisma.note.findUnique({
    where: {
        id: noteId,
        userId: userId,
    }, 
    select: {
        id: true,
        title: true,
        description: true,
    },
});
return data;
}
export default async function DynamicRoute({
    params, 
}: {
    params: {
        id: string;
    };
}) {

    const {getUser} = getKindeServerSession();
    const user = await getUser();
    const data = await getData({userId: user?.id as string, noteId: params.id});

    async function postData (formData: FormData) {
        'use server'
        
        if (!user){
            throw new Error('Not allowed')
        }
        
const title = formData.get('title') as string;
const description = formData.get('description') as string;
        
    await prisma.note.update({
        where: {
            id: data?.id,
            userId: user?.id,        
            },
            data: {
                description: description,
                title: title,
            },
        });
        return  redirect('/dashboard')
        }

    return  (
        <Card>
            <form action={postData}>
                <CardHeader>
                    <CardTitle>Editar nota</CardTitle>
                </CardHeader>

                <CardContent className="flex flex-col gap-y-5">
                    <div className="gap-y-2 flex flex-col">
                        <Label>Titulo</Label>
                        <Input required type="text" name="title" defaultValue={data?.title} placeholder="Titulo da nota"/>
                    </div>

                    <div className="gap-y-2 flex flex-col">
                        <Label>Descrição</Label>
                        <Textarea name="description" defaultValue={data?.description ?? ''} placeholder="Descreva sua nota adicionando detalhes, passos e o que mais você quiser"/>
                    </div>
                </CardContent>

                <CardFooter>
                    <div className="flex justify-end">

                        <Button  className="mr-3" asChild variant={"destructive"}>
                            <Link href='/dashboard'>Cancelar</Link>
                        </Button>

                            <SubmitBtn />

                    </div>
                </CardFooter>
            
            </form>
        </Card>
    )
}