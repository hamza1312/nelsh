import { clerkMiddleware } from '@clerk/nextjs/server'
import {NextResponse} from "next/server";


const protectedRoutes = [
    "/dashboard",
]
// Make sure that the `/api/webhooks/(.*)` route is not protected here
export default clerkMiddleware(
    (auth, request) => {
        if (!auth().userId) {
            if (protectedRoutes.includes(request.nextUrl.pathname)) {
                return NextResponse.redirect(new URL("/", request.url))
            }
        }
    }
)

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}