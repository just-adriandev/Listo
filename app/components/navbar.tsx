import Link from "next/link";
import { ThemeToggle } from "./thetoggler";
import { Button } from "@/components/ui/button";
import {RegisterLink, LoginLink, LogoutLink} from "@kinde-oss/kinde-auth-nextjs/components";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import { UserNav } from "./usernav";

export async function Navbar(){

const {isAuthenticated, getUser} = getKindeServerSession(); 
const user = await getUser()

    return(
        <nav className="border-b bg-background h-[10vh] flex items-center">
            <div className="container flex items-center justify-between">

                <Link href={'/'}> <h1 className="font-bold text-3xl">Listo</h1> </Link>

                <div className="flex items-center gap-x-5">
                    <ThemeToggle/>
                    
                    {await isAuthenticated() ? (
                        <div className="flex items-center gap-x-5">                        
                    
                        <UserNav image={user?.picture as string}/>
                    
                        </div>
                    ) : (
                        <div className="flex items-center gap-x-5">                        
                    
                        <LoginLink><Button variant={"secondary"}>Entrar</Button></LoginLink>
                        <RegisterLink><Button>Registre-se</Button></RegisterLink>
                    
                        </div>
                    )}
                
                </div>

            </div>
        </nav>
    )
}