'use client'

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

export function SubmitBtn () {
    const { pending } = useFormStatus();

    return(

    <>
        
        {pending ? (
            <Button disabled className="w-fit"><Loader className="w-4 h-4 animate-spin"></Loader>
            
            </Button> // Loading state button here
        ): (
            <Button type="submit">
             Salvar alterações
            </Button>
        )}
        
    </>
    )
}

export function StripePortal() {
    const { pending } = useFormStatus();

    return(

        <>
            
            {pending ? (
                <Button disabled className="w-fit"><Loader className="w-4 h-4 animate-spin"></Loader>
                
                </Button> // Loading state button here
            ): (
                <Button className="w-fit" type="submit">
                 Gerenciar Assinatura
                </Button>
            )}
            
        </>
        )
}