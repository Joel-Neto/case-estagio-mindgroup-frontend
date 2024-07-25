"use client";

import { AtSign, LockKeyhole, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { SyntheticEvent, useRef, useState } from "react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const form = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    const user = {
      name,
      email,
      password,
    };

    try {
      const response = await fetch("http://localhost:3002/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (response.ok) {
        const apiData = await response.json();
        if (form.current) {
          form.current.reset();
        }
        router.replace("/");
      } else {
        console.error("Erro ao criar usuário:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao  criar usuário:", error);
    }
  };

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

        <form className="space-y-3" onSubmit={handleSubmit} ref={form}>
          <div className="h-14 px-4 flex items-center flex-1  gap-2 bg-zinc-950 border border-zinc-800 rounded-lg">
            <User className="ml-1 text-zinc-400 size-5" />
            <input
              type="text"
              name="name"
              placeholder="Digite seu nome"
              className="bg-transparent text-lg placeholder-zinc-400 w-40 outline-none flex-1"
              onChange={(ev) => setName(ev.target.value)}
              required
            />
          </div>

          <div className="h-14 px-4 flex items-center flex-1  gap-2 bg-zinc-950 border border-zinc-800 rounded-lg">
            <AtSign className="ml-1 text-zinc-400 size-5" />
            <input
              type="email"
              name="email"
              placeholder="Digite seu e-mail"
              className="bg-transparent text-lg placeholder-zinc-400 w-40 outline-none flex-1"
              onChange={(ev) => setEmail(ev.target.value)}
              required
            />
          </div>

          <div className="h-14 px-4 flex items-center flex-1  gap-2 bg-zinc-950 border border-zinc-800 rounded-lg">
            <LockKeyhole className="ml-1 text-zinc-400 size-5" />
            <input
              type="password"
              name="password"
              placeholder="Digite sua senha"
              className="bg-transparent text-lg placeholder-zinc-400 w-40 outline-none flex-1"
              onChange={(ev) => setPassword(ev.target.value)}
              required
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
