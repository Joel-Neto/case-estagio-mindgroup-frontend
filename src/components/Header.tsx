import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import { HandCoins, User, User2 } from "lucide-react";
import { getServerSession } from "next-auth";
import React from "react";
import LogoutButton from "./LogoutButton";
import Image from "next/image";

export default async function Header() {
  const session = await getServerSession(nextAuthOptions);
  const img = session?.user.img

  return (
    <>
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <div className="w-36 h-36 bg-zinc-800 rounded-full shadow-shape flex items-center justify-center sm:w-28 sm:h-28">
          {/* {!img ?<User className="size-8 text-zinc-400"/> : (<img src={img} className="w-32 h-32 rounded-full sm:w-24 sm:h-24" alt="Imagem"/>)} */}
          {!img ?<User className="size-8 text-zinc-400"/> : <Image src={img} alt="Avatar img" className="w-32 h-32 rounded-full sm:w-24 sm:h-24" width={128} height={128}/>}
        </div>
        <p className="text-sm text-zinc-100 sm:text-lg">
          Seja bem-vindo(a), {session?.user.name}.
        </p>
      </div>
      <div className="px-8 py-4 min-h-16 rounded-lg bg-zinc-900 shadow-shape flex flex-col justify-between gap-2 lg:flex-row lg:py-0">
        <div className="flex items-center gap-2">
          <HandCoins className="size-6 hidden text-zinc-400 lg:block" />
          <h1 className="text-2xl w-full text-center text-zinc-200 font-semibold">
            Gestor de Finanças
          </h1>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 lg:flex-row lg:justify-start">
          <LogoutButton />
        </div>
      </div>
    </>
  );
}
