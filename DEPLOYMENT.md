# Codinho Web - Documentação de Implantação

Este documento fornece instruções detalhadas para implantar o aplicativo Codinho Web em diferentes plataformas de hospedagem.

## Pré-requisitos

- Node.js 16.x ou superior
- npm 7.x ou superior
- Git (opcional, para controle de versão)

## Preparação para Implantação

1. Clone o repositório (se aplicável):
   ```bash
   git clone https://github.com/seu-usuario/codinho-web.git
   cd codinho-web
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Execute o script de preparação para implantação:
   ```bash
   node deploy.js
   ```

## Opções de Implantação

### 1. Vercel (Recomendado para Next.js)

A Vercel é a plataforma criada pelos desenvolvedores do Next.js e oferece a melhor experiência de implantação:

1. Instale a CLI da Vercel:
   ```bash
   npm install -g vercel
   ```

2. Faça login na sua conta Vercel:
   ```bash
   vercel login
   ```

3. Implante o aplicativo:
   ```bash
   vercel
   ```

4. Para implantação em produção:
   ```bash
   vercel --prod
   ```

### 2. Netlify

O Netlify é uma excelente alternativa para hospedar aplicativos Next.js:

1. Instale a CLI do Netlify:
   ```bash
   npm install -g netlify-cli
   ```

2. Faça login na sua conta Netlify:
   ```bash
   netlify login
   ```

3. Implante o aplicativo:
   ```bash
   netlify deploy
   ```

4. Para implantação em produção:
   ```bash
   netlify deploy --prod
   ```

### 3. GitHub Pages

Para hospedar no GitHub Pages, você precisará configurar o GitHub Actions:

1. Crie um arquivo `.github/workflows/deploy.yml` com o seguinte conteúdo:
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [main]

   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - uses: actions/setup-node@v2
           with:
             node-version: '16'
         - run: npm ci
         - run: npm run build
         - run: npm run export
         - name: Deploy to GitHub Pages
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./out
   ```

2. Configure o Next.js para exportação estática adicionando ao `next.config.js`:
   ```js
   module.exports = {
     images: {
       unoptimized: true,
     },
   };
   ```

3. Adicione um script de exportação ao `package.json`:
   ```json
   "scripts": {
     "export": "next export"
   }
   ```

### 4. Servidor Próprio

Para hospedar em seu próprio servidor:

1. Construa o aplicativo:
   ```bash
   npm run build
   ```

2. Inicie o servidor:
   ```bash
   npm start
   ```

3. Para um ambiente de produção, recomenda-se usar um gerenciador de processos como PM2:
   ```bash
   npm install -g pm2
   pm2 start npm --name "codinho-web" -- start
   ```

## Configuração de Domínio Personalizado

Após a implantação, você pode configurar um domínio personalizado:

1. **Vercel/Netlify**: Adicione o domínio através do painel de controle da plataforma.
2. **Servidor próprio**: Configure o servidor web (Nginx, Apache) para apontar para a porta onde o aplicativo está sendo executado.

## Monitoramento e Manutenção

- Configure alertas para monitorar o desempenho e a disponibilidade do aplicativo.
- Implemente análises para acompanhar o uso do aplicativo.
- Estabeleça um processo para atualizações regulares e correções de bugs.

## Suporte

Para suporte com a implantação, entre em contato com a equipe de desenvolvimento do Codinho Web.
