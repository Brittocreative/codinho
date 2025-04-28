// src/app/api/katas/[id]/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const id = params.id;

  try {
    // Buscar o kata com seus casos de teste não ocultos
    const { data: kata, error: kataError } = await supabase
      .from("katas")
      .select(`
        id,
        titulo,
        descricao,
        dificuldade_kyu,
        codigo_inicial,
        linguagens,
        tags,
        criador:users(id, name),
        test_cases:test_cases(id, input, output_esperado, is_hidden, ordem)
      `)
      .eq("id", id)
      .eq("test_cases.is_hidden", false) // Apenas casos de teste visíveis
      .order("test_cases.ordem", { referencedTable: "test_cases" })
      .single();

    if (kataError) {
      console.error("Erro ao buscar kata:", kataError);
      if (kataError.code === "PGRST116") {
        return NextResponse.json({ error: "Kata não encontrado" }, { status: 404 });
      }
      return NextResponse.json({ error: "Erro ao buscar kata", details: kataError.message }, { status: 500 });
    }

    // Verificar se o usuário atual já resolveu este kata
    const session = await getServerSession(authOptions);
    let userSolution = null;

    if (session?.user?.id) {
      const { data: solution } = await supabase
        .from("solutions")
        .select("id, status, linguagem, codigo, submetido_em")
        .eq("kata_id", id)
        .eq("user_id", session.user.id)
        .order("submetido_em", { ascending: false })
        .limit(1)
        .single();

      userSolution = solution;
    }

    return NextResponse.json({
      ...kata,
      userSolution
    });

  } catch (error) {
    console.error("Erro inesperado na API de kata por ID:", error);
    return NextResponse.json({ error: "Erro inesperado no servidor" }, { status: 500 });
  }
}
