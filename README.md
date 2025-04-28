# CodeWars PT-BR (Adaptação do Projeto Codinho)

Este projeto é uma adaptação do projeto original "Codinho", transformado em uma plataforma de desafios de programação (katas) similar ao CodeWars, com foco no público brasileiro.

## Visão Geral

A plataforma permite que usuários resolvam desafios de programação (katas) em diferentes linguagens (inicialmente JavaScript), submetam suas soluções, vejam soluções de outros usuários (após resolverem o kata), votem em soluções e participem de discussões.

## Tecnologias Utilizadas

*   **Frontend:** Next.js (React), TypeScript, Tailwind CSS
*   **Backend:** Next.js API Routes
*   **Banco de Dados:** Supabase (PostgreSQL)
*   **Autenticação:** Auth.js (NextAuth.js) com adaptador Supabase
*   **Execução de Código:** Judge0 (requer ambiente Docker funcional)
*   **Gerenciador de Pacotes:** pnpm

## Estrutura do Projeto

```
/home/ubuntu/codinho/
├── .env.local           # Variáveis de ambiente (Supabase, Auth.js)
├── .gitignore
├── next.config.mjs
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js
├── public/
├── README.md            # Este arquivo
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts # Configuração Auth.js
│   │   │   ├── katas/
│   │   │   │   ├── [id]/route.ts       # Endpoint GET para detalhes do kata
│   │   │   │   └── route.ts            # Endpoint GET para listar katas
│   │   │   └── submissions/route.ts    # Endpoint POST para submissão
│   │   ├── auth/
│   │   │   ├── error/page.tsx        # Página de erro de autenticação
│   │   │   ├── profile/page.tsx      # Página de perfil do usuário
│   │   │   ├── signin/page.tsx       # Página de login
│   │   │   └── signout/page.tsx      # Página de logout
│   │   ├── globals.css
│   │   └── layout.tsx            # Layout principal com AuthProvider
│   ├── components/
│   │   └── ui/                 # Componentes Shadcn/UI (assumido)
│   ├── contexts/
│   │   └── AuthContext.tsx       # Contexto de autenticação
│   └── utils/
│       └── supabase/
│           ├── client.ts         # Cliente Supabase para o browser
│           └── server.ts         # Cliente Supabase para o servidor
├── supabase_auth_schema.sql # Script SQL para tabelas Auth.js
├── supabase_codewars_schema.sql # Script SQL para tabelas da aplicação
├── tailwind.config.ts
├── test_report.md         # Relatório de testes e problemas
├── test_supabase_connection.js # Script de teste de conexão Supabase
├── todo.md                # Acompanhamento das tarefas
└── tsconfig.json
```

## Configuração

1.  **Clonar o Repositório:**
    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd codinho
    ```
2.  **Instalar Dependências:**
    ```bash
    pnpm install
    ```
3.  **Configurar Supabase:**
    *   Crie um projeto no [Supabase](https://supabase.com/).
    *   No SQL Editor do seu projeto Supabase, execute os scripts:
        *   `supabase_auth_schema.sql`
        *   `supabase_codewars_schema.sql`
    *   Obtenha a URL do projeto, a chave anônima (`anon key`) e a chave de serviço (`service_role key`) nas configurações de API do seu projeto Supabase.
4.  **Configurar Variáveis de Ambiente:**
    *   Crie um arquivo `.env.local` na raiz do projeto.
    *   Adicione as seguintes variáveis com os valores obtidos do Supabase:
        ```
        NEXT_PUBLIC_SUPABASE_URL=<SUA_SUPABASE_URL>
        NEXT_PUBLIC_SUPABASE_ANON_KEY=<SUA_SUPABASE_ANON_KEY>
        SUPABASE_SERVICE_ROLE_KEY=<SUA_SUPABASE_SERVICE_ROLE_KEY>
        ```
    *   **Opcional (para provedores OAuth):** Adicione as credenciais para os provedores de autenticação desejados (GitHub, Google, etc.):
        ```
        GITHUB_ID=<SEU_GITHUB_CLIENT_ID>
        GITHUB_SECRET=<SEU_GITHUB_CLIENT_SECRET>
        GOOGLE_ID=<SEU_GOOGLE_CLIENT_ID>
        GOOGLE_SECRET=<SEU_GOOGLE_CLIENT_SECRET>
        # Adicione outras variáveis necessárias para Auth.js (ex: NEXTAUTH_SECRET, NEXTAUTH_URL)
        NEXTAUTH_SECRET=<SEU_NEXTAUTH_SECRET> # Gere um segredo: openssl rand -base64 32
        NEXTAUTH_URL=http://localhost:3000 # Ou a URL de produção
        ```
5.  **Configurar Judge0 (Ambiente de Execução):**
    *   Requer um ambiente com Docker e Docker Compose funcionando corretamente.
    *   Siga as instruções de setup do Judge0 (vide `test_report.md` para problemas encontrados no sandbox).
    *   Configure a URL da API do Judge0 no código onde as submissões são enviadas (atualmente em `/src/app/api/submissions/route.ts`).

## Executando o Projeto

```bash
pnpm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

## Documentação Adicional

*   **Estrutura do Banco de Dados:** Consulte o arquivo `DATABASE.md` (a ser criado).
*   **Endpoints da API:** Consulte o arquivo `API.md` (a ser criado).

## Problemas Conhecidos (Fase 1)

Consulte o arquivo `test_report.md` para detalhes sobre os problemas encontrados durante os testes iniciais:

1.  **Problema com Docker/Judge0:** O ambiente sandbox atual não suporta a execução correta do Docker, impedindo testes da funcionalidade de execução de código.
2.  **Problema com Acesso a Schemas no Supabase:** Dificuldades em acessar tabelas em schemas diferentes do `public` via API Supabase. Requer investigação adicional ou ajuste na estrutura do banco de dados.

## Próximas Fases (Plano de Adaptação)

*   **Fase 2: Sistema Central de Katas:** Refatoração do frontend, criação de páginas para listar, visualizar e resolver katas, integração com editor de código (Monaco).
*   **Fase 3: Funcionalidades Comunitárias:** Visualização de soluções, sistema de votação, comentários.
*   **Fase 4: Gamificação e Ranking:** Implementação do sistema Kyu/Dan e pontos de honra.
*   **Fase 5: Conteúdo e Polimento:** Criação de katas iniciais, tradução PT-BR, testes, documentação final.

