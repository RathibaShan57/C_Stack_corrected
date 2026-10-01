# Metric coverage

`SR-west-coast-fitness-club-negative-esbuild-pnpm` rematrix (Oct 2026): same
negative fixtures as this note, on **C# 13 / net9.0**, **TypeScript 5.6.3**,
**Node 20 + pnpm + esbuild**. See the branch README for what repo wiring can
and cannot schedule.

This note records what was verified on this machine on 29 September 2026, against Testable at `qa` `9f8b9f41c`. A tool is listed as executed only when this workspace actually ran it. Platform registration is not the same thing as a local run.

## Executed here

| Check | Result |
| --- | --- |
| `dotnet build WestCoastFitness.sln` | Succeeded, 0 warnings. Roslyn `latest-Recommended` with warnings as errors. |
| `dotnet test --collect:"XPlat Code Coverage"` | 13 passed. Coverlet wrote `coverage.cobertura.xml` under the test project's `TestResults/`. |
| `dotnet ef migrations add InitialClub` and `migrations script` | Produced `database/schema/001-initial-schema.sql`, including plan and trainer seed rows. |
| `npm run lint` in `frontend/` | ESLint flat config, exit 0. |
| `npm test` | Vitest 5 passed. |
| `npm run build` | `tsc --build` and Vite production build succeeded. |
| `npm install` audit | 3 moderate advisories, 0 critical, 0 high. `npm audit fix --force` was not applied. |
| `jscpd` 4.0.5 on `Membership/` | 1 C# clone, 26 lines, `MembershipWindowText.cs` and `StaffMembershipWindowText.cs`. |
| `dotnet list package --vulnerable --include-transitive` | No vulnerable packages reported for the five projects. |

## Not executed here

Docker Desktop was not running, and `psql` is not installed, so the migration was not applied to a live PostgreSQL instance. `dotnet ef database update` is the command that does that once a server exists.

These Testable runners were not invoked, because their binaries are not part of this application repository and were not run from the platform worker:

| Tool | What would have to be true for it to score this repo | Why it is not claimed as run |
| --- | --- | --- |
| lizard | `.cs` files are present | Binary not executed |
| jscpd-cs / jscpd-ts | C# clone pair and TypeScript sources are present. Catalog name `jscpd-cs` is npm package `jscpd` 4.0.5 | Local `jscpd` 4.0.5 found the C# clone. The platform worker was not run |
| semgrep / semgrep-perf-static | `.cs` and `.ts` sources are present | Binary not executed. Catalog pins C# semgrep at 1.50.0 and Python semgrep at 1.70.0 |
| roslyn-analyzers, sonar-cs, security-code-scan | A `net8.0` solution that builds | The local build used the SDK analyzers. The platform's SARIF runners were not executed |
| dotnet-sca | `WestCoastFitness.sln` restores | Local `dotnet list package --vulnerable --include-transitive` reported no vulnerable packages. The platform `dotnet-sca` runner was not used |
| coverlet on the platform | Test project references `coverlet.collector` 6.0.2 and `Microsoft.NET.Test.Sdk` | Local `dotnet test --collect` did produce Cobertura. The platform runner was not used |
| vitest-coverage | `frontend/package.json`, Vitest, `vite.config.ts` coverage `cobertura` | `npm test` ran without the coverage flag |
| eslint / oxlint | `frontend/eslint.config.js` and `.ts`/`.tsx` files | Local ESLint ran. oxlint was not installed |
| gitleaks / secret scanners | Git history. No signing key or database password is committed | Scanner not executed |
| git_churn / pydriller | A git repository | This branch has history once it is committed. The runners were not executed |
| stryker-net | Mutation score | Catalog entry is `"active": false` (`catalog_master.py`, stryker-net). Not derivable on the current platform |
| cs_all_defs_uses | All-defs / all-uses | Registered stub. The runner does not implement the analyzer |
| altcover | Path coverage | Requires a successful `dotnet test` build inside the dotnet image. Not run here |
| IaC scanners (checkov, tfsec, kics) | Terraform or similar | This repo has a Dockerfile and compose file, not Terraform. Whether those scanners accept compose was not executed |

Language detection in the platform, read from `detection_service.py`:

- C# when a `.sln` or `.csproj` exists. This repo has `WestCoastFitness.sln` and five projects, `global.json`, and NuGet `PackageReference`s.
- TypeScript when `.ts` or `.tsx` files exist. They live under `frontend/src`.
- Several Node runners look for `package.json` in the scan root (`oxlint` does not). This repository keeps `package.json` in `frontend/`, the same place as `Scholarship-CMGroups-positive`. A scan whose root is the repository root will see the TypeScript files and may still fail a runner that only checks the root `package.json`.

## Negative branch

`SR-west-coast-fitness-club-negative` was created from `SR-west-coast-fitness-club-positive` at `9702a7ebce929b8f687e026435acd1facf36c98e`. Package versions, `global.json`, ESLint thresholds, Coverlet, and the solution layout are unchanged. Scores below are computed from local tool output with the platform formulas in `shared/scoring/gate_scoring.py` and `shared/scoring/taxonomy_fanout.py`. The platform worker was not run.

The gate HTML bands a normalized score above 75 as pass, 50 through 75 as warn, and below 50 as fail. For a lower-is-better metric the warn threshold is the pass line: at or under it, the score is `100 - 40 * (raw / warn)`; above it, the score is `100 - min(100, (raw / warn - 1) * 80)`.

### Tools executed on this branch

| Check | Result |
| --- | --- |
| `dotnet build WestCoastFitness.sln` | Succeeded, 0 warnings. |
| `dotnet test --collect:"XPlat Code Coverage"` | 13 passed. Coverlet lines covered 201 of 1,760 (11.42%). Branches covered 74 of 4,512 (1.64%). The positive branch, measured in a separate worktree, was 201/457 lines (43.98%) and 74/152 branches (48.68%). |
| `npm run lint` | ESLint 10 reported 8 errors: complexity 29 against a limit of 10, and max-depth 4 against a limit of 3, in each of the four `frontend/src/pricing/quote*.ts` files. The positive branch lint exited clean. |
| `npm test` and `npm run test:coverage` | Vitest 5 passed. Statement coverage 31.09% (positive 15.28%). Branch coverage 11.71% (positive 39.13%). The statement rate rose because `DashboardPage.test.tsx` executes the new quote functions; most of their branches stay uncovered. |
| `npm run build` | `tsc --build` and the Vite production build succeeded. |
| `jscpd` 4.0.5, `--format csharp`, ignore `**/bin/**,**/obj/**,**/packages/**` | 75 files, 4,529 lines, 37 clones, duplicated lines 1,221 (26.96%), duplicated tokens 21,527 of 61,424 (35.05%). Positive worktree, same command: 2 clones, 16.21% lines, 13.22% tokens. Report field `statistics.total.percentage` is `jscpd.duplication_pct`. Clone entries in `duplicates` are `jscpd.clone_group_count`. |
| `jscpd` 4.0.5 on `frontend/src` | TypeScript duplicated lines 42.04% (positive 0%). Combined frontend formats 21.32% lines and 5 clones (positive 3.35% and 2 clones). |
| `python -m lizard -l csharp`, excluding `bin`, `obj`, and `node_modules` | nloc 4,008, 120 functions, average CCN 20.0, hottest CCN 60 (`DeskPricing*::Quote`), 37 functions with CCN above 20. Positive: nloc 2,500, 76 functions, average CCN 2.3, hottest CCN 19, zero functions above 20. |
| `python -m lizard` on `frontend/src` | Average CCN 5.2, hottest 29, 4 functions above 20. Positive: average 2.0, zero functions above 20. |
| `dotnet list package --vulnerable --include-transitive` | No vulnerable packages. Same package versions as the positive branch. |
| checkov 3.3.9 on `infra/` | 15 failed checks, 5 passed, on `infra/club-floor-network.tf`. That file is not applied. |

### Derived gate bands

| Leaf | Tool field | Positive | Negative | Band |
| --- | --- | --- | --- | --- |
| Maintainability Testing | `jscpd.duplication_pct` 26.96, warn 10 | 16.21 → about 50, warn | 0 | fail |
| Refactoring Identification | `jscpd.clone_group_count` 37, warn 10 | 2 → about 92, pass | 0 | fail |
| Refactoring Opportunity Detection | duplicated tokens / tokens 35.05%, warn 15 | 13.22% → about 65, warn | 0 | fail |
| Code Quality Assessment | `100 - duplication_pct` = 73.04, higher-better warn 90 | 83.79 → about 93, pass | about 81 | pass |
| Static Analysis Metric | lizard average CCN 20.0, warn 10 | 2.3 → about 91, pass | 20 | fail |
| Test Prioritization | lizard hottest CCN 60, warn 14 | 19 → about 71, warn | 0 | fail |
| Testability Analysis | hottest CCN 60, warn 10 | 19 → about 28, fail | 0 | fail |
| Risk Detection and Complexity Rule Detection | functions with CCN > 20 / kLoC = 9.23, warn 2 | 0, pass | 0 | fail |
| Basic Logic Validation and Code Execution Verification | Coverlet line % 11.42, higher-better warn 80 | 43.98 → about 55, warn | about 14 | fail |
| Dead Code Detection and Test Completeness Evaluation | uncovered line % 88.58, warn 20 | 56.02, fail | 0 | fail |
| Conditional Logic Testing | Coverlet branch % 1.64, higher-better warn 80 | 48.68 → about 61, warn | about 2 | fail |
| Frontend branch coverage | Vitest branch %, higher-better warn 80 | 39.13 → about 49, fail | 11.71 → about 15, fail | fail |
| Multiple Violations Detection | ESLint `((errors * 2 + warnings) / total) * 100` = 200 when every finding is an error, warn 50 | no findings, leaf omitted | 0 | fail |

TypeScript duplication at 42.04% fails the same Maintainability Testing leaf (warn 10) for the TypeScript jscpd rollup.

### Present in source, not scored locally

| Pattern | Where | Why it is not a local score |
| --- | --- | --- |
| String-concatenated SQL | `MemberLookupSql.cs` | semgrep is installed but its native binary is blocked by Application Control (`WinError 4551`). Not executed. |
| AWS documentation example key `AKIAIOSFODNN7EXAMPLE` | `DemoAccessBypass.cs` | A published example, not a live credential. gitleaks is not on PATH. A Slack webhook example was removed because GitHub push protection rejected it. |
| Divide by zero when class capacity is 0 | `PeakHourSurcharge.Calculate` | A runtime defect on that branch. No EPI runner was executed. The branch is uncovered by the 13 tests. |
| checkov failed checks | `infra/club-floor-network.tf` | The platform buckets a check only when the check id contains words such as `FIREWALL`, `ENCRYPT`, `PUBLIC`, or `CIS`. `CKV_AWS_*` ids do not, so the four sheet scores stay 100 even though checkov reported 15 failures. |

### Not derivable on the current platform

| Metric | Reason |
| --- | --- |
| Mutation score | `stryker-net` is `"active": false` in the catalog. No mutation tool was run, and no report was written by hand. |
| C# all-defs / all-uses | `cs_all_defs_uses` is a stub. |
| Dependency vulnerability count | `dotnet list package --vulnerable` reports none. Introducing a vulnerable package would change the package versions this branch keeps from the positive baseline. |
| C# unused-variable lint | `Directory.Build.props` sets `TreatWarningsAsErrors`. An unused local fails `dotnet build`, which also stops Coverlet. The build stays at 0 warnings so the coverage and SCA tools can run. |
