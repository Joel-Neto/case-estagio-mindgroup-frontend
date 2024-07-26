"use client";

import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import DeleteTransactionButton from "./DeleteTransactionButton";
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

interface TransactionsTableWithFilterProps {
  token: string;
  userId: string;
}

type TransactionsType = "todas" | "receita" | "despesa";

export default function TransactionsTableWithFilter({
  token,
  userId,
}: TransactionsTableWithFilterProps) {
  const [filter, setFilter] = useState<TransactionsType>("todas");
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getTransactions = async () => {
      setLoading(true);
      try {
        const url =
          filter === "todas"
            ? "http://localhost:3002/transactions/all"
            : `http://localhost:3002/transactions/type/${filter}`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const apiData: ApiData = await response.json();
          setData(apiData.data);
        } else {
          if (response.status === 401) {
            alert("Usuário não autorizado. Redirecionando para o login...");
            await signOut({ redirect: false });
            redirect("/");
          } else {
            console.error("Erro ao buscar transações:", response.statusText);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar transações:", error);
      } finally {
        setLoading(false);
      }
    };

    getTransactions();
  }, [filter, token]);

  const handleTransactionTypeChange = (type: TransactionsType) => {
    setFilter(type);
    setLoading(true);
  };

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="px-4 flex items-center gap-4 text-zinc-400">
          <input
            type="radio"
            id="all"
            name="type"
            value="todas"
            checked={filter === "todas"}
            onChange={() => handleTransactionTypeChange("todas")}
            className="appearance-none h-5 w-5 border border-zinc-800 rounded-md checked:bg-zinc-500 checked:border-transparent focus:outline-none"
            required
            aria-label="Todas transações"
          />
          <label htmlFor="all">Todas</label>
        </div>
        <div className="px-4 flex items-center gap-4 text-zinc-400">
          <input
            type="radio"
            id="income"
            name="type"
            value="receita"
            checked={filter === "receita"}
            onChange={() => handleTransactionTypeChange("receita")}
            className="appearance-none h-5 w-5 border border-zinc-800 rounded-md checked:bg-zinc-500 checked:border-transparent focus:outline-none"
            required
            aria-label="Receita"
          />
          <label htmlFor="income">Receita</label>
        </div>
        <div className="px-4 flex items-center gap-4 text-zinc-400">
          <input
            type="radio"
            id="expense"
            name="type"
            value="despesa"
            checked={filter === "despesa"}
            onChange={() => handleTransactionTypeChange("despesa")}
            className="appearance-none h-5 w-5 border border-zinc-800 rounded-md checked:bg-zinc-500 checked:border-transparent focus:outline-none"
            required
            aria-label="Despesa"
          />
          <label htmlFor="expense">Despesa</label>
        </div>
      </div>

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
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-zinc-400">
                  Carregando...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-zinc-400">
                  Não há transações criadas
                </td>
              </tr>
            ) : (
              data.map((transaction) => (
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
                    <UpdateTransactionsButton
                      transactionId={transaction.id}
                      token={token}
                      userId={userId}
                    />
                    <DeleteTransactionButton
                      transactionId={transaction.id}
                      token={token}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
