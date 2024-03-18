import { SubmitBtn } from "@/app/components/SubmitBtn";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import prisma from "@/lib/db";

async function getData({userId, noteId}: {userId: string, noteId: string}) {
const data = await prisma.note.findUnique({
    where: {
        id: '',
        userId: '',
    }
})
}
export default function DynamicRoute() {
    return  (
        <Card>
            <form action=''>
                <CardHeader>
                    <CardTitle>Editar nota</CardTitle>
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