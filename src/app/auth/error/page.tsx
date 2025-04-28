// src/app/auth/error/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  let errorMessage = "Ocorreu um erro durante a autenticação.";

  // Personalizar mensagens de erro comuns do NextAuth
  switch (error) {
    case "Configuration":
      errorMessage = "Erro de configuração no servidor de autenticação.";
      break;
    case "AccessDenied":
      errorMessage = "Acesso negado. Você não tem permissão para entrar.";
      break;
    case "Verification":
      errorMessage = "O token de verificação expirou ou já foi usado.";
      break;
    // Adicionar mais casos conforme necessário
    default:
      errorMessage = `Ocorreu um erro: ${error || "desconhecido"}`;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 text-center">
      <h1 className="text-2xl font-bold mb-4 text-red-600">Erro de Autenticação</h1>
      <p className="mb-4">{errorMessage}</p>
      <Link href="/auth/signin" className="text-blue-500 hover:underline">
        Tentar entrar novamente
      </Link>
    </div>
  );
}

