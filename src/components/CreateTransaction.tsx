"use client";

import { Calendar, DollarSign, List, Plus, Text, X } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { SyntheticEvent, useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface CreateTransactionProps {
  token: string;
  idUser: string;
}

interface Category {
  id: string;
  nome: string;
  tipo: "receita" | "despesa";
}

export default function CreateTransaction({
  token,
  idUser,
}: CreateTransactionProps) {
  const [isTransactionCreatorOpen, setIsTransactionCreatorOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | "">("");
  const [transactionType, setTransactionType] = useState<"receita" | "despesa">("receita");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const form = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await fetch("http://localhost:3002/categories/all", {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const apiData = await response.json();
          setCategories(apiData.data);
        } else {
          if (response.status === 401) {
            console.log("Usuário não autorizado. Redirecionando para o login...");
            await signOut({ redirect: false });
            router.replace("/");
          } else {
            console.error("Erro ao buscar categorias:", response.statusText);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };

    getCategories();
  }, [token, router]);

  const openTransactionCreator = () => {
    setIsTransactionCreatorOpen(true);
  };

  const closeTransactionCreator = () => {
    setIsTransactionCreatorOpen(false);
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategoryId(event.target.value);
  };

  const handleTransactionTypeChange = (type: "receita" | "despesa") => {
    setTransactionType(type);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    if (!description || !amount || selectedCategoryId === "" || !selectedDate) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const transaction = {
      description,
      amount: parseFloat(amount),
      type: transactionType,
      date: selectedDate,
      idCategory: selectedCategoryId,
      idUser,
    };

    try {
      const response = await fetch("http://localhost:3002/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transaction),
      });
      if (response.ok) {
        const apiData = await response.json();
        if (form.current) {
          form.current.reset();
          setSelectedDate(null);
          setAmount("");
          setDescription("");
          setSelectedCategoryId("");
          setTransactionType("receita");
        }
        alert(apiData.message);
        window.location.reload();
      } else {
        if (response.status === 401) {
          console.log("Usuário não autorizado. Redirecionando para o login...");
          await signOut({ redirect: false });
          router.replace("/");
        } else {
          console.error("Erro ao criar transação:", response.statusText);
        }
      }
    } catch (error) {
      console.error("Erro ao criar transação:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center px-6 gap-4 md:flex-row md:justify-between">
        <h2 className="text-3xl font-semibold text-center md:text-start">
          Transações Financeiras
        </h2>
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

            <form className="space-y-3" onSubmit={handleSubmit} ref={form}>
              <div className="h-14 px-4 flex items-center flex-1 gap-2 bg-zinc-950 border border-zinc-800 rounded-lg">
                <Text className="ml-1 text-zinc-400 size-5" />
                <input
                  type="text"
                  name="description"
                  placeholder="Descrição da transação"
                  className="bg-transparent text-lg placeholder-zinc-400 w-40 outline-none flex-1"
                  value={description}
                  onChange={(ev) => setDescription(ev.target.value)}
                  required
                />
              </div>

              <div className="h-14 px-4 flex items-center flex-1 gap-2 bg-zinc-950 border border-zinc-800 rounded-lg">
                <DollarSign className="ml-1 text-zinc-400 size-5" />
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  name="amount"
                  placeholder="Valor da transação"
                  className="bg-transparent text-lg placeholder-zinc-400 w-40 outline-none flex-1"
                  value={amount}
                  onChange={handleAmountChange}
                  required
                />
              </div>

              <div className="h-14 px-4 flex items-center flex-1 gap-2 bg-zinc-950 border border-zinc-800 rounded-lg">
                <List className="ml-1 text-zinc-400 size-5" />
                <select
                  name="category"
                  value={selectedCategoryId}
                  onChange={handleCategoryChange}
                  className="bg-zinc-950 text-zinc-400 text-lg placeholder-zinc-400 w-40 outline-none flex-1 rounded-lg"
                  required
                >
                  <option value="">Escolha uma categoria</option>
                  <optgroup label="Receitas">
                    {categories
                      .filter((category) => category.tipo === "receita")
                      .map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.nome}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="Despesas">
                    {categories
                      .filter((category) => category.tipo === "despesa")
                      .map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.nome}
                        </option>
                      ))}
                  </optgroup>
                </select>
              </div>

              <div className="h-14 px-4 flex items-center flex-1 gap-2 bg-zinc-950 border border-zinc-800 rounded-lg">
                <Calendar className="ml-1 text-zinc-400 size-5" />
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Selecione a data"
                  className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
                  required
                />
              </div>

              <div className="px-4 flex items-center gap-4 text-zinc-400">
                <input
                  type="radio"
                  id="entrada"
                  name="tipo"
                  value="receita"
                  checked={transactionType === "receita"}
                  onChange={() => handleTransactionTypeChange("receita")}
                  className="appearance-none h-5 w-5 border border-zinc-800 rounded-md checked:bg-zinc-500 checked:border-transparent focus:outline-none"
                  required
                />
                <label htmlFor="entrada">Receita</label>
              </div>
              <div className="px-4 flex items-center gap-4 text-zinc-400">
                <input
                  type="radio"
                  id="despesa"
                  name="tipo"
                  value="despesa"
                  checked={transactionType === "despesa"}
                  onChange={() => handleTransactionTypeChange("despesa")}
                  className="appearance-none h-5 w-5 border border-zinc-800 rounded-md checked:bg-zinc-500 checked:border-transparent focus:outline-none"
                  required
                />
                <label htmlFor="despesa">Despesa</label>
              </div>

              <button
                className="button button-primary button-full"
                type="submit"
              >
                Adicionar Transação
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
