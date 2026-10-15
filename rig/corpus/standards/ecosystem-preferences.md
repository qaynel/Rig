# Ecosystem Preferences — RIG-113 Input

Ranked lint/format tool preferences, EOL signals, coverage gaps, and setup contracts per ecosystem. These drive Rig's tool-selection and replacement-proposal logic.

---

## Ecosystem: Node.js / JavaScript / TypeScript

**Ranked preference list:**
1. **Biome** — stable (1.x+), both linting and formatting. Single Rust binary, no plugin resolution overhead. Preferred when repo has no existing ESLint plugin ecosystem dependency (e.g., no `eslint-plugin-react-hooks`, no custom rule sets).
2. **ESLint + Prettier** — stable (ESLint 9.x flat config, Prettier 3.x), linting (ESLint) + formatting (Prettier) as separate concerns. Preferred when repo already has ESLint config, custom rules, or framework-specific plugins (Next.js, React, Vue) that Biome doesn't yet cover.
3. **dprint** — stable, formatting only. Fallback formatter when Prettier is present but painfully slow on a large monorepo and the team has signaled a performance complaint.

**EOL/Unmaintained signals:**
- `deprecated: true` field in the tool's own `package.json` on npm registry
- No published release in 24+ months AND open critical issues with no maintainer response in 6+ months
- GitHub repo archived, or README/issues explicitly state "no longer maintained" or "superseded by X"
- TSLint pattern specifically: any presence of `tslint.json` is itself an EOL signal (TSLint has been deprecated since 2019 in favor of `typescript-eslint`)

**Coverage gaps:**
- ESLint alone cannot enforce TypeScript-specific rules (type-aware linting) without `@typescript-eslint/parser` + `@typescript-eslint/eslint-plugin`
- Biome does not yet support all ESLint plugin-equivalent rules for framework-specific patterns (e.g., some `eslint-plugin-react-hooks` exhaustive-deps checks) — flag as partial coverage, not silent gap
- Neither ESLint nor Biome enforces import-sorting by default; requires `eslint-plugin-simple-import-sort` or Biome's `organizeImports` explicitly enabled
- Prettier does not lint (no error-catching), only reformats — must be paired with a linter for full coverage

**Setup contract:**
- Config files: `biome.json` (Biome path) OR `eslint.config.js` + `.prettierrc.json` (ESLint/Prettier path)
- Ignore files: `.eslintignore` (ESLint <9; flat config uses `ignores` in `eslint.config.js` instead), `.prettierignore`
- Scope: `.js`, `.jsx`, `.ts`, `.tsx`, `.mjs`, `.cjs` files; excludes `node_modules/`, build output dirs (`dist/`, `build/`), and any dir matching an existing `.gitignore` pattern

---

## Ecosystem: Python

**Ranked preference list:**
1. **Ruff** — stable (0.x, fast-moving but production-widely-adopted), both linting and formatting (Ruff's formatter is a Black-compatible reimplementation). Preferred default: single fast binary replacing Flake8 + isort + Black + pyupgrade in most cases.
2. **Black + isort + Flake8** — stable, formatting (Black) + import sorting (isort) + linting (Flake8) as three separate tools. Preferred when repo has Flake8 plugin dependencies Ruff doesn't yet replicate (rare, narrowing over time).
3. **mypy** — stable, type-checking only (not lint/format, but commonly bundled in the same pre-commit stage). Include as a distinct "type-check" component, not folded into "lint."

**EOL/Unmaintained signals:**
- PyPI package page shows no release in 24+ months combined with open security advisories unaddressed
- GitHub repo archived or explicitly redirects to a successor project (e.g., legacy standalone `pyupgrade`/`autoflake` usage where Ruff now covers the same rules)
- `setup.cfg`-only Flake8 config with no `pyproject.toml` migration and last commit >2 years old is a soft signal (not definitive, but worth a coverage-gap check)

**Coverage gaps:**
- Ruff's formatter does not yet cover 100% of Black's edge-case formatting decisions (rare docstring/comment edge cases) — flag partial-parity rather than claim full Black replacement
- Ruff does not do type-checking; mypy (or pyright) is a required separate component for full coverage
- Black does not enforce import ordering; requires isort or Ruff's `I` rule set
- Neither Black nor Ruff enforces docstring presence/format by default; requires explicit rule enablement (`D` rules in Ruff, or `pydocstyle`)

**Setup contract:**
- Config files: `pyproject.toml` (single file, `[tool.ruff]` and/or `[tool.black]`, `[tool.isort]`, `[tool.mypy]` sections) — prefer consolidating into `pyproject.toml` over separate `setup.cfg`/`.flake8` files
- Ignore files: none separate — Ruff/Black/isort all read `exclude`/`extend-exclude` from `pyproject.toml`
- Scope: `.py` and `.pyi` files across the repo, excluding `tests/` only if the user explicitly scopes it out; default is full coverage including tests

---

## Ecosystem: Bash / Shell

**Ranked preference list:**
1. **ShellCheck** — stable, mature, linting only. No credible alternative; treat as the default with no real ranking competition.
2. **shfmt** — stable, formatting only. Pairs with ShellCheck for full lint+format coverage.

**EOL/Unmaintained signals:**
- N/A in practice — both tools are stable long-running projects with regular releases; treat absence of *either* tool as a coverage gap, not an EOL scenario

**Coverage gaps:**
- ShellCheck only analyzes POSIX/Bash-family scripts; does not cover Fish or csh/tcsh scripts — flag those as unsupported ecosystem, not a ShellCheck failure
- Neither tool enforces a specific shebang policy or executable-bit convention; that's a repo-policy concern outside lint/format scope

**Setup contract:**
- Config files: `.shellcheckrc` (ShellCheck), no dedicated shfmt config file — shfmt options passed via CLI flags recorded in the Rig-managed task definition, not a repo file
- Ignore files: none dedicated — ShellCheck exclusions are inline (`# shellcheck disable=`) or path-scoped in the Rig task definition
- Scope: files with `.sh` extension or a `#!/bin/bash` / `#!/usr/bin/env bash` / `#!/bin/sh` shebang

---

## Ecosystem: Go

**Ranked preference list:**
1. **golangci-lint** — stable, linting (aggregates `go vet`, `staticcheck`, `errcheck`, and others under one runner). Preferred over running individual linters separately.
2. **gofmt / goimports** — stable, formatting (gofmt is part of the standard toolchain; goimports additionally manages import grouping). Effectively mandatory — no real "preference" since gofmt is the ecosystem-canonical formatter.

**EOL/Unmaintained signals:**
- An individual linter *inside* golangci-lint's aggregated set going unmaintained is absorbed/handled by golangci-lint's own maintenance — only flag golangci-lint itself as EOL, not its sub-linters
- No release in 18+ months against actively updated Go toolchain versions (Go ecosystem moves fast; use 18 months not 24 as the threshold here)

**Coverage gaps:**
- `go vet` alone (without golangci-lint) misses a large class of style and complexity issues; flag bare `go vet`-only setups as partial coverage
- gofmt does not reorder/group imports; goimports is required for that, and is a distinct binary that must be separately confirmed present

**Setup contract:**
- Config files: `.golangci.yml`
- Ignore files: none dedicated — exclusions specified via `.golangci.yml`'s `issues.exclude-rules` / `run.skip-dirs`
- Scope: `.go` files, excluding vendor directories (`vendor/`) and generated files matching `// Code generated .* DO NOT EDIT` header convention

---

## Ecosystem: Ruby

**Ranked preference list:**
1. **RuboCop** — stable, both linting and formatting (RuboCop includes `--autocorrect` covering most formatting concerns; no separate formatter is standard in this ecosystem).
2. **Standard (standardrb)** — stable, both linting and formatting. Preferred only when the team has explicitly opted into a zero-config/opinionated style over RuboCop's configurability — treat as a deliberate choice signal, not a default upgrade path.

**EOL/Unmaintained signals:**
- Gemfile.lock shows a RuboCop version 3+ major versions behind current AND no `.rubocop.yml` updates in 24+ months
- RubyGems page shows the gem marked as yanked or the repo archived

**Coverage gaps:**
- RuboCop's default cop set does not enforce Rails-specific conventions without `rubocop-rails` extension gem — relevant given Rails-heavy Ruby codebases; flag as gap if `Gemfile` shows `rails` but `.rubocop.yml` has no `rubocop-rails` require
- Standard intentionally does not support per-project rule customization — if a repo needs custom rule exceptions, Standard itself is the coverage gap, not a missing plugin

**Setup contract:**
- Config files: `.rubocop.yml` (RuboCop path); Standard requires no config file by design — absence of `.rubocop.yml` combined with a `standard` Gemfile entry is the expected, correct state, not a missing-config error
- Ignore files: none separate — exclusions live inside `.rubocop.yml`'s `AllCops.Exclude`
- Scope: `.rb`, `.rake`, `Gemfile`, `Rakefile`, and files with a Ruby shebang; excludes `db/schema.rb` by convention (auto-generated) and `vendor/bundle/`

---

## Notes on Coverage Claims

- "Full coverage" for a repo can only be claimed when every detected file type/extension in-scope maps to a ranked tool above **and** that tool is confirmed installed/configured — not merely available in the preference list
- A ranked list entry being present does not imply the tool is installed; installation/config-file presence is checked separately per the Setup Contract section
- Where a repo mixes ecosystems (e.g., a Rails app with a React frontend), each ecosystem is evaluated independently — partial coverage in one ecosystem does not suppress full-coverage claims in another
