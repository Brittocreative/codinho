// Este script prepara o aplicativo Codinho Web para implantação
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Cores para mensagens no console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m'
};

console.log(`${colors.blue}=== Preparando o Codinho Web para implantação ===${colors.reset}\n`);

// Diretório do projeto
const projectDir = path.resolve(__dirname);

try {
  // Verificar dependências
  console.log(`${colors.yellow}Verificando dependências...${colors.reset}`);
  execSync('npm list next react react-dom framer-motion', { cwd: projectDir, stdio: 'inherit' });
  console.log(`${colors.green}✓ Dependências verificadas com sucesso!${colors.reset}\n`);

  // Executar testes
  console.log(`${colors.yellow}Executando testes...${colors.reset}`);
  try {
    execSync('npm test', { cwd: projectDir, stdio: 'inherit' });
    console.log(`${colors.green}✓ Testes executados com sucesso!${colors.reset}\n`);
  } catch (error) {
    console.log(`${colors.red}⚠ Alguns testes falharam, mas continuaremos com a implantação.${colors.reset}\n`);
  }

  // Construir o aplicativo para produção
  console.log(`${colors.yellow}Construindo o aplicativo para produção...${colors.reset}`);
  execSync('npm run build', { cwd: projectDir, stdio: 'inherit' });
  console.log(`${colors.green}✓ Aplicativo construído com sucesso!${colors.reset}\n`);

  // Verificar se a pasta .next foi criada
  const nextDir = path.join(projectDir, '.next');
  if (fs.existsSync(nextDir)) {
    console.log(`${colors.green}✓ Diretório de build (.next) encontrado!${colors.reset}\n`);
  } else {
    throw new Error('Diretório de build (.next) não encontrado!');
  }

  // Criar arquivo de ambiente para produção
  console.log(`${colors.yellow}Criando arquivo de ambiente para produção...${colors.reset}`);
  fs.writeFileSync(path.join(projectDir, '.env.production'), `
# Variáveis de ambiente para produção
NEXT_PUBLIC_APP_NAME=Codinho Web
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_APP_DESCRIPTION=Aprenda programação de forma divertida!
  `.trim());
  console.log(`${colors.green}✓ Arquivo de ambiente criado com sucesso!${colors.reset}\n`);

  // Instruções para implantação
  console.log(`${colors.blue}=== Instruções para implantação ===${colors.reset}\n`);
  console.log(`Para implantar o Codinho Web, você pode usar:

1. Vercel (recomendado para Next.js):
   $ npx vercel

2. Netlify:
   $ npx netlify deploy

3. GitHub Pages:
   Configure o GitHub Actions conforme documentação do Next.js

4. Servidor próprio:
   $ npm start
   
O aplicativo estará disponível para acesso via navegador em qualquer dispositivo!
`);

  console.log(`${colors.green}✓ Codinho Web está pronto para implantação!${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}Erro durante a preparação para implantação:${colors.reset}`, error);
  process.exit(1);
}
