# Documentação do Banco de Dados (Supabase/PostgreSQL)

Este documento descreve a estrutura do banco de dados utilizada na plataforma CodeWars PT-BR, implementada no Supabase.

## Schemas

O banco de dados utiliza dois schemas principais:

1.  **`next_auth`**: Criado e gerenciado pelo adaptador Auth.js para Supabase. Contém as tabelas necessárias para o sistema de autenticação (`users`, `accounts`, `sessions`, `verification_tokens`).
2.  **`codewars`**: Criado especificamente para a aplicação CodeWars PT-BR. Contém as tabelas relacionadas aos katas, soluções, usuários (dados adicionais), votos e comentários.

## Tabelas do Schema `next_auth`

Estas tabelas são criadas automaticamente pelo script `supabase_auth_schema.sql` e gerenciadas pelo Auth.js.

*   **`users`**: Armazena informações básicas dos usuários (id, nome, email, imagem, emailVerified).
*   **`accounts`**: Vincula contas de provedores OAuth (GitHub, Google) aos usuários.
*   **`sessions`**: Armazena informações das sessões ativas dos usuários.
*   **`verification_tokens`**: Utilizada para o fluxo de verificação de email (login sem senha).

## Tabelas do Schema `codewars`

Estas tabelas são criadas pelo script `supabase_codewars_schema.sql`.

### `codewars.users`

Armazena informações adicionais do perfil do usuário, complementando `next_auth.users`.

*   `id` (UUID, PK, FK -> next_auth.users.id): Chave primária e estrangeira referenciando o usuário na tabela de autenticação.
*   `rank_kyu` (INTEGER, DEFAULT 8): Nível de ranking do usuário (8 kyu é iniciante).
*   `honra` (INTEGER, DEFAULT 0): Pontos de honra acumulados pelo usuário.
*   `bio` (TEXT): Biografia curta do usuário.
*   `github_username` (TEXT): Nome de usuário do GitHub.
*   `website` (TEXT): URL do site pessoal.
*   `location` (TEXT): Localização do usuário.
*   `created_at` (TIMESTAMPZ): Data de criação do perfil.
*   `updated_at` (TIMESTAMPZ): Data da última atualização do perfil.

### `codewars.katas`

Armazena os desafios de programação (katas).

*   `id` (UUID, PK): Identificador único do kata.
*   `titulo` (TEXT): Título do kata.
*   `descricao` (TEXT): Descrição detalhada do desafio.
*   `dificuldade_kyu` (INTEGER): Nível de dificuldade (1 a 8 kyu).
*   `codigo_inicial` (TEXT): Código base fornecido ao usuário para iniciar a solução.
*   `linguagens` (TEXT[]): Array de linguagens suportadas (ex: `{"javascript", "python"}`).
*   `criador_id` (UUID, FK -> next_auth.users.id): ID do usuário que criou o kata.
*   `publicado` (BOOLEAN, DEFAULT FALSE): Indica se o kata está visível para todos.
*   `tags` (TEXT[]): Array de tags para categorização.
*   `created_at` (TIMESTAMPZ): Data de criação.
*   `updated_at` (TIMESTAMPZ): Data da última atualização.

### `codewars.test_cases`

Armazena os casos de teste para cada kata.

*   `id` (UUID, PK): Identificador único do caso de teste.
*   `kata_id` (UUID, FK -> codewars.katas.id): Kata ao qual o teste pertence.
*   `input` (TEXT): Entrada para o caso de teste (pode ser JSON ou outro formato).
*   `output_esperado` (TEXT): Saída esperada para o caso de teste.
*   `is_hidden` (BOOLEAN, DEFAULT FALSE): Indica se o caso de teste é oculto (usado para validação final).
*   `ordem` (INTEGER): Ordem de execução dos testes.
*   `created_at` (TIMESTAMPZ): Data de criação.
*   `updated_at` (TIMESTAMPZ): Data da última atualização.

### `codewars.solutions`

Armazena as soluções submetidas pelos usuários.

*   `id` (UUID, PK): Identificador único da solução.
*   `user_id` (UUID, FK -> next_auth.users.id): Usuário que submeteu a solução.
*   `kata_id` (UUID, FK -> codewars.katas.id): Kata ao qual a solução pertence.
*   `linguagem` (TEXT): Linguagem utilizada na solução.
*   `codigo` (TEXT): Código da solução submetida.
*   `status` (TEXT): Status da solução (`aprovado`, `reprovado`, `em_processamento`, `erro`).
*   `pontos_obtidos` (INTEGER): Pontos ganhos por esta solução (se aplicável).
*   `tempo_execucao` (FLOAT): Tempo de execução registrado pelo Judge0.
*   `memoria_utilizada` (INTEGER): Memória utilizada registrada pelo Judge0.
*   `submetido_em` (TIMESTAMPZ): Data da submissão.
*   Constraint `UNIQUE (user_id, kata_id, linguagem)`: Impede múltiplas soluções aprovadas para o mesmo usuário/kata/linguagem.

### `codewars.votes`

Armazena os votos dados às soluções.

*   `id` (UUID, PK): Identificador único do voto.
*   `solution_id` (UUID, FK -> codewars.solutions.id): Solução que recebeu o voto.
*   `user_id` (UUID, FK -> next_auth.users.id): Usuário que deu o voto.
*   `tipo_voto` (TEXT): Tipo do voto (`upvote`, `downvote`).
*   `created_at` (TIMESTAMPZ): Data do voto.
*   Constraint `UNIQUE (solution_id, user_id)`: Impede múltiplos votos do mesmo usuário na mesma solução.

### `codewars.comments`

Armazena comentários em katas ou soluções.

*   `id` (UUID, PK): Identificador único do comentário.
*   `user_id` (UUID, FK -> next_auth.users.id): Usuário que fez o comentário.
*   `kata_id` (UUID, FK -> codewars.katas.id): Kata comentado (NULL se for comentário em solução).
*   `solution_id` (UUID, FK -> codewars.solutions.id): Solução comentada (NULL se for comentário em kata).
*   `texto` (TEXT): Conteúdo do comentário.
*   `created_at` (TIMESTAMPZ): Data de criação.
*   `updated_at` (TIMESTAMPZ): Data da última atualização.
*   Constraint `CHECK`: Garante que o comentário pertence a um kata OU a uma solução, não ambos.

## Políticas de Segurança (RLS)

Políticas de segurança a nível de linha (Row Level Security - RLS) foram implementadas para controlar o acesso aos dados:

*   **Usuários:** Podem ver todos os perfis, mas só editar o próprio.
*   **Katas:** Todos podem ver katas publicados; criadores podem ver e gerenciar seus katas não publicados.
*   **Casos de Teste:** Todos podem ver testes não ocultos; criadores podem gerenciar todos os testes de seus katas.
*   **Soluções:** Usuários podem ver suas próprias soluções e as de outros (após resolverem o kata).
*   **Votos:** Todos podem ver votos; usuários podem criar/alterar/remover apenas seus próprios votos.
*   **Comentários:** Todos podem ver comentários em katas publicados; usuários podem criar/editar/excluir seus próprios comentários.

Consulte o script `supabase_codewars_schema.sql` para a definição detalhada das políticas RLS.
