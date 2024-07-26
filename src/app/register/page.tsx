"use client";

import { AtSign, ImagePlus, LockKeyhole, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { SyntheticEvent, useRef, useState } from "react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const form = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.size > 5 * 1024 * 1024) {
        // Limite de 5 MB
        alert("O arquivo é muito grande. Por favor, envie um arquivo menor.");
        return;
      }
      setFile(file);
    } else {
      setFile(null);
    }
  };

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    if (file) {
      formData.append("file", file);
    }

    try {
      const response = await fetch("http://localhost:3002/users", {
        method: "POST",
        body: formData,
      });

      const apiData = await response.json();
      if (response.ok) {
        if (form.current) {
          form.current.reset();
        }
        router.replace("/");
      } else {
        console.error("Erro ao criar usuário:", apiData.message);
        alert("Erro ao criar usuário: " + apiData.message);
      }
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      alert("Erro ao criar usuário.");
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

        <form
          className="space-y-3"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          ref={form}
        >
          <div className="h-14 px-4 flex items-center flex-1 gap-2 bg-zinc-950 border border-zinc-800 rounded-lg">
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

          <div className="h-14 px-4 flex items-center flex-1 gap-2 bg-zinc-950 border border-zinc-800 rounded-lg">
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

          <div className="h-14 px-4 flex items-center flex-1 gap-2 bg-zinc-950 border border-zinc-800 rounded-lg">
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

          <div className="flex flex-col gap-2">
            <label className="text-zinc-400 text-lg">
              Escolha uma imagem para avatar
            </label>
            <div className="h-14 px-4 flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg">
              <ImagePlus className="text-zinc-400 size-5" />
              <input
                type="file"
                name="file"
                className="bg-transparent text-lg placeholder-zinc-400 text-zinc-400 w-full outline-none cursor-pointer"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <button className="button button-primary button-full" type="submit">
            Realizar cadastro
          </button>
        </form>
      </div>
    </div>
  );
}
