# West Coast Fitness Club — negative rematrix

Arizona fitness-club application, **same negative metric fixtures** as
[`SR-west-coast-fitness-club-negative`](https://github.com/RathibaShan57/C_Stack_corrected/tree/SR-west-coast-fitness-club-negative),
on a **different language / build / package cell**.

Branch: **`SR-west-coast-fitness-club-negative-esbuild-pnpm`**.

## Stack (this branch only)

| Layer | This branch | West Coast negative (Vite/npm) | Scholarship-CMgroups-Positive1 |
| --- | --- | --- | --- |
| C# / .NET | **C# 13 / net9.0 / ASP.NET Core 9.0.0** | C# 12 / net8.0 / 8.0.31 | C# 12 / net8.0 / 8.0.31 |
| TypeScript | **5.6.3** | 6.0.3 | 5.8.3 |
| JavaScript / Node | **Node >=20.18.0 &lt;21** | Node 22 / npm 10 | Node >=20.19 / Yarn 1 |
| Frontend build | **esbuild 0.24.2** | Vite 6 | Webpack 5 |
| Frontend package | **pnpm 9.15.4** | npm 10.9.2 | Yarn 1.22.22 |
| Backend build / packages | **dotnet + NuGet** (net9) | dotnet + NuGet (net8) | MSBuild + NuGet (net8) |
| UI | React **18.3.1** | React 19.3 | React 19.3 |
| Database | PostgreSQL 16 | PostgreSQL 16 | SQL Server |

`global.json` pins SDK **9.0.100** (`rollForward: latestFeature`).

## Layout

```text
frontend/           React 18 + esbuild + pnpm + TypeScript 5.6
                    Vitest 2.1 + Jest 29 + Mocha/nyc 17.1
backend/           ASP.NET Core 9 Clean Architecture
backend/tests/     xUnit + coverlet 6.0.0 + altcover 8.8.173
database/           PostgreSQL schema
infra/              Terraform (tfsec / checkov / kics)
scripts/            Python probe (pylint / radon / bandit / pip-audit)
.config/            altcover.global 8.8.173, dotnet-ef 9.0.0
```

## Tool wiring (what repo can and cannot do)

Repo packages **do not schedule** Testable tasks. They only make a runner
applicable **after** the planner creates the folder.

| Tool | Wired here | Will a repo pin start it? |
| --- | --- | --- |
| coverlet 6.0.0 | `coverlet.collector` + `coverlet.msbuild` on `*.Tests` | No — planner must schedule `coverlet` |
| altcover 8.8.173 | package + `altcover.global` | No — image global tool; must be planned |
| roslyn-analyzers 9.0.0 | `Directory.Analyzers.props` imported from root props | No — must be planned |
| nyc + mocha / nyc 17.1.0 | `nyc`, `mocha`, `test/**/*.spec.js`, Jest config | No — must plan `nyc-mocha` |
| StrykerJS / Stryker TS | `@stryker-mutator/core` 8.2.6 + jest/mocha/vitest runners | No — `stryker-net` is catalog `active: false`; JS/TS need planning |
| vitest + coverage-v8 2.1.8 | `vitest.config.ts` (no Vite) | No — must plan `vitest-coverage` |
| ts-morph | `.ts`/`.tsx` sources | No — worker script `ts-all-defs-uses` |
| diff-cover | cobertura reporters on Vitest/Jest/nyc | Already runs as `coverage_delta` (needs baseline) |
| Grype / fast-check / OpenTelemetry | packages present | **Never** — catalog `active: false` (Lane-C scaffolds) |
| Semgrep SAST | `.cs` sources | No — python-family readiness, not an npm pin |

Negative metric leftovers (duplicated pricing desks, high cyclomatic quote files,
IaC terraform, low coverage tests) are **unchanged** from the Vite negative branch.

## Local run

```powershell
# Backend (.NET 9)
dotnet restore
dotnet build
dotnet test --collect:"XPlat Code Coverage"

# Frontend (pnpm + esbuild)
cd frontend
pnpm install
pnpm test
pnpm run test:jest
pnpm run test:mocha
pnpm run build
```

Do not use Vite, npm, or Yarn on this branch.
