"use client";

import { Edit } from "lucide-react";
import React, { useState } from "react";
import UpdateTransactions from "./UpdateTransactions";

interface UpdateTransactionsProps {
  transactionId: string;
  token: string;
  userId: string
}

export default function UpdateTransactionsButton({
  transactionId,
  token,
  userId
}: UpdateTransactionsProps) {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const openModal = () => {
    setIsUpdateModalOpen(true);
  }
  const closeModal = () => {
    setIsUpdateModalOpen(false);
  }

  return (
    <>
      <button
        onClick={openModal}
        className="button button-primary button-default"
      >
        <Edit className="size-5" />
      </button>
      {isUpdateModalOpen && (
        <UpdateTransactions token={token} transactionId={transactionId} closeModal={closeModal} userId={userId}/>
      )}
    </>
  );
}
