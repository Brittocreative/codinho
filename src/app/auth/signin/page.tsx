// src/app/auth/signin/page.tsx
"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button"; // Assuming shadcn/ui is used or similar

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold mb-4">Entrar</h1>
      <div className="space-y-4">
        {/* TODO: Adicionar mais provedores conforme configurado em [...nextauth]/route.ts */}
        <Button onClick={() => signIn("github")} className="w-full">
          Entrar com GitHub
        </Button>
        <Button onClick={() => signIn("google")} className="w-full">
          Entrar com Google
        </Button>
        {/* TODO: Implementar formulário de login com Email */}
        {/* <Button onClick={() => signIn("email", { email: "user@example.com" })} className="w-full">
          Entrar com Email
        </Button> */}
      </div>
    </div>
  );
}

