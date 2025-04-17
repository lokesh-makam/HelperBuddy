"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useClerk, useSignIn, useUser } from "@clerk/nextjs";
import { SigninForm } from "@/src/components/auth/LoginForm";
import { AuthLayout } from "@/src/components/auth/AuthLayout";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "@/src/app/loading";

const Signin = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [oauthloader, setoauthloader] = useState<string>("null");
  const [loader, setloader] = useState<boolean>(false);
  const [emailsent, setemailsent] = useState(false);
  const { signOut } = useClerk();
  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) {
      router.push("/");
    } else {
      setLoading(false);
    }
  }, [isSignedIn]);

  const validateEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);

  const signInWithEmail = async ({
    emailAddress,
    password,
    rememberMe,
  }: {
    emailAddress: string;
    password: string;
    rememberMe: boolean;
  }) => {
    if (!isLoaded || !signIn) {
      toast.error("Sign-in service is not ready. Please wait or refresh.");
      return;
    }

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
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
        } else {
          sessionStorage.setItem("tempSession", "active");
          localStorage.removeItem("rememberMe");
        }
        toast.success("Login successful!");
        router.push("/");
      } else {
        toast.error("Invalid credentials. Please try again.");
      }
    } catch (err: any) {
      const errorMessage =
        err?.errors?.[0]?.message || "Something went wrong. Please try again.";
      console.error("Sign-in error:", err);
      toast.error(errorMessage);
    }
  };

  const signInWithOAuth = async (provider: "oauth_google" | "oauth_apple") => {
    if (!isLoaded || !signIn) {
      toast.error("Sign-in service is not ready. Please wait or refresh.");
      return;
    }
    if (oauthloader != "null") return;
    try {
      setoauthloader(provider);
      await signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: "/sign-in/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (err: any) {
      const errorMessage =
        err?.errors?.[0]?.message || "OAuth sign-in failed. Please try again.";
      console.error("OAuth sign-in error:", err);
      toast.error(errorMessage);
    } finally {
      setoauthloader("null");
    }
  };
  const handleReset = async (email: string) => {
    if (!isLoaded) return toast.error("Clerk not ready");
    try {
      setloader(true);
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      setemailsent(true);
      toast.success("Password reset email sent!");
    } catch (err: any) {
      console.error("Reset error:", err);
      toast.error(err.errors?.[0]?.message || "Failed to send reset email.");
    } finally {
      setloader(false);
    }
  };
  const handleresetpassword = async (
    code: string,
    newPassword: string,
    setforgetpassword: Dispatch<SetStateAction<boolean>>
  ) => {
    if (!isLoaded) return;
    setloader(true);
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password: newPassword,
      });
      if (result.status === "complete") {
        toast.success("Password reset successful! You can now sign in.");
        await signOut();
        setemailsent(false);
        setforgetpassword(false);
      } else {
        toast.error("Incomplete reset. Try again.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Password reset failed. Incorrect code entered.");
    } finally {
      setloader(false);
    }
  };
  if (loading) {
    return <Loading />;
  } else {
    return (
      <AuthLayout>
        <SigninForm
          signInWithEmail={signInWithEmail}
          signInWithOAuth={signInWithOAuth}
          oauthloader={oauthloader}
          emailsent={emailsent}
          loader={loader}
          handleReset={handleReset}
          handleresetpassword={handleresetpassword}
        />
      </AuthLayout>
    );
  }
};

export default Signin;