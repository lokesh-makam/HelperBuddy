"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {useSignIn, useSignUp, useUser} from "@clerk/nextjs";
import { RegisterForm } from "@/src/components/auth/RegisterForm";
import { VerifyForm } from "@/src/components/auth/VerifyForm";
import {AuthLayout} from "@/src/components/auth/AuthLayout";
import {toast} from "react-toastify";

const Signup = () => {
    const { isLoaded, signUp, setActive } = useSignUp();
    const [clerkError, setClerkError] = useState("");
    const router = useRouter();
    const [verifying, setVerifying] = useState(false);
    const [code, setCode] = useState("");

    const signUpWithEmail = async ({
                                       emailAddress,
                                       password,
                                       firstName,
                                       lastName,
                                   }: {
        emailAddress: string;
        password: string;
        firstName: string;
        lastName: string;
    }) => {
        if (!isLoaded) {
            toast.warn("Clerk is not loaded.");
            return;
        }

        try {
            // Create a new sign-up attempt
            await signUp.create({
                emailAddress,
                password,
                firstName,
                lastName,
                unsafeMetadata: { needsVerification: true },
            });

            // Send verification email
            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

            // Transition to verification state
            setVerifying(true);
            toast.success("Verification email sent. Please check your inbox.");
        } catch (err: any) {
            const errorMessage = err.errors?.[0]?.message || "Sign-up failed.";
            setClerkError(errorMessage);
            toast.error(errorMessage);
        }
    };

    const handleVerify = async (e: FormEvent) => {
        e.preventDefault();
        if (!isLoaded) {
            toast.warn("Clerk is not loaded.");
            return;
        }

        try {
            // Attempt to verify the email address
            const completeSignUp = await signUp.attemptEmailAddressVerification({ code });

            // Handle incomplete verification
            if (completeSignUp.status !== "complete") {
                console.log(JSON.stringify(completeSignUp, null, 2));
                toast.error("Invalid verification code. Please try again.");
                return;
            }

            // Set the active session
            await setActive({ session: completeSignUp.createdSessionId });
            // Redirect to home page
            toast.success("Signup successful!");
            router.push("/");
        } catch (err: any) {
            const errorMessage = err.errors?.[0]?.message || "Verification failed.";
            toast.error("Verification failed!");
            // Handle expired or invalid verification code
            if (errorMessage.includes("expired") || errorMessage.includes("invalid")) {
                toast.info("Your verification code has expired. Please sign up again.");
                setVerifying(false); // Allow the user to restart the sign-up process
            }
        }
    };
    const signUpWithOAuth = async (provider: "oauth_google" | "oauth_apple") => {
        if (!signUp) return null;

        try {
            await signUp.authenticateWithRedirect({
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
        <>
            {!verifying ? (
                <AuthLayout>
                    <RegisterForm signUpWithEmail={signUpWithEmail} signUpWithOAuth={signUpWithOAuth} clerkError={clerkError} />
                </AuthLayout>
            ) : (
                <AuthLayout>
                <VerifyForm handleVerify={handleVerify} code={code} setCode={setCode} />
                </AuthLayout>
            )}
        </>
    );
};

export default Signup;

