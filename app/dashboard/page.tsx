
import { Button } from "@/components/ui/button";
import "../globals.css";
import Link from "next/link";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/lib/db";
import { Edit, File, Trash } from "lucide-react";
import { Card } from "@/components/ui/card";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";
import { DeleteBtn } from "../components/SubmitBtn";

async function getData(userId: string) {
    noStore()
    const data = await prisma.note.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc'
      },
    });

return data;
}    
export default async function DashboardPage(){

    const {getUser} = getKindeServerSession();
    const user = await getUser();
    const data = await getData(user?.id as string);
    
    async function DeleteNote(formData: FormData) {
        'use server'
        const noteId = formData.get('noteId') as string
        await prisma.note.delete({
            where: {
                id: noteId
            }
        })

        revalidatePath('/dashboard')
    }

    return(
        <div className="grid items-start gap-y-8">
            <div className="flex items-center justify-between px-2">
                <div className="grid gap-1">
                    <h1 className="text-3xl md:text-4xl ">Minhas Notas</h1>
                    <p className="text-sm text-muted-foreground">
                        Aqui você pode ver e gerenciar suas notas.
                    </p>
                </div>

                <Button asChild> 
                    <Link href="/dashboard/new">                       
                            Criar nota
                    </Link>
                </Button>

            </div>

    {data.length === 0 ? (

    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
        
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <File></File>
        </div>

        <h2 className="text-xl mt-6 font-semibold">Vazio</h2>
        
        <p className="text-sm text-muted-foreground mb-8 mt-2 text-center leading-6 max-w-sm mx-auto">
            No momento você ainda não possui nenhuma nota, clique no botão abaixo e comece.
        </p>

        <Button asChild> 
          <Link href="/dashboard/new">                       
          Criar nota
          </Link>
        </Button>

    </div>

) : (

    <div className="flex flex-col gap-y-4">
        {data.map((item) => (
            <Card key={item.id} className="flex items-center justify-between p-4"> 
                <div>

                    <h2 className="font-semibold mb-5 text-3xl text-primary">
                        {item.title}
                    </h2>

                    <p className="text-md mb-3">
                        {item.description}
                    </p>

                    <p className="text-muted-foreground text-xs">
                        <span>Criada em: </span>
                        {new Intl.DateTimeFormat('pt-BR', {
                            dateStyle: 'short',
                        }). format(new Date(item.createdAt))}
                    </p>

                </div>

                <div className="flex gap-x-4">
                    <Link href={`/dashboard/new/${item.id}`}>
                    <Button variant='outline' size='icon'>
                        <Edit className="w-4 h-4"/>
                    </Button>
                    </Link>

                    <form action={DeleteNote}>
                        <input type="hidden" name="noteId" value={item.id} />
                        <DeleteBtn />
                    </form>
                </div>
            </Card>
        ))}
    </div>   

    )}
        </div>
    )
}