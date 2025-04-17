"use client";

import {Dispatch, SetStateAction, useEffect, useState} from "react";
import { toast } from "react-toastify";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const SigninForm = ({
                             signInWithEmail,
                             signInWithOAuth,
                             oauthloader,
                             emailsent,
                             loader,
                             handleReset,
                             handleresetpassword
                           }: {
  signInWithEmail: ({ emailAddress, password,rememberMe }: { emailAddress: string; password: string,  rememberMe: boolean; }) => Promise<void>;
  signInWithOAuth: (provider: "oauth_google" | "oauth_apple") => void;
  oauthloader:string;
  emailsent:boolean;
  loader:boolean;
  handleReset:(email:string)=>void
  handleresetpassword:(code:string,newPassword:string,setforgetpassword:Dispatch<SetStateAction<boolean>>)=>void
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({email: "", password: ""});
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgetpassword,setforgetpassword]=useState(false);
  const [email, setEmail] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.email || !formData.password) {
      toast.error("All fields are required!");
      setIsLoading(false);
      return;
    }

    try {
      await signInWithEmail({
        emailAddress: formData.email,
        password: formData.password,
        rememberMe: rememberMe
      });
    } catch (error) {
      toast.error("Invalid email or password!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: "oauth_google" | "oauth_apple") => {
    try {
      signInWithOAuth(provider);
    } catch (error) {
      console.error("OAuth sign-in error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  function handleforgetpassword() {
    setforgetpassword(true);
  }

  function handlereset() {
     if(!email){
       toast.error("All Fields are Required");
       return;
     }
     handleReset(email);
  }

  function handleResetPassword() {
  if(!code||!newPassword){
    toast.error("All fields are required!!");
     return;
  }
  handleresetpassword(code,newPassword,setforgetpassword);
  }

  return (
      <div className="flex items-center justify-center w-full">
        <div
            className="w-full bg-white rounded-xl px-2">
          <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
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
          <h2 className="text-2xl sm:text-3xl font-extrabold text-black text-center mb-2">👋 Welcome Back</h2>
          <p className="text-center text-gray-500 text-sm mb-8">
            Let’s get you signed in and back to productivity.
          </p>
          {forgetpassword ?
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  Forgot your password?
                </h2>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={emailsent}
                />
                {emailsent ? (
                    <>
                      <label className="block mb-2 text-gray-700">Verification Code</label>
                      <input
                          type="text"
                          className="w-full px-4 py-2 border rounded-lg mb-4"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          placeholder="Enter code from email"
                          disabled={loader}
                      />

                      <label className="block mb-2 text-gray-700">New Password</label>
                      <div className="flex relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="w-full px-4 py-2 border rounded-lg mb-4"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
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
                      <button
                          onClick={handleResetPassword}
                          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
                          disabled={loader}
                      >
                        {loader ? (
                            <div className="flex justify-center items-center gap-2">
                              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                ></path>
                              </svg>
                              Resetting...
                            </div>
                        ) : (
                            "Reset Password"
                        )}

                      </button>
                    </>
                ) : (
                    <>
                      <button
                          onClick={handlereset}
                          disabled={loader}
                          className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-white transition-all duration-200 ${
                              loader
                                  ? "bg-gray-600 cursor-not-allowed"
                                  : "bg-black hover:bg-gray-800"
                          }`}
                      >
                        {loader ? (
                            <>
                              <svg
                                  className="animate-spin h-5 w-5 text-white"
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
                                    d="M4 12a8 8 0 018-8v8H4z"
                                ></path>
                              </svg>
                              Sending...
                            </>
                        ) : (
                            <>
                              🔁 Send Reset Link
                            </>
                        )}
                      </button>
                    </>
                )}
              </>
              : <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-7">

                {/* Email Field */}
                <div className="group relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-black">
                    <Mail className="h-5 w-5"/>
                  </div>
                  <Input
                      type="email"
                      name="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 bg-white border border-gray-300 text-black placeholder-gray-400 focus:ring-2 focus:ring-black focus:border-black rounded-lg"
                      disabled={isLoading}
                  />
                </div>

                {/* Password Field */}
                <div className="group relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-black">
                    <Lock className="h-5 w-5"/>
                  </div>
                  <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-10 bg-white border border-gray-300 text-black placeholder-gray-400 focus:ring-2 focus:ring-black focus:border-black rounded-lg"
                      disabled={isLoading}
                  />
                  <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
                  </button>
                </div>

                {/* Remember and Forgot */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
                        className="border-gray-400 bg-white data-[state=checked]:bg-black data-[state=checked]:text-white rounded"
                    />
                    <span className="text-sm text-gray-700">Remember me</span>
                  </label>
                  <a onClick={handleforgetpassword} className="text-sm text-gray-700 hover:text-black">
                    Forgot password?
                  </a>
                </div>

                {/* Sign In Button */}
                <Button
                    type="submit"
                    className="w-full bg-black text-white hover:bg-gray-800 py-2 rounded-lg font-medium shadow hover:shadow-md transition-all"
                    disabled={isLoading}
                >
                  {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Signing in...
          </span>
                  ) : (
                      "Sign in"
                  )}
                </Button>
              </form>
          }
          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
                variant="outline"
                onClick={() => handleOAuthSignIn("oauth_google")}
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
                    Signing in...
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
                onClick={() => handleOAuthSignIn("oauth_apple")}
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
                    Signing in...
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

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{" "}
            <Link href="/sign-up" className="text-black hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
  )
};
