// src/app/auth/signout/page.tsx
"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function SignOutPage() {
  // Opcional: Deslogar automaticamente ao visitar a página
  // useEffect(() => {
  //   signOut({ callbackUrl: "/" });
  // }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold mb-4">Sair</h1>
      <p className="mb-4">Tem certeza que deseja sair?</p>
      <Button onClick={() => signOut({ callbackUrl: "/" })} variant="destructive">
        Confirmar Saída
      </Button>
    </div>
  );
}

