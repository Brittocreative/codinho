// src/app/api/submissions/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Ajuste o caminho se necessário
import { getServerSession } from "next-auth/next";

// TODO: Definir interface para o corpo da requisição
interface SubmissionRequestBody {
  kata_id: string;
  linguagem_id: number; // ID da linguagem no Judge0
  codigo: string;
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const supabase = createClient();
  const userId = session.user.id;

  try {
    const body: SubmissionRequestBody = await request.json();
    const { kata_id, linguagem_id, codigo } = body;

    if (!kata_id || !linguagem_id || !codigo) {
      return NextResponse.json({ error: "Dados incompletos para submissão" }, { status: 400 });
    }

    // 1. Salvar a submissão inicial no banco de dados com status "em_processamento"
    const { data: initialSubmission, error: insertError } = await supabase
      .from("solutions")
      .insert({
        user_id: userId,
        kata_id: kata_id,
        linguagem: linguagem_id.toString(), // Armazenar ID da linguagem ou nome?
        codigo: codigo,
        status: "em_processamento",
      })
      .select("id")
      .single();

    if (insertError || !initialSubmission) {
      console.error("Erro ao salvar submissão inicial:", insertError);
      // Tratar caso de submissão duplicada (user_id, kata_id, linguagem)
      if (insertError?.code === '23505') { // unique_violation
         return NextResponse.json({ error: "Você já submeteu uma solução para este kata nesta linguagem." }, { status: 409 });
      }
      return NextResponse.json({ error: "Erro ao registrar submissão", details: insertError?.message }, { status: 500 });
    }

    const submissionId = initialSubmission.id;

    // 2. Enviar para o Judge0 (assíncrono - pode ser via fila/worker ou chamada direta com callback)
    // TODO: Implementar a chamada para a API do Judge0
    // Exemplo (simplificado, requer implementação real):
    // const judge0Response = await fetch("http://localhost:2358/submissions/?base64_encoded=false&wait=false", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     language_id: linguagem_id,
    //     source_code: codigo,
    //     // TODO: Adicionar stdin (dos test cases)
    //     // callback_url: "URL_PARA_RECEBER_RESULTADO_DO_JUDGE0" // Opcional
    //   }),
    // });
    // const judge0Result = await judge0Response.json();
    // const judge0Token = judge0Result.token;

    // 3. Retornar o ID da submissão para o frontend acompanhar
    // O frontend pode então fazer polling neste endpoint ou em um endpoint específico (/api/submissions/[id])
    // ou aguardar um webhook/websocket.

    console.log(`Submissão ${submissionId} criada para usuário ${userId} no kata ${kata_id}`);

    // Retorna o ID da submissão criada no banco
    return NextResponse.json({ submissionId: submissionId, message: "Submissão recebida, processando..." });

  } catch (error) {
    console.error("Erro inesperado na API de submissões:", error);
    // Verifica se o erro é de JSON inválido
    if (error instanceof SyntaxError) {
        return NextResponse.json({ error: "Corpo da requisição inválido (JSON mal formatado)" }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro inesperado no servidor" }, { status: 500 });
  }
}

// TODO: Implementar GET para buscar status/resultado de uma submissão específica
// export async function GET(request: Request) { ... }

