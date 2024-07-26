import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";
import DeleteTransactionButton from "./DeleteTransactionButton";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import UpdateTransactionsButton from "./UpdateTransactionsButton";


interface ApiData {
  success: boolean;
  message: string;
  data: Transaction[];
}

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "receita" | "despesa";
  date: Date;
  category: {
    id: number;
    nome: string;
    tipo: "receita" | "despesa";
  };
}

const getTransactions = async (token: string) => {
  try {
    const response = await fetch("http://localhost:3002/transactions/all", {
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

export default async function TransactionsTable() {
  const session = await getServerSession(nextAuthOptions);
  const token = session?.token;
  const userId = session?.user.id
  const { data }: ApiData = await getTransactions(token as string);

  return (
    <div className="overflow-x-auto shadow-shape rounded-md">
      <table className="min-w-full bg-zinc-900 border border-zinc-800 rounded-lg">
        <thead>
          <tr className="bg-zinc-800">
            <th className="text-left py-3 px-4 text-zinc-200 font-semibold uppercase border-b border-zinc-800">
              Nome
            </th>
            <th className="text-left py-3 px-4 text-zinc-200 font-semibold uppercase border-b border-zinc-800">
              Tipo
            </th>
            <th className="text-left py-3 px-4 text-zinc-200 font-semibold uppercase border-b border-zinc-800">
              Categoria
            </th>
            <th className="text-left py-3 px-4 text-zinc-200 font-semibold uppercase border-b border-zinc-800">
              Valor
            </th>
            <th className="text-left py-3 px-4 text-zinc-200 font-semibold uppercase border-b border-zinc-800">
              Opções
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {!data
            ? "Não há transações criadas"
            : data.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="py-4 px-6 text-zinc-400 whitespace-nowrap">
                    {transaction.description}
                  </td>
                  <td className="py-4 px-6 text-zinc-400 whitespace-nowrap">
                    {transaction.type}
                  </td>
                  <td className="py-4 px-6 text-zinc-400 whitespace-nowrap">
                    {transaction.category.nome}
                  </td>
                  <td className="py-4 px-6 text-zinc-400 whitespace-nowrap">
                    R$ {transaction.amount}
                  </td>
                  <td className="py-4 px-6 text-zinc-400 flex gap-2 whitespace-nowrap">
                      <UpdateTransactionsButton transactionId={transaction.id} token={token as string} userId={userId as string}/>
                    <DeleteTransactionButton transactionId={transaction.id} token={token as string}/>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}
