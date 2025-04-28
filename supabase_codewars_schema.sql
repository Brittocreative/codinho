-- Criação do schema para a aplicação CodeWars PT-BR
CREATE SCHEMA IF NOT EXISTS codewars;

GRANT USAGE ON SCHEMA codewars TO service_role;
GRANT ALL ON SCHEMA codewars TO postgres;

-- Tabela de usuários estendida (complementa a tabela next_auth.users)
CREATE TABLE IF NOT EXISTS codewars.users (
    id UUID PRIMARY KEY REFERENCES next_auth.users(id) ON DELETE CASCADE,
    rank_kyu INTEGER NOT NULL DEFAULT 8, -- Iniciantes começam no rank 8 kyu
    honra INTEGER NOT NULL DEFAULT 0,
    bio TEXT,
    github_username TEXT,
    website TEXT,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

GRANT ALL ON TABLE codewars.users TO postgres;
GRANT ALL ON TABLE codewars.users TO service_role;

-- Tabela de katas (desafios de programação)
CREATE TABLE IF NOT EXISTS codewars.katas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    dificuldade_kyu INTEGER NOT NULL CHECK (dificuldade_kyu BETWEEN 1 AND 8),
    codigo_inicial TEXT,
    linguagens TEXT[] NOT NULL DEFAULT '{javascript}',
    criador_id UUID NOT NULL REFERENCES next_auth.users(id) ON DELETE CASCADE,
    publicado BOOLEAN NOT NULL DEFAULT FALSE,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

GRANT ALL ON TABLE codewars.katas TO postgres;
GRANT ALL ON TABLE codewars.katas TO service_role;

-- Tabela de casos de teste para os katas
CREATE TABLE IF NOT EXISTS codewars.test_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kata_id UUID NOT NULL REFERENCES codewars.katas(id) ON DELETE CASCADE,
    input TEXT,
    output_esperado TEXT NOT NULL,
    is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
    ordem INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

GRANT ALL ON TABLE codewars.test_cases TO postgres;
GRANT ALL ON TABLE codewars.test_cases TO service_role;

-- Tabela de soluções submetidas pelos usuários
CREATE TABLE IF NOT EXISTS codewars.solutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES next_auth.users(id) ON DELETE CASCADE,
    kata_id UUID NOT NULL REFERENCES codewars.katas(id) ON DELETE CASCADE,
    linguagem TEXT NOT NULL,
    codigo TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('aprovado', 'reprovado', 'em_processamento', 'erro')),
    pontos_obtidos INTEGER DEFAULT 0,
    tempo_execucao FLOAT,
    memoria_utilizada INTEGER,
    submetido_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, kata_id, linguagem)
);

GRANT ALL ON TABLE codewars.solutions TO postgres;
GRANT ALL ON TABLE codewars.solutions TO service_role;

-- Tabela de votos para soluções
CREATE TABLE IF NOT EXISTS codewars.votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    solution_id UUID NOT NULL REFERENCES codewars.solutions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES next_auth.users(id) ON DELETE CASCADE,
    tipo_voto TEXT NOT NULL CHECK (tipo_voto IN ('upvote', 'downvote')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE (solution_id, user_id)
);

GRANT ALL ON TABLE codewars.votes TO postgres;
GRANT ALL ON TABLE codewars.votes TO service_role;

-- Tabela de comentários (pode ser para katas ou soluções)
CREATE TABLE IF NOT EXISTS codewars.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES next_auth.users(id) ON DELETE CASCADE,
    kata_id UUID REFERENCES codewars.katas(id) ON DELETE CASCADE,
    solution_id UUID REFERENCES codewars.solutions(id) ON DELETE CASCADE,
    texto TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CHECK (
        (kata_id IS NOT NULL AND solution_id IS NULL) OR
        (kata_id IS NULL AND solution_id IS NOT NULL)
    )
);

GRANT ALL ON TABLE codewars.comments TO postgres;
GRANT ALL ON TABLE codewars.comments TO service_role;

-- Políticas de segurança RLS (Row Level Security)

-- Habilitar RLS em todas as tabelas
ALTER TABLE codewars.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE codewars.katas ENABLE ROW LEVEL SECURITY;
ALTER TABLE codewars.test_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE codewars.solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE codewars.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE codewars.comments ENABLE ROW LEVEL SECURITY;

-- Políticas para usuários
CREATE POLICY "Usuários podem ver todos os perfis"
    ON codewars.users FOR SELECT
    USING (true);

CREATE POLICY "Usuários podem editar apenas seu próprio perfil"
    ON codewars.users FOR UPDATE
    USING (id = next_auth.uid());

-- Políticas para katas
CREATE POLICY "Qualquer um pode ver katas publicados"
    ON codewars.katas FOR SELECT
    USING (publicado = true);

CREATE POLICY "Criadores podem ver seus próprios katas não publicados"
    ON codewars.katas FOR SELECT
    USING (criador_id = next_auth.uid());

CREATE POLICY "Criadores podem editar seus próprios katas"
    ON codewars.katas FOR UPDATE
    USING (criador_id = next_auth.uid());

CREATE POLICY "Criadores podem inserir katas"
    ON codewars.katas FOR INSERT
    WITH CHECK (criador_id = next_auth.uid());

-- Políticas para casos de teste
CREATE POLICY "Qualquer um pode ver casos de teste não ocultos"
    ON codewars.test_cases FOR SELECT
    USING (
        is_hidden = false OR
        EXISTS (
            SELECT 1 FROM codewars.katas
            WHERE codewars.katas.id = codewars.test_cases.kata_id
            AND codewars.katas.criador_id = next_auth.uid()
        )
    );

CREATE POLICY "Criadores podem gerenciar casos de teste"
    ON codewars.test_cases FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM codewars.katas
            WHERE codewars.katas.id = codewars.test_cases.kata_id
            AND codewars.katas.criador_id = next_auth.uid()
        )
    );

-- Políticas para soluções
CREATE POLICY "Usuários podem ver suas próprias soluções"
    ON codewars.solutions FOR SELECT
    USING (user_id = next_auth.uid());

CREATE POLICY "Usuários podem ver soluções de outros após resolver o kata"
    ON codewars.solutions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM codewars.solutions AS my_solution
            WHERE my_solution.kata_id = codewars.solutions.kata_id
            AND my_solution.user_id = next_auth.uid()
            AND my_solution.status = 'aprovado'
        )
    );

CREATE POLICY "Usuários podem inserir suas próprias soluções"
    ON codewars.solutions FOR INSERT
    WITH CHECK (user_id = next_auth.uid());

-- Políticas para votos
CREATE POLICY "Usuários podem ver todos os votos"
    ON codewars.votes FOR SELECT
    USING (true);

CREATE POLICY "Usuários podem votar apenas uma vez por solução"
    ON codewars.votes FOR INSERT
    WITH CHECK (user_id = next_auth.uid());

CREATE POLICY "Usuários podem alterar apenas seus próprios votos"
    ON codewars.votes FOR UPDATE
    USING (user_id = next_auth.uid());

CREATE POLICY "Usuários podem remover apenas seus próprios votos"
    ON codewars.votes FOR DELETE
    USING (user_id = next_auth.uid());

-- Políticas para comentários
CREATE POLICY "Qualquer um pode ver comentários em katas publicados"
    ON codewars.comments FOR SELECT
    USING (
        kata_id IS NULL OR
        EXISTS (
            SELECT 1 FROM codewars.katas
            WHERE codewars.katas.id = codewars.comments.kata_id
            AND codewars.katas.publicado = true
        )
    );

CREATE POLICY "Usuários podem inserir seus próprios comentários"
    ON codewars.comments FOR INSERT
    WITH CHECK (user_id = next_auth.uid());

CREATE POLICY "Usuários podem editar seus próprios comentários"
    ON codewars.comments FOR UPDATE
    USING (user_id = next_auth.uid());

CREATE POLICY "Usuários podem excluir seus próprios comentários"
    ON codewars.comments FOR DELETE
    USING (user_id = next_auth.uid());
