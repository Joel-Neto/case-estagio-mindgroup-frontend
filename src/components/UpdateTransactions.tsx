import { Calendar, DollarSign, List, Text, X } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { SyntheticEvent, useEffect, useState } from "react";
import DatePicker from "react-datepicker";

interface UpdateTransactionsProps {
  userId: number;
  token: string;
  transactionId: number;
  closeModal: () => void;
}

interface Category {
  id: number;
  nome: string;
  tipo: "receita" | "despesa";
}

interface Transaction {
  id: number;
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

export default function UpdateTransactions({
  userId,
  token,
  transactionId,
  closeModal,
}: UpdateTransactionsProps) {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [transactionType, setTransactionType] = useState<"receita" | "despesa">("receita");
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

    const getTransaction = async () => {
      try {
        const response = await fetch(`http://localhost:3002/transactions/transaction/${transactionId}`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const apiData = await response.json();
          setTransaction(apiData.data);
          setSelectedCategoryId(apiData.data.category.id);
          setDescription(apiData.data.description);
          setAmount(`${apiData.data.amount}`);
          setTransactionType(apiData.data.type);
          setSelectedDate(new Date(apiData.data.date));
        } else {
          if (response.status === 401) {
            console.log("Usuário não autorizado. Redirecionando para o login...");
            await signOut({ redirect: false });
            router.replace("/");
          } else {
            console.error("Erro ao buscar transação:", response.statusText);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar transação:", error);
      }
    };

    getCategories();
    getTransaction();
  }, [token, router, transactionId]);

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategoryId(parseInt(event.target.value, 10));
  };

  const handleTransactionTypeChange = (type: "receita" | "despesa") => {
    setTransactionType(type);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    const updatedTransaction = {
      id: transactionId,
      description,
      amount: Number(amount),
      type: transactionType,
      date: selectedDate,
      idCategory: selectedCategoryId,
      idUser: userId,
    };

    try {
      const response = await fetch(`http://localhost:3002/transactions/transaction/${transactionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedTransaction),
      });
      if (response.ok) {
        const apiData = await response.json();
        alert(apiData.message);
        window.location.reload();
      } else {
        if (response.status === 401) {
          console.log("Usuário não autorizado. Redirecionando para o login...");
          await signOut({ redirect: false });
          router.replace("/");
        } else {
          console.error("Erro ao atualizar transação:", response.statusText);
        }
      }
    } catch (error) {
      console.error("Erro ao atualizar transação:", error);
    }
  };

  if (!transaction) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
        <div className="bg-zinc-900 w-[620px] rounded-xl py-5 px-4 shadow-shape space-y-5 sm:px-6">
          <p>Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-2">
      <div className="bg-zinc-900 w-[620px] rounded-xl py-5 px-4 shadow-shape space-y-5 sm:px-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <h2 className="text-2xl font-semibold text-zinc-100">
              Atualizar Transação {transactionId && `#${transactionId}`}
            </h2>
            <button onClick={closeModal}>
              <X className="size-5 text-zinc-400 transition duration-200 hover:text-zinc-200" />
            </button>
          </div>
        </div>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="h-14 px-4 flex items-center flex-1  gap-2 bg-zinc-950 border border-zinc-800 rounded-lg">
            <Text className="ml-1 text-zinc-400 size-5" />
            <input
              type="text"
              name="description"
              placeholder="Descrição da transação"
              className="bg-transparent text-lg placeholder-zinc-400 w-40 outline-none flex-1"
              onChange={(ev) => setDescription(ev.target.value)}
              value={description}
              required
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
              onChange={(ev) => setAmount(ev.target.value)}
              value={amount}
              required
            />
          </div>

          <div className="h-14 px-4 flex items-center flex-1 gap-2 bg-zinc-950 border border-zinc-800 rounded-lg">
            <List className="ml-1 text-zinc-400 size-5" />
            <select
              name="category"
              value={selectedCategoryId || ''}
              onChange={handleCategoryChange}
              className="bg-zinc-950 text-zinc-400 text-lg placeholder-zinc-400 w-40 outline-none flex-1  rounded-lg"
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

          <button className="button button-primary button-full" type="submit">
            Atualizar Transação
          </button>
        </form>
      </div>
    </div>
  );
}
