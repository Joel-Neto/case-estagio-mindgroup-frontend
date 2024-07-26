import { DollarSign, DollarSignIcon, HandCoins } from "lucide-react";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";
import TransactionsTable from "./TransactionsTable";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import TransactionsTableWithFilter from "./TransactionsTableWithFilter";

const getTotalAmount = async (token: string) => {
  try {
    const response = await fetch("http://localhost:3002/transactions/total", {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const apiData = await response.json();
      return apiData;
    } else {
      if (response.status === 401) {
        alert("Usuário não autorizado. Redirecionando para o login...");

        await signOut({
          redirect: false,
        });

        redirect("/");
      } else {
        console.error("Erro ao saldo total:", response.statusText);
      }
    }
  } catch (error) {
    console.error("Erro ao saldo total:", error);
  }
};

export default async function ShowTransactionsData() {
  const session = await getServerSession(nextAuthOptions);
  const token = session?.token;
  const userId = session?.user.id
  const { data } = await getTotalAmount(token as string);

  return (
    <main className="px-4 py-8 min-h-80 rounded-lg bg-zinc-900 shadow-shape space-y-8 md:px-8">
      <div className="px-4 h-16 rounded-md bg-zinc-800 shadow-shape flex items-center justify-between md:px-8">
        <div className="flex items-center gap-2">
          <DollarSign className="size-6 hidden text-zinc-400 sm:block" />
          <h1 className="text-lg text-zinc-200 font-semibold md:text-2xl">
            <span>Saldo Atual:</span>{" "}
            <span className={data < 0 ? "text-red-500" : "text-lime-300"}>
              R$ {data ? data.toFixed(2) : "0.00"}
            </span>
          </h1>
        </div>
      </div>

      <TransactionsTableWithFilter token={token as string} userId={userId as string}/>
    </main>
  );
}
