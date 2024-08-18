"use client"

import {Button} from "@/components/ui/button";
import {useUser} from "@clerk/nextjs";

import {ArrowLeftIcon, LoaderCircle} from "lucide-react";
import Link from "next/link";
import {ArrowRightIcon} from "@radix-ui/react-icons";
import BlurFade from "@/components/magicui/blur-fade";

export function LandingButtons() {
    const user = useUser()
    return (
        <div className={"mt-10 flex justify-center gap-x-6"}>
            {user.isLoaded && user.isSignedIn ? <BlurFade delay={0.45} inView ><Button variant={"outline"}><Link href={"/dashboard"}>Dashboard</Link></Button></BlurFade> : null}
            {user.isLoaded && !user.isSignedIn ? (
                <BlurFade delay={0.25}>
                    <Button asChild Icon={ArrowRightIcon} iconPlacement={"right"} variant={"expandIcon"}><Link
                        href={"/join"}>Get Started</Link></Button>
                    <Button variant={"link"} asChild><Link href={"/login"}>Login</Link></Button>
                </BlurFade>
            ) : null}



        </div>
    )
}