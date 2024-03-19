import { SubmitBtn } from "@/app/components/SubmitBtn";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";


export default async function NewnoteRoute () {
    noStore()
const {getUser} = getKindeServerSession();
const user = await getUser();

    async function postData (formData: FormData) {
        'use server'
        
        if (!user){
            throw new Error('Not authorized')
        }
        
const title = formData.get('title') as string;
const description = formData.get("desc") as string;
        
    await prisma.note.create({
        data: {
            userId: user?.id,
            title: title,
            description: description,
            },
        });
        return  redirect('/dashboard')
        }

    return (
        <Card>
            <form action={postData}>
                <CardHeader>
                    <CardTitle>Nova nota</CardTitle>
                </CardHeader>

                <CardContent className="flex flex-col gap-y-5">
                    <div className="gap-y-2 flex flex-col">
                        <Label>Titulo</Label>
                        <Input required type="text" name="title" placeholder="Titulo da nota"/>
                    </div>

                    <div className="gap-y-2 flex flex-col">
                        <Label>Descrição</Label>
                        <Textarea required name="desc" placeholder="Descreva sua nota adicionando detalhes, passos e o que mais você quiser"/>
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