# Lunar Pass — Testes E2E (Playwright)

Suíte de testes end-to-end para a aplicação Lunar Pass, usando [Playwright](https://playwright.dev/).

## Pré-requisitos

- Node.js 20+
- A aplicação [Lunar Pass](../lunar-pass) rodando localmente (veja abaixo)

## Instalação

```bash
npm install
```

## Rodando a aplicação sob teste

Os testes esperam a aplicação Lunar Pass rodando localmente. Em outro terminal, na pasta `lunar-pass/`:

```bash
cd ../lunar-pass
yarn start
```

Por padrão, a aplicação sobe em `http://localhost:3000`.

### Rodando em outra porta (ex.: 3001)

O servidor lê a variável de ambiente `PORT`. Para subir na porta `3001`:

```bash
# Git Bash / Linux / macOS
PORT=3001 yarn start
```

```powershell
# PowerShell
$env:PORT = "3001"
yarn start
```

Depois, ajuste a URL usada nos testes (`page.goto(...)`) para apontar para `http://localhost:3001`.

## Rodando os testes

```bash
npx playwright test
```

Para ver o navegador durante a execução:

```bash
npx playwright test --headed
```

Para depurar um teste passo a passo (abre o Playwright Inspector):

```bash
npx playwright test --debug
```

Para ver o relatório da última execução:

```bash
npx playwright show-report
```
