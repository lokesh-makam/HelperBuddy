import UserInfoCard from "@/src/components/user-profile/UserInfoCard";
import UserMetaCard from "@/src/components/user-profile/UserMetaCard";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Profile | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Profile page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function Profile() {
  return (
    <div className="max-w-screen-lg mx-auto p-3 sm:p-4 lg:p-6">
      <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800 dark:bg-white/[0.03] lg:p-5">
        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
          Profile
        </h3>
        <div className="space-y-5">
          <UserMetaCard />
          <UserInfoCard />
        </div>
      </div>
    </div>
  );
}
