import { AtSign, LockKeyhole, User } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Área de cadastro",
};

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-zinc-900 w-[640px] rounded-xl py-5 px-4 shadow-shape space-y-5 sm:px-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <h2 className="text-lg font-semibold text-zinc-100">
              Cadastre-se no sistema.
            </h2>
          </div>
          <p className="text-sm text-zinc-400">
            Caso já tenha uma conta,{" "}
            <Link href={"/"} className="text-zinc-100 font-semibold underline">
              clique aqui para fazer login.
            </Link>
          </p>
        </div>

        <form className="space-y-3">
          <div className="h-14 px-4 flex items-center flex-1  gap-2 bg-zinc-950 border border-zinc-800 rounded-lg">
            <User className="ml-1 text-zinc-400 size-5" />
            <input
              type="text"
              name="name"
              placeholder="Digite seu nome"
              className="bg-transparent text-lg placeholder-zinc-400 w-40 outline-none flex-1"
            />
          </div>

          <div className="h-14 px-4 flex items-center flex-1  gap-2 bg-zinc-950 border border-zinc-800 rounded-lg">
            <AtSign className="ml-1 text-zinc-400 size-5" />
            <input
              type="email"
              name="email"
              placeholder="Digite seu e-mail"
              className="bg-transparent text-lg placeholder-zinc-400 w-40 outline-none flex-1"
            />
          </div>

          <div className="h-14 px-4 flex items-center flex-1  gap-2 bg-zinc-950 border border-zinc-800 rounded-lg">
            <LockKeyhole className="ml-1 text-zinc-400 size-5" />
            <input
              type="password"
              name="password"
              placeholder="Digite sua senha"
              className="bg-transparent text-lg placeholder-zinc-400 w-40 outline-none flex-1"
            />
          </div>

          <button className="button button-primary button-full" type="submit">
            Realizar cadastro
          </button>
        </form>
      </div>
    </div>
  );
}
