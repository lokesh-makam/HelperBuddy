"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {useSignIn, useUser} from "@clerk/nextjs";
import { SigninForm } from "@/src/components/auth/LoginForm";
import { AuthLayout } from "@/src/components/auth/AuthLayout";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signin = () => {
    const { isLoaded, signIn, setActive } = useSignIn();
    const [clerkError, setClerkError] = useState("");
    const router = useRouter();
    const { isSignedIn } = useUser();
    // if (isSignedIn) {
    //     router.push("/");
    // }
    const validateEmail = (email: string) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    const signInWithEmail = async ({ emailAddress, password }: { emailAddress: string; password: string }) => {
        if (!isLoaded) return;

        if (!validateEmail(emailAddress)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        try {
            const result = await signIn.create({
                identifier: emailAddress,
                password,
            });

            if (result.status === "complete" && result.createdSessionId) {
                await setActive({ session: result.createdSessionId });
                toast.success("Login successful!");
                router.push("/");
            } else {
                toast.error("Invalid credentials. Please try again.");
            }
        } catch (err: any) {
            console.error("Error during sign-in:", err);
            toast.error(err.errors?.[0]?.message || "An error occurred. Please try again.");
        }
    };

    const signInWithOAuth = async (provider: "oauth_google" | "oauth_apple") => {
        if (!signIn) return null;

        try {
            await signIn.authenticateWithRedirect({
                strategy: provider,
                redirectUrl: "/sign-up/sso-callback",
                redirectUrlComplete: "/",
            });
        } catch (err: any) {
            console.error("OAuth Sign-in Error:", err);
            toast.error(err.errors?.[0]?.message || "An error occurred. Please try again.");
        }
    };



    return (
        <AuthLayout>
            <SigninForm signInWithEmail={signInWithEmail} signInWithOAuth={signInWithOAuth} clerkError={clerkError} />
        </AuthLayout>
    );
};

export default Signin;
