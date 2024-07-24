"use client";

import React, { ReactNode } from "react";
import { Plus } from "lucide-react";

interface ButtonPrimaryProps {
  onButtonClick: () => void;
  children: ReactNode;
}
// const router = useRouter();

// async function logout() {
//   await signOut({
//     redirect: false,
//   });

//   router.replace("/");
// }

export default function CreateTransactionButton({
  onButtonClick,
  children,
}: ButtonPrimaryProps) {

  function onButtonClick() {
    
  }

  return (
    <button
      // onClick={onButtonClick}
      className="button button-primary button-default"
    >
      <Plus className="size-5" />
      Cadastrar Transação
    </button>
  );
}
