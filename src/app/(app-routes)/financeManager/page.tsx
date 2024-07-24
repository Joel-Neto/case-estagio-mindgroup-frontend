import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import CreateTransaction from "@/components/CreateTransaction";
import { HandCoins, Plus } from "lucide-react";
import { getServerSession } from "next-auth";
import React from "react";

export default async function FinanceManager() {
  const session = await getServerSession(nextAuthOptions);
  const token = session?.token;

  return (
    <div className="container max-w-6xl mx-auto px-6 py-10 space-y-6">
      {/* HEADER */}
      <div className="px-8 h-16 rounded-lg bg-zinc-900 shadow-shape flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HandCoins className="size-6 text-zinc-400" />
          <h1 className="text-2xl text-zinc-200 font-semibold">
            Gestor de Finanças
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className=" text-zinc-100">
            Seja bem-vindo(a), {session?.user.name}
          </span>
        </div>
      </div>

      <CreateTransaction token={token as string} />

      

      <main className="px-8 min-h-80 rounded-lg bg-zinc-900 shadow-shape"></main>
    </div>
  );
}
