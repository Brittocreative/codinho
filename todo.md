# TODO - Adaptação Codinho -> CodeWars PT-BR

Este arquivo acompanha o progresso da adaptação do projeto Codinho para uma plataforma estilo CodeWars, conforme o plano de implementação.

**Fase 1: Fundação (Backend, Banco de Dados, Autenticação)**

1.  **Escolha e Configuração de Tecnologias:**
    *   [x] **Backend de Execução:** Selecionar e configurar uma solução para execução segura de código (Ex: Judge0 auto-hospedado em Docker). Focar inicialmente em JavaScript.
    *   [x] **Banco de Dados:** Escolher e configurar um banco de dados (Ex: Supabase/PostgreSQL). (Configuração inicial concluída)
    *   [x] **Autenticação:** Configurar um provedor de autenticação (Ex: NextAuth.js integrado com Supabase Auth). (Configuração inicial concluída)

2.  **Estrutura do Banco de Dados:**
    *   [x] Definir e criar tabelas para: `users`, `katas`, `test_cases`, `solutions`, `votes`, `comments`.
3.  **API Backend Básica:**
    *   [x] Criar endpoints básicos da API (Next.js API Routes) para: autenticação, busca de katas, submissão de código. (Endpoints GET /api/katas, POST /api/submissions, GET /api/katas/[id] criados)
4.  **Implementação da Autenticação:**
    *   [x] Integrar NextAuth.js no frontend. (AuthProvider integrado no layout)    *   [x] Criar páginas de login, registro e gerenciamento de perfil. (Páginas /auth/signin, /auth/signout, /auth/error, /auth/profile criadas)    *   [x] Proteger rotas/funcionalidades que exigem login. (Middleware implementado para proteção de rotas)

**Fase 2: Sistema Central de Katas**

5.  **Refatoração do Frontend:**
    *   [ ] Remover componentes, páginas e contextos relacionados a "Bootcamps".
    *   [ ] Adaptar layout principal e navegação para Katas.

6.  **Interface de Navegação de Katas:**
    *   [ ] Criar página para listar Katas.
    *   [ ] Implementar filtros (dificuldade, linguagem, status).
    *   [ ] Implementar busca de Katas.
    *   [ ] Conectar interface aos endpoints da API.

7.  **Interface de Resolução de Katas:**
    *   [ ] Integrar editor de código avançado (Ex: Monaco Editor).
    *   [ ] Criar layout da página de resolução (instruções, editor, testes, saída).
    *   [ ] Implementar botões "Executar Testes" e "Submeter Solução Final".

8.  **Integração Frontend-Backend (Execução):**
    *   [ ] Conectar botão "Executar Testes" à API de execução.
    *   [ ] Exibir resultados dos testes na interface.
    *   [ ] Implementar lógica de submissão final.

9.  **Armazenamento de Soluções:**
    *   [ ] Salvar solução válida no banco de dados via API.

**Fase 3: Ranking e Progressão**

10. **Sistema de Ranking (Kyu/Dan):**
    *   [ ] Adicionar campos `dificuldade_kyu`, `rank_kyu`, `honra` às tabelas.
    *   [ ] Implementar lógica de atualização de rank/honra no backend.
    *   [ ] Refatorar/substituir `GamificationContext`.

11. **Exibição de Rank e Progresso:**
    *   [ ] Exibir rank no perfil e interface.
    *   [ ] Mostrar progresso para próximo rank.

**Fase 4: Recursos Comunitários**

12. **Visualização de Soluções:**
    *   [ ] Criar interface para visualizar soluções de outros usuários.
    *   [ ] Implementar filtros/ordenação para soluções.

13. **Votação e Discussão:**
    *   [ ] Implementar sistema de votos (upvotes) para soluções.
    *   [ ] Implementar seções de comentários/discussão.
    *   [ ] Conectar funcionalidades à API/banco de dados.

14. **Perfis de Usuário Públicos:**
    *   [ ] Criar páginas de perfil públicas.

15. **Leaderboard:**
    *   [ ] Criar página de ranking (leaderboard).

**Fase 5: Polimento e Finalização**

16. **Suporte a Múltiplas Linguagens:**
    *   [ ] Adicionar suporte a outras linguagens no backend de execução.
    *   [ ] Permitir seleção de linguagem na interface.
    *   [ ] Adaptar editor e validação.

17. **Tradução para Português:**
    *   [ ] Configurar biblioteca de i18n (`next-i18next`).
    *   [ ] Extrair strings e traduzir interface para PT-BR.
    *   [ ] Criar conteúdo inicial (Katas) em PT-BR.

18. **Testes Abrangentes:**
    *   [ ] Escrever testes unitários e de integração.
    *   [ ] Realizar testes end-to-end.

19. **Documentação:**
    *   [ ] Atualizar `README.md`.
    *   [ ] Criar documentação de arquitetura/API.

20. **Configuração de Implantação:**
    *   [ ] Preparar configurações para implantação (Vercel, Docker, etc.).

