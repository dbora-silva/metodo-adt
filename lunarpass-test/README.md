# Lunar Pass — Testes E2E (Playwright)

Suíte de testes end-to-end para a aplicação Lunar Pass, usando [Playwright](https://playwright.dev/).

Para o panorama completo do projeto (contexto do curso, estratégia de locators, limitações e link para a análise de aderência), veja o [README da raiz do repositório](../README.md).

## Pré-requisitos

- Node.js 20+
- npm 10+
- A aplicação [Lunar Pass](../lunar-pass) rodando localmente (veja abaixo)

## Instalação

```bash
npm install
```

Para uma instalação reprodutível (idêntica ao `package-lock.json`), use:

```bash
npm ci
```

### Variáveis de ambiente

Os testes que preparam massa de dados diretamente no banco (`support/db.ts`, usado por `register.spec.ts`) leem a connection string do Postgres/Supabase pela variável `DATABASE_URL`. Copie o exemplo e preencha com suas credenciais:

```bash
cp .env.example .env
```

`.env` não é versionado.

## Rodando a aplicação sob teste

Os testes esperam a aplicação Lunar Pass rodando localmente. A aplicação fica em `lunar-pass/` e é um projeto Node/Yarn separado — seu gerenciador de pacotes não tem relação com o desta suíte.

Em outro terminal, na pasta `lunar-pass/`:

```bash
cd ../lunar-pass
PORT=3001 yarn start
```

```powershell
# PowerShell
$env:PORT = "3001"
yarn start
```

O `baseURL` padrão desta suíte (`http://localhost:3001`) já assume essa porta.

## Rodando os testes

```bash
npm test
```

Outros modos:

```bash
npm run test:headed   # roda com o navegador visível
npm run test:ui       # modo interativo (UI mode) do Playwright
npm run test:debug    # depuração passo a passo (Playwright Inspector)
npm run test:list     # lista os testes sem executá-los
```

Para ver o relatório da última execução:

```bash
npm run report
```

### Sobrescrevendo a URL da aplicação

O `playwright.config.ts` lê a variável `BASE_URL`, com fallback para `http://localhost:3001`:

```bash
BASE_URL=http://localhost:3000 npm test
```

```powershell
$env:BASE_URL = "http://localhost:3000"
npm test
```

### Typecheck

```bash
npm run typecheck
```
