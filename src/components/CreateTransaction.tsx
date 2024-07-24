"use client";

import { DollarSign, Plus, Text, X } from "lucide-react";
import React, { useEffect, useState } from "react";

interface CreateTransactionProps {
  token: string;
}

export default function CreateTransaction({ token }: CreateTransactionProps) {
  const [isTransactionCreatorOpen, setIsTransactionCreatorOpen] =
    useState(false);

  function openTransactionCreator() {
    setIsTransactionCreatorOpen(true);
  }

  function closeTransactionCreator() {
    setIsTransactionCreatorOpen(false);
  }

  return (
    <>
      <div className="flex items-center justify-between px-6">
        <h2 className="text-3xl font-semibold">Transações Financeiras</h2>

        <button
          onClick={openTransactionCreator}
          className="button button-primary button-default"
        >
          <Plus className="size-5" />
          Cadastrar Transação
        </button>
      </div>

      {isTransactionCreatorOpen && (
        <div className="flex items-center justify-center">
          <div className="bg-zinc-900 w-full rounded-xl py-5 px-4 shadow-shape space-y-5 sm:px-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <h2 className="text-xl font-semibold text-zinc-100">
                  Criar nova transação
                </h2>
                <button onClick={closeTransactionCreator}>
                  <X className="size-5 text-zinc-400 transition duration-200 hover:text-zinc-200" />
                </button>
              </div>
            </div>

            <form className="space-y-3">
              <div className="h-14 px-4 flex items-center flex-1  gap-2 bg-zinc-950 border border-zinc-800 rounded-lg">
                <Text className="ml-1 text-zinc-400 size-5" />
                <input
                  type="text"
                  name="description"
                  placeholder="Descrição da transação"
                  className="bg-transparent text-lg placeholder-zinc-400 w-40 outline-none flex-1"
                  // onChange={(ev) => setEmail(ev.target.value)}
                />
              </div>

              <div className="h-14 px-4 flex items-center flex-1  gap-2 bg-zinc-950 border border-zinc-800 rounded-lg">
                <DollarSign className="ml-1 text-zinc-400 size-5" />
                <input
                  type="number"
                  min={0}
                  name="amount"
                  placeholder="Valor da transação"
                  className="bg-transparent text-lg placeholder-zinc-400 w-40 outline-none flex-1"
                  // onChange={(ev) => setPassword(ev.target.value)}
                />
              </div>

              <button
                className="button button-primary button-full"
                type="submit"
              >
                Acessar sistema
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
