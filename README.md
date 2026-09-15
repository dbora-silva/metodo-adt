# Lunar Pass — Test Automation

End-to-end test automation for **Lunar Pass**, a fictional lunar-tourism booking app used as the practice target for the **[Método ADT](https://metodoadt.com.br/)** test automation course.

## About this project

This repository started as a course exercise: Método ADT ships the Lunar Pass application and a guided curriculum, and students build the Playwright suite on top of it. Everything under [`lunarpass-test/`](lunarpass-test) began from that curriculum.

Beyond the guided exercises, this repo also contains work that goes past the course material:

- [`docs/lunarpass-analise-de-aderencia.md`](docs/lunarpass-analise-de-aderencia.md) — an independent **testability/adherence analysis** of the Lunar Pass UI (in Portuguese), reviewing each screen for stable, semantic locators and documenting where the app's markup makes automation harder than it needs to be.
- Structural improvements to the suite itself (package-manager standardization, `baseURL`/env-driven config, Page Object reorganization, a test-data factory, and the Docker/CI review below) that are not part of the base course deliverable.

This is a learning project. It is shared to show how I approach test structure, locator strategy, and repository hygiene — not as a production QA pipeline for a real product.

## Tech stack

- [Playwright](https://playwright.dev/) (`@playwright/test`) — test runner and browser automation
- [TypeScript](https://www.typescriptlang.org/)
- [Faker](https://fakerjs.dev/) (`@faker-js/faker`) — dynamic test data
- Node.js + npm
- Docker (unrelated static-file container — see [Docker](#docker))

## Automated scenarios

9 tests across 3 spec files, run against the Chromium project:

**Home** (`home.spec.ts`)
- Should display the application title

**Login** (`login.spec.ts`)
- Should authenticate into Mission Control
- Should fail authentication with an invalid password
- Should fail authentication with an unregistered email
- Should fail when the password is missing
- Should fail when the email is missing

**Mission registration** (`register.spec.ts`)
- Should register a new mission
- Should not register with an incorrectly formatted mission code
- Should not register with a duplicate mission code

## Project structure

```
metodo-adt/
├── docker/                 # Static-file nginx container (unrelated to the test suite)
├── docs/
│   └── lunarpass-analise-de-aderencia.md   # Testability analysis (PT-BR)
├── lunar-pass/              # App under test — course material, gitignored (see Limitations)
└── lunarpass-test/           # Playwright suite
    ├── pages/
    │   ├── login.page.ts
    │   ├── dash.page.ts
    │   ├── register.page.ts
    │   └── components/       # Reusable UI pieces shared across pages
    │       ├── navbar.ts
    │       └── toast.ts
    ├── support/
    │   ├── mission.ts         # Mission interface + createMission() factory
    │   └── test-data.ts       # Local demo-user credentials
    ├── tests/
    ├── playwright.config.ts
    └── package.json
```

## Locator strategy

Locators prioritize what the browser's accessibility tree actually exposes, in this order: `getByRole`, `getByLabel`, `getByPlaceholder`, `getByText`, and — only where the app itself already ships one — `getByTestId`.

No `data-testid` is invented for this suite. Where the app doesn't expose a stable attribute, the analysis in [`docs/lunarpass-analise-de-aderencia.md`](docs/lunarpass-analise-de-aderencia.md) documents the gap instead of working around it with a brittle selector.

One concrete example: the toast component (via [Sonner](https://sonner.emilkowal.ski/)) marks a toast's title with `role="status"`, but that role is also used elsewhere on the page for loading indicators, and the toast's description text isn't covered by that role at all. `pages/components/toast.ts` instead scopes into the notifications `role="region"` and reads the full `listitem`, which is both accurate and resistant to unrelated `status` elements on the page.

## Prerequisites

- Node.js 20+
- npm 10+
- The Lunar Pass application running locally (see below and [Limitations](#limitations))

## Installation

```bash
cd lunarpass-test
npm install
```

For a byte-for-byte reproducible install (e.g. in CI), use:

```bash
npm ci
```

## Running the application under test

The Lunar Pass app lives in `lunar-pass/` and is **not** part of this repository (see [Limitations](#limitations)). It is a separate Node/Yarn project; the test suite doesn't drive its package manager.

```bash
cd lunar-pass
PORT=3001 yarn start
```

```powershell
# PowerShell
$env:PORT = "3001"
yarn start
```

The suite's default `baseURL` (`http://localhost:3001`) assumes this port.

## Running the tests

From `lunarpass-test/`, with the app running:

```bash
npm test
```

Other modes:

```bash
npm run test:headed   # watch it run in a real browser window
npm run test:ui       # Playwright's interactive UI mode
npm run test:debug    # step through with the Playwright Inspector
npm run test:list     # list all tests without running them
```

Open the HTML report from the last run:

```bash
npm run report
```

### Overriding the app URL

`playwright.config.ts` reads `BASE_URL`, falling back to `http://localhost:3001`:

```bash
BASE_URL=http://localhost:3000 npm test
```

```powershell
$env:BASE_URL = "http://localhost:3000"
npm test
```

### Type checking

```bash
npm run typecheck
```

## Trace, retries and parallelism

- **Trace**: `trace: 'on-first-retry'` — a Playwright trace is only captured when a test is retried, keeping local runs lightweight while still giving a full trace to inspect (via `npm run report`) when something is flaky.
- **Retries**: `0` locally, `2` on CI (`process.env.CI`).
- **Parallelism**: `fullyParallel: true`, with Playwright's default worker count locally and `workers: 1` on CI.

## Docker

`docker/` builds a plain nginx container that serves this repository's static files — it is **unrelated to the Playwright suite** and doesn't start the app under test. While reviewing it, the `docker-compose.yml` build `context` was found pointing at `docker/` itself instead of the repository root, which meant the Dockerfile (and its `COPY` instructions) couldn't actually be found at build time; that's now fixed, along with removing an SSH private-key mount that the container doesn't need to run. Build and run it from the repository root:

```bash
docker compose -f docker/docker-compose.yml up --build
```

## Limitations

- **The app under test isn't in this repository.** `lunar-pass/` is Método ADT course material and is intentionally listed in `.gitignore`. That also means there's no GitHub Actions workflow here yet — CI would need to start the app, and it can't, using only what's checked into this repo. Enabling CI would require either committing a runnable build of the app (course-licensing permitting), publishing it as a container image CI can pull, or provisioning it from a private source via a CI secret.
- Only the Chromium project is configured; Firefox/WebKit are commented out in `playwright.config.ts`.
- Tests rely on one seeded demo user and a couple of fixed mission codes (e.g. the duplicate-code scenario). There's no automated setup/teardown for that data yet — see the git history for the manual SQL used to provision and clean up the `LP-DUP01` fixture.

## Next steps

- Stand up CI once the app under test can be started headlessly in a pipeline.
- Automate fixture setup/teardown for scenarios that depend on specific database rows, instead of manual SQL.
- Extend coverage to the booking/reservation flow.
- Add Firefox/WebKit runs once Chromium coverage is stable.

## Further reading

- [`docs/lunarpass-analise-de-aderencia.md`](docs/lunarpass-analise-de-aderencia.md) — testability analysis of the Lunar Pass UI.
- [`lunarpass-test/README.md`](lunarpass-test/README.md) — the same setup instructions, scoped to the test suite itself.
