# Documentação da API

Este documento descreve os endpoints da API implementados na plataforma CodeWars PT-BR.

## Visão Geral

A API foi implementada utilizando as API Routes do Next.js, que permitem a criação de endpoints serverless. Os endpoints estão localizados no diretório `/src/app/api/`.

## Autenticação

A autenticação é gerenciada pelo Auth.js (anteriormente NextAuth.js) integrado com o Supabase. O endpoint de autenticação está em `/api/auth/[...nextauth]/route.ts`.

Para acessar endpoints protegidos, o cliente deve estar autenticado. A verificação de autenticação é feita através do middleware em `/src/middleware.ts`.

## Endpoints

### Katas

#### Listar Katas

```
GET /api/katas
```

Retorna uma lista de katas publicados, com suporte a filtros.

**Parâmetros de Query:**
- `dificuldade` (opcional): Filtra por nível de dificuldade (1-8 kyu)
- `linguagem` (opcional): Filtra por linguagem suportada
- `busca` (opcional): Busca no título e descrição

**Resposta:**
```json
[
  {
    "id": "uuid-do-kata",
    "titulo": "Título do Kata",
    "descricao": "Descrição do kata...",
    "dificuldade_kyu": 6,
    "linguagens": ["javascript", "python"],
    "tags": ["arrays", "algoritmos"],
    "criador": {
      "id": "uuid-do-usuario",
      "name": "Nome do Criador"
    }
  },
  // ...mais katas
]
```

**Códigos de Status:**
- `200 OK`: Retorna a lista de katas
- `500 Internal Server Error`: Erro ao buscar katas

#### Obter Detalhes de um Kata

```
GET /api/katas/[id]
```

Retorna os detalhes de um kata específico, incluindo casos de teste não ocultos.

**Parâmetros de URL:**
- `id`: ID do kata

**Resposta:**
```json
{
  "id": "uuid-do-kata",
  "titulo": "Título do Kata",
  "descricao": "Descrição detalhada do kata...",
  "dificuldade_kyu": 6,
  "codigo_inicial": "function solucao(input) {\n  // seu código aqui\n}",
  "linguagens": ["javascript", "python"],
  "tags": ["arrays", "algoritmos"],
  "criador": {
    "id": "uuid-do-usuario",
    "name": "Nome do Criador"
  },
  "test_cases": [
    {
      "id": "uuid-do-teste",
      "input": "5",
      "output_esperado": "120",
      "is_hidden": false,
      "ordem": 1
    },
    // ...mais casos de teste não ocultos
  ],
  "userSolution": {
    // Solução do usuário atual, se existir
    "id": "uuid-da-solucao",
    "status": "aprovado",
    "linguagem": "javascript",
    "codigo": "function solucao(input) {\n  return factorial(input);\n}\n\nfunction factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n-1);\n}",
    "submetido_em": "2025-04-28T12:34:56Z"
  }
}
```

**Códigos de Status:**
- `200 OK`: Retorna os detalhes do kata
- `404 Not Found`: Kata não encontrado
- `500 Internal Server Error`: Erro ao buscar kata

### Submissões

#### Submeter Solução

```
POST /api/submissions
```

Submete uma solução para um kata. Requer autenticação.

**Corpo da Requisição:**
```json
{
  "kata_id": "uuid-do-kata",
  "linguagem_id": 63, // ID da linguagem no Judge0 (63 = JavaScript)
  "codigo": "function solucao(input) {\n  // implementação da solução\n}"
}
```

**Resposta:**
```json
{
  "submissionId": "uuid-da-submissao",
  "message": "Submissão recebida, processando..."
}
```

**Códigos de Status:**
- `200 OK`: Submissão recebida com sucesso
- `400 Bad Request`: Dados incompletos ou inválidos
- `401 Unauthorized`: Usuário não autenticado
- `409 Conflict`: Usuário já submeteu uma solução para este kata nesta linguagem
- `500 Internal Server Error`: Erro ao processar submissão

## Endpoints Planejados (Não Implementados)

Os seguintes endpoints estão planejados para implementação futura:

### Katas

```
POST /api/katas
```
Criar um novo kata (requer autenticação).

```
PUT /api/katas/[id]
```
Atualizar um kata existente (requer autenticação e autorização).

```
DELETE /api/katas/[id]
```
Excluir um kata (requer autenticação e autorização).

### Submissões

```
GET /api/submissions/[id]
```
Obter o status/resultado de uma submissão específica.

```
GET /api/katas/[id]/solutions
```
Listar soluções aprovadas para um kata (visível apenas para usuários que já resolveram o kata).

### Votos

```
POST /api/solutions/[id]/vote
```
Votar em uma solução (upvote/downvote).

### Comentários

```
POST /api/katas/[id]/comments
POST /api/solutions/[id]/comments
```
Adicionar comentários a katas ou soluções.

```
GET /api/katas/[id]/comments
GET /api/solutions/[id]/comments
```
Listar comentários de um kata ou solução.

## Integração com Judge0

A integração com o Judge0 para execução de código está parcialmente implementada no endpoint de submissões. A implementação completa requer:

1. Um ambiente Docker funcional para executar o Judge0
2. Configuração da URL da API do Judge0 no código
3. Implementação da lógica para enviar os casos de teste junto com o código
4. Implementação de um endpoint ou webhook para receber os resultados da execução

Consulte o arquivo `test_report.md` para detalhes sobre os problemas encontrados com o Docker durante os testes iniciais.
