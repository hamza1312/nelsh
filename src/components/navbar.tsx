"use client"


import {Cloud, LoaderCircle} from 'lucide-react'
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {UserButton, useUser} from "@clerk/nextjs";


export function Navbar() {

    const user = useUser()


    return (
            <nav className={"sticky top-0 z-50"}>
                <div className={"max-w-screen-xl flex flex-wrap items-center mx-auto justify-between  p-4"}>

                    <Link href={"/"}><h1 className={"font-bold text-primary flex flex-row gap-1 text-lg"}><Cloud
                        className={"mt-0.5"}/> Nelsh</h1></Link>


                    {user.isLoaded ? <div className={"flex flex-row gap-2"}>
                            {!user.isSignedIn ? (
                                <>
                                    <Button asChild variant={"outline"}><Link href={"/login"}>Login</Link></Button>
                                    <Button asChild><Link href={"/join"}>
                                        Join
                                    </Link></Button>
                                </>
                            ) : (
                                <>
                                    <Button className={"mr-2"} variant={"gooeyRight"}  size={"sm"}><Link href={"/dashboard"}>Dashboard</Link></Button>
                                    <UserButton/>
                                </>
                            )
                            }
                        </div> :
                        <div className={"flex p-1"}><LoaderCircle className={"text-blue-600 animate-spin"}/></div>}
                </div>
            </nav>
    )
}