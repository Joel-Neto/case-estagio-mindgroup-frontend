"use client";

import { Trash2, LoaderCircle } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

interface DeleteTransactionButtonProps {
  token: string;
  transactionId: number;
}

export default function DeleteTransactionButton({
  token,
  transactionId,
}: DeleteTransactionButtonProps) {
  const router = useRouter();

  const handleDeleteClick = async () => {
    try {
      const response = await fetch(
        `http://localhost:3002/transactions/transaction/${transactionId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const apiData = await response.json();
        alert(apiData.message);
        window.location.reload();
      } else {
        if (response.status === 401) {
          alert("Usuário não autorizado. Redirecionando para o login...");

          await signOut({
            redirect: false,
          });

          router.replace("/");
        } else {
          console.error("Erro ao saldo total:", response.statusText);
        }
      }
    } catch (error) {
      console.error("Erro ao saldo total:", error);
    }
  };

  return (
    <button
      onClick={handleDeleteClick}
      className="button button-primary button-default"
    >
      <Trash2 className="size-5" />
    </button>
  );
}
