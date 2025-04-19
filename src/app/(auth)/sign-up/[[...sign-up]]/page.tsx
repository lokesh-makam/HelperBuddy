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
  const router = useRouter();
  const [otpsend, setotpsend] = useState(false);
  const [oauthloader, setoauthloader] = useState<string>("null");
  const [loader, setloader] = useState<boolean>(false);
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
    if (!isLoaded || !signUp) {
      toast.error("Sign-Up service is not ready. Please wait or refresh.");
      return;
    }
    try {
      setloader(true);
      // Step 1: Initiate sign-up
      await signUp.create({
        emailAddress,
        password,
        firstName,
        lastName,
        unsafeMetadata: { needsVerification: true },
      });
      // Step 2: Send verification email
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      setotpsend(true);
      toast.success("Verification email sent. Please check your inbox.");
    } catch (err: any) {
      const errorMessage = err.errors?.[0]?.message || "Sign-up failed.";
      if(errorMessage.includes("That email address is taken. Please try another.")) {
        toast.error("Account already exists. Please sign in.")
      }else{
        toast.error(errorMessage);
      }
    }finally{
      setloader(false);
    }
  };
  const handleVerify = async (code: string) => {
    if (!isLoaded || !signUp) {
      toast.error("Verification service not ready. Please wait or refresh.");
      return;
    }
    try {
      setloader(true);
      const completeSignUp = await signUp.attemptEmailAddressVerification({ code });
      if (completeSignUp.status !== "complete") {
        toast.error("Some error occurred.Please try again.");
        return;
      }
      await setActive({ session: completeSignUp.createdSessionId });
      sessionStorage.setItem("tempSession", "active");
      localStorage.removeItem("rememberMe");
      toast.success("Signup successful!");
      router.push("/");
    } catch (err: any) {
      console.error(err)
      toast.error(
          "Verification failed. Please try again.");
    }finally {
      setloader(false);
    }
  };
  const resendOTP = async () => {
    if (!isLoaded || !signUp) {
      toast.error("Resend service is not ready. Please wait or refresh.");
      return;
    }
    try {
      setloader(true);
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      toast.success("Verification email resent. Please check your inbox.");
    } catch (err: any) {
      console.error("Resend OTP Error:", err);
      toast.error("Failed to resend verification email. Please try again.");
    } finally {
      setloader(false);
    }
  };

  const signUpWithOAuth = async (
      provider: "oauth_google" | "oauth_apple"
  ) => {
    if (!isLoaded || !signUp) {
      toast.error("Sign-Up service is not ready. Please wait or refresh.");
      return;
    }
    if(oauthloader!="null") return;
    try {
      setoauthloader(provider);
      await signUp.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: "/sign-up/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (err: any) {
      const errorMessage =
          err?.errors?.[0]?.message || "OAuth sign-in failed. Please try again.";
      console.error("OAuth sign-in error:", err);
      toast.error(errorMessage);
    }finally {
      setoauthloader("null");
    }
  };

  return (
      <AuthLayout>
        <RegisterForm signUpWithEmail={signUpWithEmail} signUpWithOAuth={signUpWithOAuth} otpsend={otpsend} handleverify={handleVerify} resendOTP={resendOTP} loader={loader} oauthloader={oauthloader}/>
      </AuthLayout>
  );
};

export default Signup;

