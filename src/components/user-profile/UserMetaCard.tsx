"use client";
import React from "react";
import Image from "next/image";
import {useUser} from "@clerk/nextjs";

export default function UserMetaCard() {
  const { user } = useUser()
  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl bg-white dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <Image
                width={80}
                height={80}
                src="/images/dp.jpg"
                alt="user"
              />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {user?`${user.firstName} ${user.lastName}`:"-"}
              </h4>
            </div>
           
          </div>
        </div>
      </div>
    </>
  );
}