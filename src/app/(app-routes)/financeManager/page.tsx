import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import CreateTransaction from "@/components/CreateTransaction";
import Header from "@/components/Header";
import ShowTransactionsData from "@/components/ShowTransactionsData";
import { getServerSession } from "next-auth";
import React from "react";

export default async function FinanceManager() {
  const session = await getServerSession(nextAuthOptions);
  const token = session?.token;
  const userId = session?.user.id;

  return (
    <>
      <div className="container max-w-6xl mx-auto px-1 py-10 space-y-6">
        <Header /> 

        <CreateTransaction token={token as string} idUser={userId as number} />

        <ShowTransactionsData />
      </div>
    </>
  );
}
