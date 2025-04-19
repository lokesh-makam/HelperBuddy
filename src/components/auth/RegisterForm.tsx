"use client";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {BsFillChatLeftDotsFill} from "react-icons/bs";

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
    otpsend:boolean;
    handleverify: (code:string) => void;
    resendOTP: () => void;
    loader:boolean;
    oauthloader:string
}

export const RegisterForm = ({ signUpWithEmail, signUpWithOAuth, otpsend ,handleverify,resendOTP,loader,oauthloader}: SignUpFormProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        emailAddress: "",
        password: "",
        confirmPassword: "",
        otp: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const validatePassword = () => {
        const password = formData.password;
        const confirmPassword = formData.confirmPassword;

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return false;
        }

        if (!passwordRegex.test(password)) {
            toast.error("Password must be at least 8 characters and include uppercase, lowercase, number, and special character");
            return false;
        }

        return true;
    };


    const handleVerifyOtp = async () => {
        if (!formData.otp) {
            toast.error("OTP is required");
            return;
        }
        try {
            await handleverify(formData.otp);
        } catch (error) {
            toast.error("Failed to verify OTP");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.firstName || !formData.lastName || !formData.emailAddress ||!formData.password|| !formData.password) {
            toast.error("All fields are required!");
            return;
        }
        if(!validatePassword()){
            return;
        }

        try {
            signUpWithEmail({
                emailAddress: formData.emailAddress,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
            });
        } catch (error) {
            console.error("Signup error:", error);
        }
    };

    const handleOAuthSignUp = async (provider: "oauth_google" | "oauth_apple") => {
        try {
            signUpWithOAuth(provider);
        } catch (error) {
            console.error("OAuth sign-in error:", error);
            toast.error("An error occurred. Please try again.");
        }
    };

    return (
        <div
            className="w-full bg-white rounded-xl sm:px-2">
            <div className="flex items-center justify-center gap-3 mb-8 lg:hidden">
                <div className="bg-indigo-500 rounded-full">
                    <Image
                        src="/images/main.ico"
                        alt="Helper Buddy Icon"
                        width={40}
                        height={40}
                        className="object-contain"
                    />
                </div>
                <div className="text-gray-900 text-3xl font-bold">
                    Helper<span className="text-indigo-600">Buddy</span>
                </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-black text-center mb-4">👋 Welcome Back</h2>
            <p className="text-center text-gray-500 text-sm mb-6">
                "Sign up and leave the mess to us"
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Name Fields */}
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            <User className="h-5 w-5"/>
                        </div>
                        <Input
                            type="text"
                            name="firstName"
                            placeholder="First name"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full pl-10 border-gray-300 rounded-lg"
                            disabled={loader}
                        />
                    </div>
                    <div className="relative flex-1">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            <User className="h-5 w-5"/>
                        </div>
                        <Input
                            type="text"
                            name="lastName"
                            placeholder="Last name"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full pl-10 border-gray-300 rounded-lg"
                            disabled={loader}
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        <Mail className="h-5 w-5"/>
                    </div>
                    <Input
                        type="email"
                        name="emailAddress"
                        placeholder="Email"
                        value={formData.emailAddress}
                        onChange={handleChange}
                        className="w-full pl-10 border-gray-300 rounded-lg"
                        disabled={loader}
                    />
                </div>

                {/* Password */}
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        <Lock className="h-5 w-5"/>
                    </div>
                    <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-10 pr-10 border-gray-300 rounded-lg"
                        disabled={loader}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                    >
                        {showPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
                    </button>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        <Lock className="h-5 w-5"/>
                    </div>
                    <Input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full pl-10 pr-10 border-gray-300 rounded-lg"
                        disabled={loader}
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                    >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
                    </button>
                </div>
                {otpsend && (
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            <BsFillChatLeftDotsFill className="h-5 w-5"/>
                        </div>
                        <Input
                            type="text"
                            name="otp"
                            placeholder="Enter Otp"
                            value={formData.otp}
                            onChange={handleChange}
                            className="w-full pl-10 pr-10 border-gray-300 rounded-lg"
                            disabled={loader}
                        />
                    </div>
                )}
                <div id="clerk-captcha"/>
                {otpsend ? (
                    <div className="w-full flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mt-6">
                        <Button
                            type="button"
                            onClick={handleVerifyOtp}
                            className="w-full sm:w-3/4 md:w-4/5 bg-black text-white font-medium py-3 px-8 rounded-lg shadow-sm transition-colors duration-200 hover:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                            disabled={loader}
                        >
                            {loader ? (
                                <div className="flex items-center justify-center">
                                    <svg
                                        className="animate-spin h-5 w-5 mr-2 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                        ></path>
                                    </svg>
                                    <span>Verifying...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center">
                                    <span>Verify OTP</span>
                                </div>
                            )}
                        </Button>

                        <Button
                            type="button"
                            onClick={resendOTP}
                            className="w-full sm:w-1/4 md:w-1/4 bg-gray-200 text-gray-900 font-medium py-3 px-6 rounded-lg shadow-sm transition-colors duration-200 hover:bg-gray-300 border border-gray-300 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:outline-none"
                            disabled={loader}
                        >
                            <div className="flex items-center justify-center">
                                <span>Resend OTP</span>
                            </div>
                        </Button>
                    </div>
                ) : (
                    <Button
                        type="submit"
                        className="w-full bg-black text-white hover:bg-gray-800 rounded-lg"
                    >
                        {loader ? (
                            <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Creating account...
        </span>
                        ) : "Create account"}
                    </Button>
                )}
            </form>
            {/* OAuth Divider */}
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or register with</span>
                </div>
            </div>

            {/* OAuth Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
                <Button
                    variant="outline"
                    onClick={() => handleOAuthSignUp("oauth_google")}
                    disabled={oauthloader === "oauth_google"}
                    className="flex-1 bg-white border border-gray-300 hover:bg-gray-100 rounded-lg"
                >
                    {oauthloader === "oauth_google" ? (
                        <>
                            <svg
                                className="animate-spin h-5 w-5 text-black"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Signing up...
                        </>
                    ) : (
                        <>
                            <Image
                                src="https://authjs.dev/img/providers/google.svg"
                                alt="Google"
                                width={20}
                                height={20}
                                className="mr-2"
                                unoptimized
                            />
                            Google
                        </>
                    )}
                </Button>

                <Button
                    variant="outline"
                    onClick={() => handleOAuthSignUp("oauth_apple")}
                    disabled={oauthloader === "oauth_apple"}
                    className="flex-1 bg-white border border-gray-300 hover:bg-gray-100 rounded-lg"
                >
                    {oauthloader === "oauth_apple" ? (
                        <>
                            <svg
                                className="animate-spin h-5 w-5 text-black"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Signing up...
                        </>
                    ) : (
                        <>
                            <Image
                                src="https://authjs.dev/img/providers/apple.svg"
                                alt="Apple"
                                width={20}
                                height={20}
                                className="mr-2"
                                unoptimized
                            />
                            Apple
                        </>
                    )}
                </Button>
            </div>
            <p className="text-center text-sm text-gray-600 mt-6">
                Already have an account?{" "}
                <Link href="/sign-in" className="text-black hover:underline font-medium">
                    Sign in
                </Link>
            </p>
        </div>
    );
};