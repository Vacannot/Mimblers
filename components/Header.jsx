"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Logout from "@/components/Logout";
import fugaz from "@/fonts/fugaz";

export default function Header() {
  const { currentUser } = useAuth();
  return (
    <header className="p-4 sm:p-8 flex items-center justify-between gap-4">
      <Link href={"/"}>
        <h1 className={"text-base sm:text-lg textGradient " + fugaz.className}>
          <img src="/favicon.png" className="max-w-[50px]" />
        </h1>
      </Link>
      <div className="flex flex-row items-center gap-4">
        <p className="text-md font-semibold">
          {currentUser ? `Welcome, ${currentUser.email}` : ""}
        </p>
        <Logout />
      </div>
    </header>
  );
}
