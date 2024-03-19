'use client'

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Loader, Trash } from "lucide-react";

export function SubmitBtn () {
    const { pending } = useFormStatus();

    return(

    <>
        
        {pending ? (
            <Button disabled className="w-fit"><Loader className="w-4 h-4 animate-spin"></Loader>
            
            </Button> // Loading state button here
        ): (
            <Button type="submit">
             Salvar
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

export function DeleteBtn () {
    const { pending } = useFormStatus();

    return(

    <>
        
        {pending ? (
            <Button disabled variant='destructive' className="w-fit"><Loader className="w-4 h-4 animate-spin"></Loader>
            
            </Button>
        ): (
            <Button variant='destructive' size='icon'>
                <Trash className="w-4 h-4 "/>
            </Button>
        )}
        
    </>
    )
}