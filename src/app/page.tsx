import { AtSign, LockKeyhole} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-zinc-900 w-[640px] rounded-xl py-5 px-4 shadow-shape space-y-5 sm:px-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <h2 className="text-lg font-semibold text-zinc-100">
              Fazer login no sistema.
            </h2>
          </div>
          <p className="text-sm text-zinc-400">
            Caso ainda não tenha uma conta,{" "}
            <Link href={"/register"} className="text-zinc-100 font-semibold underline">
              clique aqui para se registrar.
            </Link>
          </p>
        </div>

        <form className="space-y-3">

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
            Acessar sistema
          </button>
        </form>
      </div>
    </div>
  );
}
