// src/app/api/katas/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  
  // TODO: Implementar filtros (dificuldade, linguagem, status, busca)
  const dificuldade = searchParams.get("dificuldade");
  const linguagem = searchParams.get("linguagem");
  const busca = searchParams.get("busca");

  try {
    let query = supabase
      .from("katas")
      .select(`
        id,
        titulo,
        descricao,
        dificuldade_kyu,
        linguagens,
        tags,
        criador:users(id, name)
      `)
      .eq("publicado", true) // Apenas katas publicados
      .order("created_at", { ascending: false });

    // Aplicar filtros (exemplo básico)
    if (dificuldade) {
      query = query.eq("dificuldade_kyu", parseInt(dificuldade));
    }
    if (linguagem) {
      query = query.contains("linguagens", [linguagem]);
    }
    if (busca) {
      // Busca simples no título e descrição
      query = query.or(`titulo.ilike.%${busca}%,descricao.ilike.%${busca}%`);
    }

    const { data: katas, error } = await query;

    if (error) {
      console.error("Erro ao buscar katas:", error);
      return NextResponse.json({ error: "Erro ao buscar katas", details: error.message }, { status: 500 });
    }

    return NextResponse.json(katas);

  } catch (error) {
    console.error("Erro inesperado na API de katas:", error);
    return NextResponse.json({ error: "Erro inesperado no servidor" }, { status: 500 });
  }
}

// TODO: Implementar POST para criação de novos katas (requer autenticação e autorização)
// export async function POST(request: Request) { ... }

