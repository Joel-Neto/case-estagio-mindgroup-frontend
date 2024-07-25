import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import { HandCoins } from "lucide-react";
import { getServerSession } from "next-auth";
import React from "react";
import LogoutButton from "./LogoutButton";

export default async function Header() {
  const session = await getServerSession(nextAuthOptions);

  return (
    <div className="px-8 py-4 min-h-16 rounded-lg bg-zinc-900 shadow-shape flex flex-col justify-between gap-2 lg:flex-row lg:py-0">
      <div className="flex items-center gap-2">
        <HandCoins className="size-6 hidden text-zinc-400 lg:block" />
        <h1 className="text-2xl w-full text-center text-zinc-200 font-semibold">
          Gestor de Finanças
        </h1>
      </div>

      <div className="flex flex-col items-center justify-center gap-4 lg:flex-row lg:justify-start">
        <span className="text-center text-zinc-100">
          Seja bem-vindo(a), {session?.user.name}
        </span>
        <LogoutButton />
      </div>
    </div>
  );
}
