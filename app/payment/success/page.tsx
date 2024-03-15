import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Home } from "lucide-react";
import Link from "next/link";

export default function successRoute(){
    return(
        <div className="w-full min-h-[80vh] flex items-center justify-center">
            <Card className="w-[350px]">
                <div className="p-6">
                    <div className="w-full flex justify-center">
                        <Check className="w-12 h-12 rounded-full bg-green-500/30 text-green-500 p-2"/>
                    </div>

                    <div className="mt-3 text-center sm:mt-5 w-full">

                        <h3 className="text-lg leading-6 font-medium">Assinatura realizada com sucesso</h3>

                        <div className="mt-2">
                            <p className="text-sm text-muted-foreground">
                                Agradecemos pela sua contribuição, agora você é PREMIUM e pode desfrutar de todos os benenficios.
                            </p>
                        </div>

                        <div className="mt-5 sm:mt-6 w-full">
                            <Button className="w-full" asChild>
                                <Link href='/dashboard'><Home className="h-4 w-4 mr-1" />Inicio</Link>
                            </Button>
                        </div>

                    </div>
                </div>
            </Card>
        </div>
    )
}