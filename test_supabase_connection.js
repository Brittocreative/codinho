// test_supabase_connection.js
require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

// Configuração do cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Erro: Variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY não definidas");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseConnection() {
  try {
    console.log("Testando conexão com o Supabase...");
    console.log("URL:", supabaseUrl);

    // Listar tabelas disponíveis
    console.log("Verificando tabelas disponíveis...");
    
    // Verificar se a conexão básica funciona
    const { data: healthCheck, error: healthError } = await supabase.rpc('get_service_status');
    
    if (healthError) {
      console.error("Erro ao verificar status do serviço:", healthError);
    } else {
      console.log("Conexão com Supabase estabelecida com sucesso!");
      console.log("Status do serviço:", healthCheck);
    }

    // Tentar consultar a tabela no schema codewars usando notação de ponto
    const { data: codewarsUsers, error: codewarsError } = await supabase
      .from("codewars.users")
      .select("*")
      .limit(5);

    if (codewarsError) {
      console.error("Erro ao consultar tabela codewars.users:", codewarsError);
    } else {
      console.log("Consulta à tabela codewars.users bem-sucedida!");
      console.log("Dados recuperados:", codewarsUsers);
    }

    // Tentar consultar a tabela no schema next_auth usando notação de ponto
    const { data: authUsers, error: authError } = await supabase
      .from("next_auth.users")
      .select("*")
      .limit(5);

    if (authError) {
      console.error("Erro ao consultar tabela next_auth.users:", authError);
    } else {
      console.log("Consulta à tabela next_auth.users bem-sucedida!");
      console.log("Dados recuperados:", authUsers);
    }

    return true;
  } catch (err) {
    console.error("Erro inesperado:", err);
    return false;
  }
}

testSupabaseConnection();
