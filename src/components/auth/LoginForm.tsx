"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
interface SignInFormProps {
  signInWithEmail: ({
                      emailAddress,
                      password,
                    }: {
    emailAddress: string;
    password: string;
  }) => Promise<void>;
  signInWithOAuth: (provider: "oauth_google" | "oauth_apple") => void;
  clerkError: string;
}

export const SigninForm = ({ signInWithEmail, signInWithOAuth, clerkError }: SignInFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!formData.email|| !formData.password) {
      toast.error("All fields are required!");
      return;
    }
    try {
      await signInWithEmail({
        emailAddress: formData.email,
        password: formData.password,
      });
    } catch (error) {
      toast.error(clerkError || "Invalid email or password!", { position: "top-right" });
    } finally {
      setIsLoading(false);
    }
  };
  const handleOAuthSignIn = async (provider: "oauth_google" | "oauth_apple") => {
    try {
      setIsLoading(true);
      signInWithOAuth(provider);
    } catch (error) {
      console.error("OAuth sign-in error:", error);
      toast.error("An error occurred. Please try again.");
    }
    finally {
      setIsLoading(false);
    }
  }
  return (
      <div className="bg-black">
        <h1 className="text-4xl font-semibold text-white mb-2">Welcome back</h1>
        <p className="text-zinc-400 mb-8">
          New to Helper Buddy?{" "}
          <Link
              href="/sign-up"
              className="text-purple-400 hover:text-purple-300 underline underline-offset-3"
          >
            Create an account
          </Link>
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-400"
          />

          <div className="relative">
            <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-400 pr-10"
                disabled={isLoading}
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-300"
            >
              {showPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" className="border-zinc-700 data-[state=checked]:bg-purple-600"/>
              <label htmlFor="remember" className="text-sm text-zinc-400 leading-none">
                Remember me
              </label>
            </div>
            <Link href="/" className="text-sm text-purple-400 hover:text-purple-300">
              Forgot password?
            </Link>
          </div>
          <div id="clerk-captcha"/>
          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-700"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-zinc-950 px-2 text-zinc-400">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button type="button" variant="outline" className="border-zinc-700 text-black hover:bg-zinc-800 hover:text-white"
                    onClick={() => handleOAuthSignIn("oauth_google")}
            >
              <Image src="/images/google-icon-updated.svg" alt="Google Icon" width={20} height={20} className="mr-2"/>
              Google
            </Button>
            <Button type="button" variant="outline" className="border-zinc-700 text-black hover:bg-zinc-800 hover:text-white"
                    onClick={() => handleOAuthSignIn("oauth_apple")}
            >
              <Image src="/images/apple-icon.svg" alt="Apple Icon" width={20} height={20} className="mr-2"/>
              Apple
            </Button>
          </div>
        </form>
      </div>
  );
};

