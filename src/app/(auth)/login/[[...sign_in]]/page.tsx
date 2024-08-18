'use client'
import * as Clerk from '@clerk/elements/common'
import * as SignIn from '@clerk/elements/sign-in'
import Link from 'next/link'
import {Button} from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Icons} from '@/components/ui/icons'
import {cn} from '@/lib/utils'

export default function SignInPage() {
    return (
        <div className={"w-screen h-[80vh] flex justify-center items-center"}>
            <div className="grid w-full grow items-center px-4 sm:justify-center">
                <SignIn.Root>
                    <Clerk.Loading>
                        {(isGlobalLoading) => (
                            <>
                                <SignIn.Step name="start">
                                    <Card className="w-full sm:w-96">
                                        <CardHeader>
                                            <CardTitle>Sign in to Nelsh</CardTitle>
                                            <CardDescription>Welcome back! Please sign in to continue</CardDescription>
                                        </CardHeader>
                                        <CardContent className="grid gap-y-4">

                                            <Clerk.Field name="identifier" className="space-y-2">
                                                <Clerk.Label asChild>
                                                    <Label>Email</Label>
                                                </Clerk.Label>
                                                <Clerk.Input type="email" required asChild>
                                                    <Input/>
                                                </Clerk.Input>
                                                <Clerk.FieldError className="block text-sm text-destructive"/>
                                            </Clerk.Field>
                                        </CardContent>
                                        <CardFooter>
                                            <div className="grid w-full gap-y-4">
                                                <SignIn.Action submit asChild>
                                                    <Button disabled={isGlobalLoading}>
                                                        <Clerk.Loading>
                                                            {(isLoading) => {
                                                                return isLoading ? (
                                                                    <Icons.spinner className="size-4 animate-spin"/>
                                                                ) : (
                                                                    'Continue'
                                                                )
                                                            }}
                                                        </Clerk.Loading>
                                                    </Button>
                                                </SignIn.Action>

                                                <Button variant="link" size="sm" asChild>
                                                    <Link href="/join">Don&apos;t have an account? Sign up</Link>
                                                </Button>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                </SignIn.Step>


                                <SignIn.Step name="verifications">
                                    <SignIn.Strategy name="password">
                                        <Card className="w-full sm:w-96">
                                            <CardHeader>
                                                <CardTitle>Check your email</CardTitle>
                                                <CardDescription>
                                                    Enter the verification code sent to your email
                                                </CardDescription>
                                                <p className="text-sm text-muted-foreground">
                                                    Welcome back <SignIn.SafeIdentifier/>
                                                </p>
                                            </CardHeader>
                                            <CardContent className="grid gap-y-4">
                                                <Clerk.Field name="password" className="space-y-2">
                                                    <Clerk.Label asChild>
                                                        <Label>Password</Label>
                                                    </Clerk.Label>
                                                    <Clerk.Input type="password" asChild>
                                                        <Input/>
                                                    </Clerk.Input>
                                                    <Clerk.FieldError className="block text-sm text-destructive"/>
                                                </Clerk.Field>
                                            </CardContent>
                                            <CardFooter>
                                                <div className="grid w-full gap-y-4">
                                                    <SignIn.Action submit asChild>
                                                        <Button disabled={isGlobalLoading}>
                                                            <Clerk.Loading>
                                                                {(isLoading) => {
                                                                    return isLoading ? (
                                                                        <Icons.spinner className="size-4 animate-spin"/>
                                                                    ) : (
                                                                        'Continue'
                                                                    )
                                                                }}
                                                            </Clerk.Loading>
                                                        </Button>
                                                    </SignIn.Action>

                                                </div>
                                            </CardFooter>
                                        </Card>
                                    </SignIn.Strategy>

                                    <SignIn.Strategy name="email_code">
                                        <Card className="w-full sm:w-96">
                                            <CardHeader>
                                                <CardTitle>Check your email</CardTitle>
                                                <CardDescription>
                                                    Enter the verification code sent to your email
                                                </CardDescription>

                                            </CardHeader>
                                            <CardContent className="grid gap-y-4">
                                                <Clerk.Field name="code">
                                                    <Clerk.Label className="sr-only">Email verification
                                                        code</Clerk.Label>
                                                    <div className="grid gap-y-2 items-center justify-center">
                                                        <div className="flex justify-center text-center">
                                                            <Clerk.Input
                                                                type="otp"
                                                                autoSubmit
                                                                className="flex justify-center has-[:disabled]:opacity-50"
                                                                render={({value, status}) => {
                                                                    return (
                                                                        <div
                                                                            data-status={status}
                                                                            className="relative flex h-9 w-9 items-center justify-center border-y border-r border-input text-sm shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md data-[status=selected]:ring-1 data-[status=selected]:ring-ring data-[status=cursor]:ring-1 data-[status=cursor]:ring-ring"
                                                                        >
                                                                            {value}
                                                                        </div>
                                                                    )
                                                                }}
                                                            />
                                                        </div>
                                                        <Clerk.FieldError
                                                            className="block text-sm text-destructive text-center"/>
                                                        <SignIn.Action
                                                            asChild
                                                            resend
                                                            className="text-muted-foreground"
                                                            fallback={({resendableAfter}) => (
                                                                <Button variant="link" size="sm" disabled>
                                                                    Didn&apos;t receive a code? Resend (
                                                                    <span
                                                                        className="tabular-nums">{resendableAfter}</span>)
                                                                </Button>
                                                            )}
                                                        >
                                                            <Button variant="link" size="sm">
                                                                Didn&apos;t receive a code? Resend
                                                            </Button>
                                                        </SignIn.Action>
                                                    </div>
                                                </Clerk.Field>
                                            </CardContent>
                                            <CardFooter>
                                                <div className="grid w-full gap-y-4">
                                                    <SignIn.Action submit asChild>
                                                        <Button disabled={isGlobalLoading}>
                                                            <Clerk.Loading>
                                                                {(isLoading) => {
                                                                    return isLoading ? (
                                                                        <Icons.spinner className="size-4 animate-spin"/>
                                                                    ) : (
                                                                        'Continue'
                                                                    )
                                                                }}
                                                            </Clerk.Loading>
                                                        </Button>
                                                    </SignIn.Action>
                                                </div>
                                            </CardFooter>
                                        </Card>
                                    </SignIn.Strategy>
                                </SignIn.Step>
                            </>
                        )}
                    </Clerk.Loading>
                </SignIn.Root>
            </div>
        </div>
    )
}