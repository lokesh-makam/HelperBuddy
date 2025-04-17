"use client";
import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallback() {
  return (
    <div className="flex min-h-screen items-center justify-center text-gray-700">
      <div id="clerk-captcha" />
      <AuthenticateWithRedirectCallback />
      <p className="mt-4">Completing sign-in, please wait...</p>
    </div>
  );
}
