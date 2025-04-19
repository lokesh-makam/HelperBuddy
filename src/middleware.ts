import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const privateRoutes = createRouteMatcher([
    '/admin',
    '/partners',
    '/provider',
    '/profile',
    '/profile/address',
    '/profile/orders',
    '/profile/referral',
    '/profile/wallet',
    '/services/checkout',
]);
const publicRoutes = createRouteMatcher(['/sign-in', '/sign-up']);
const adminOnly = createRouteMatcher(['/admin']);

export default clerkMiddleware(async (auth, req) => {
    const { userId } = await auth();
    if (!userId&&privateRoutes(req)) {
        const signInUrl = new URL("/sign-in", req.url);
        return NextResponse.redirect(signInUrl);
    }
    if(userId) {
        const isAdmin = (await auth()).sessionClaims?.metadata?.role == "admin"
        // If accessing /admin but not an admin
        if (adminOnly(req) && !isAdmin) {
            return NextResponse.redirect(new URL("/", req.url));
        }
        if (!publicRoutes(req)) {
            if (!adminOnly(req) && isAdmin) {
                return NextResponse.redirect(new URL("/admin", req.url));
            }
        }else{
            return NextResponse.redirect(new URL("/", req.url));
        }
    }
    return NextResponse.next();
});

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
};
