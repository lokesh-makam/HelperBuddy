"use client";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface SignUpFormProps {
    signUpWithEmail: ({
                          emailAddress,
                          password,
                          firstName,
                          lastName,
                      }: {
        emailAddress: string;
        password: string;
        firstName: string;
        lastName: string;
    }) => void;
    signUpWithOAuth: (provider: "oauth_google" | "oauth_apple") => void;
    clerkError: string;
}

export const RegisterForm = ({ signUpWithEmail, signUpWithOAuth, clerkError }: SignUpFormProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        emailAddress: "",
        password: "",
    });
    const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.firstName || !formData.lastName || !formData.emailAddress || !formData.password) {
            toast.error("All fields are required!");
            return;
        }

        setIsLoading(true);
        try {
            signUpWithEmail(formData);
        } catch (error) {
            console.error("Signup error:", error);
        } finally {
            setIsLoading(false);
        }
    };
    const handleOAuthSignUp = async (provider: "oauth_google" | "oauth_apple") => {
        setIsLoading(true);
        setLoadingProvider(provider);
        try {
            setIsLoading(true);
            signUpWithOAuth(provider);
        } catch (error) {
            console.error("OAuth sign-in error:", error);
            toast.error("An error occurred. Please try again.");
        }
        finally {
            setTimeout(() => setLoadingProvider(null), 10000);
            setIsLoading(false);
        }
    }
    return (
        <>
            <h1 className="text-4xl font-semibold text-white mb-2">Create an account</h1>
            <p className="text-zinc-400 mb-8">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-purple-400 hover:text-purple-300 underline underline-offset-3">
                    Log in
                </Link>
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="flex gap-4">
                    <Input
                        type="text"
                        name="firstName"
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-400"
                        disabled={isLoading}
                    />
                    <Input
                        type="text"
                        name="lastName"
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-400"
                        disabled={isLoading}
                    />
                </div>

                <Input
                    type="email"
                    name="emailAddress"
                    placeholder="Email"
                    value={formData.emailAddress}
                    onChange={handleChange}
                    className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-400"
                    disabled={isLoading}
                />

                <div className="relative">
                    <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-400 pr-10"
                        disabled={isLoading}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-300"
                        disabled={isLoading}
                    >
                        {showPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
                    </button>
                </div>

                {clerkError && <p className="text-red-500 text-sm">{clerkError}</p>}
                <div id="clerk-captcha"/>
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create account"}
                </Button>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-zinc-700"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-zinc-950 px-2 text-zinc-400">Or register with</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        className="border-zinc-700 text-black hover:bg-zinc-800 hover:text-white"
                        onClick={() => handleOAuthSignUp("oauth_google")}
                        disabled={loadingProvider === "oauth_google"}
                    >
                        {loadingProvider === "oauth_google" ? (
                            <>
                                <span className="animate-spin border-2 border-gray-500 border-t-transparent rounded-full w-4 h-4 mr-2"></span>
                                Signing Up...
                            </>
                        ) : (
                            <>
                                <Image src="/images/google-icon-updated.svg" alt="Google Icon" width={20} height={20} className="mr-2" />
                                Google
                            </>
                        )}
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        className="border-zinc-700 text-black hover:bg-zinc-800 hover:text-white"
                        onClick={() => handleOAuthSignUp("oauth_apple")}
                        disabled={loadingProvider === "oauth_apple"}
                    >
                        {loadingProvider === "oauth_apple" ? (
                            <>
                                <span className="animate-spin border-2 border-gray-500 border-t-transparent rounded-full w-4 h-4 mr-2"></span>
                                Signing Up...
                            </>
                        ) : (
                            <>
                                <Image src="/images/apple-icon.svg" alt="Apple Icon" width={20} height={20} className="mr-2" />
                                Apple
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </>
    );
};

