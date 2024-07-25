"use client";

import React from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await signOut({
      redirect: false,
    });

    router.replace("/");
  }

  return (
    <button
      onClick={logout}
      className="button button-primary button-default"
    >
      <LogOut className="size-5" />
      Sair
    </button>
  );
}
