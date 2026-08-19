# Host & CI Coverage — Subordinate Evidence and Work Plan

> **SUBORDINATE DRAFT — Gate 2 reopened 2026-07-25; status audited
> 2026-07-26.** This file preserves vendor research and inventories coverage
> work. It is not a Gate-2 specification and cannot independently freeze a
> mechanism, declare an axis verified, or supersede `technical-spec.md`. The
> versioned, independently reviewed, re-frozen technical specification is the
> sole implementation authority.

This plan records candidate paths for widening catalogue coverage from the
original 4-host / 1-CI-provider state to the full `SUPPORTED_HOSTS` union. Its
two research reports are inputs, not release-verification bundles:

- [`../sources/reference/host-ci-capability-verification.raw.md`](../sources/reference/host-ci-capability-verification.raw.md)
  (2026-07-24) — four capability axes × 19 hosts + 5 CI providers.
- [`../sources/reference/host-config-surfaces-verification.raw.md`](../sources/reference/host-config-surfaces-verification.raw.md)
  (2026-07-25) — repo-scoped vs user-global surfaces; closes the PARTIAL/CNV
  gaps and reverses two earlier assumptions.

Business intent is frozen in `business-spec.md` / `acceptance.md`. Exact
contracts must trace through the sole `technical-spec.md`; this plan does not
change either authority.

## 1. Current release answer

**The executable host/CI roster is not release-verified.** The research
identifies candidate repo-scoped paths for 12 hosts and explicit candidate
degradations for six, but it does not provide the exact hook contracts,
per-axis fixtures/results, or passing first-wire evidence required by
AT-HOST-1…4. A path or host-level citation cannot promote an executable axis.

- **12 hosts have researched all-axis repo paths:** claude, codex,
  vscode-codex, copilot, copilot-cli, kiro, opencode, openclaw, cursor,
  antigravity, gemini, devin (CLI). Each executable axis remains pending its own
  complete contract and evidence bundle.
- **6 hosts have researched partial/advisory dispositions:** pi, windsurf
  (Devin Desktop), cline, hermes, swival, codewhale. A degradation becomes
  final only when authoritative evidence proves the vendor limitation.
- **Generic git** is the nineteenth roster entry. Its deterministic git/CI
  floors remain useful, but unverified live/web/MCP behavior is reported rather
  than promoted.

Release-verification audit:

| Claim | Current accepted result |
|---|---|
| Exact per-host live-hook contracts | Pending for every executable candidate |
| Complete evidence bundle per host/CI axis | Pending for every executable candidate |
| Successful first wire per executable host/CI axis | Pending for every executable candidate |
| Six safe CI integration/bootstrap contracts | Pending |

The table records absence of accepted release evidence, not absence of useful
research or implementation scaffolding.

Two earlier assumptions are **reversed** by the new evidence:
- **pi DOES auto-discover skills** at `.agents/skills/` (Agent Skills standard) —
  do not mark pi "skills absent".
- **cursor DOES document an auto-discovered skills dir** at `.cursor/skills/` —
  do not mark cursor "skills absent".

## 2. Current-state trace

| Seam | File | Today | Governs |
|---|---|---|---|
| Capability registry | `rig/lib/host-capabilities.js` | All 19 identities have explicit entries, but executable axes use the obsolete citation-only promotion rule | instruction / native_skill / live_hook per host; currently emits only a marker for entries labelled `verified` |
| MCP path map | `rig/lib/renderers.js` `HOST_FILES` | 13 hosts have MCP targets; `pi` entry (`.omp/mcp.json`) is speculative | where legacy Basic writes MCP; the current governing design must unify this with catalogue dispositions |
| CI adapter registry | `rig/lib/ci-adapters.js` `PROVIDERS` | GitHub Actions is labelled `verified` under the obsolete documentation-only rule; 5 others are `degraded` with no adapter | additive CI job + `reports/rig/` upload |
| Identity list | `rig/lib/config.js` `SUPPORTED_HOSTS` | All 19 accepted | validation only — no change |

Existing registry-shape tests are useful regressions, but they do not satisfy
Gate 1. Current release invariants require unverified hosts to emit zero
speculative configuration, every enabled deterministic floor to reach its
applicable surface, and any `verified` executable axis to carry its exact
contract plus cumulative documentation, fixture/result, and first-wire
evidence.

## 3. Candidate approach for Gate 2

Reuse the three existing registries and the researched candidate paths. The
work is more than a data population: each executable axis needs an exact
adapter contract, policy mapping, preservation/idempotence behavior, per-axis
evidence, and first wire. `technical-spec.md` must define those mechanisms
before implementation resumes. Prefer a repo-scoped committable path; where
authoritative evidence proves only a user-global or unsupported surface, emit
an advisory/unsupported disposition and never a fake per-repo file.

### 3.1 Per-host disposition candidates

Research legend only: ✅ candidate repo-scoped path · 🟡 candidate
user-global/limited advisory · ⛔ candidate unsupported disposition · ❔
unresolved conflict. **No symbol in this table is a release-verification
claim.**

| Host | Instruction | Skills | Live hook (blocking) | MCP |
|---|---|---|---|---|
| claude | ✅ `CLAUDE.md` | ✅ `.claude/skills/` | ✅ `.claude/settings.json` | ✅ `.mcp.json` |
| codex | ✅ `AGENTS.md` | ✅ skills/plugins | ✅ `.codex/` hooks | ✅ project `.codex/config.toml` |
| vscode-codex | ✅ `AGENTS.md` | ✅ | ✅ shared Codex hooks | ✅ `.codex/config.toml` |
| copilot | ✅ `.github/copilot-instructions.md` | ✅ | ✅ `.github/hooks/*.json` | ✅ `.vscode/mcp.json` (key `servers`) |
| copilot-cli | ✅ `.github/copilot-instructions.md` | ✅ | ✅ `.github/hooks/*.json` | ✅ repo `.github/mcp.json` (key `mcpServers`) |
| kiro | ✅ `.kiro/steering/*.md` | ✅ Powers | ✅ `.kiro/hooks/*.json` | ✅ `.kiro/settings/mcp.json` |
| opencode | ✅ `AGENTS.md`+`instructions` | ✅ | ✅ plugin-mediated | ✅ `opencode.json` (key `mcp`, `type`) |
| openclaw | ✅ `AGENTS.md` | ✅ native+bundles | ✅ `HOOK.md`+handler | ✅ `openclaw.json` |
| cursor | ✅ `.cursor/rules/*.mdc` | ✅ `.cursor/skills/` **(rev.)** | ✅ `.cursor/hooks.json` | ✅ `.cursor/mcp.json` |
| antigravity | ✅ `.agents/rules/*.md` | ✅ `.agents/skills/` | ✅ `.agents/hooks.json` (allow/deny/ask) | ✅ `.agents/mcp_config.json` † |
| gemini | ✅ `GEMINI.md`/`.gemini/settings.json` | ✅ Agent Skills | ✅ `.gemini/settings.json` hooks (deny/exit-2) | ✅ `.gemini/settings.json` |
| devin (CLI) | ✅ `AGENTS.md`+`.devin/config.json` | ✅ `.devin/skills/` | ✅ `.devin/hooks.v1.json` | ✅ `.devin/config.json` `mcpServers` |
| pi | ✅ `AGENTS.md`/`.pi/settings.json` | ✅ `.agents/skills/` **(rev.)** | ⛔ extensions only (no hook file) | ⛔ unsupported by design |
| windsurf (Devin Desktop) | ✅ `.devin/rules/` (`.windsurf/rules/` legacy) | ✅ `.windsurf/skills/` | ✅ `.windsurf/hooks.json` (pre-hooks exit-2) | 🟡 user-global `~/.codeium/windsurf/mcp_config.json` |
| cline | ✅ `.clinerules` | ✅ `.cline/skills/` | ✅ `.cline/hooks/` | 🟡 user-global `cline_mcp_settings.json` |
| hermes | ✅ `AGENTS.md` | 🟡 bundled/catalog (repo-scope unclear) | 🟡 user-global `~/.hermes/hooks/…HOOK.yaml` | 🟡 user-global `~/.hermes/config.yaml` |
| swival | ✅ `AGENTS.md` | ✅ `.swival/skills/` | 🟡 startup/exit + command middleware (no edit-time gate) | ✅ `.swival/mcp.json` / `swival.toml` |
| codewhale | ✅ `AGENTS.md`+`.codewhale/constitution.json` | ❔ `~/.deepseek/skills/` vs `./.codewhale/skills/` | ✅ `.codewhale/hooks.toml` (allow/deny/ask) | ❔ `~/.deepseek/mcp.json` (global) vs `./.codewhale/mcp.json` |
| generic git | 🟡 advisory instruction | ⛔ absent | ❔ unverified | ⛔ unsupported |

† Antigravity **CLI** variant silently ignores project-local MCP (issue #60);
`.agents/mcp_config.json` is reliable for IDE/SDK, fall back to
`~/.gemini/config/mcp_config.json` for the CLI. The `trigger: always_on`
frontmatter key is community-corroborated only — append the pointer to any file
under `.agents/rules/` (the officially-grounded target) rather than relying on
that key.

### 3.2 MCP disposition across every install path

The prior plan deliberately left Basic `renderers.js` / `HOST_FILES` untouched
and deferred catalogue MCP materialization. That is incompatible with
AT-HOST-5. The governing design must trace both legacy and catalogue paths:
when authoritative evidence says a host such as `pi` does not support MCP, no
path may emit MCP configuration for it. A previously emitted user-owned file is
preserved and receives migration guidance rather than silent deletion.

The current registry research records a candidate `mcp` disposition plus
`surfaces.mcp` path:

- **`mcp: 'repo'`** (committable, graftable when the compatibility slice lands):
  claude, codex, vscode-codex, cursor, copilot, copilot-cli, kiro, opencode,
  openclaw, antigravity (`.agents/mcp_config.json` †), gemini, devin
  (`.devin/config.json`, Devin CLI), swival (`.swival/mcp.json`).
- **`mcp: 'user_global'`** (advisory note only; vendor ships no per-repo file):
  windsurf/Devin Desktop, cline, hermes, codewhale.
- **`mcp: 'unsupported'`** (vendor refuses MCP): pi; generic.

Per-host MCP key overrides are researched in `surfaces.mcp_key` (copilot
`servers`; opencode `mcp`+`type`; codex/vscode-codex TOML `[mcp_servers]`; else
`mcpServers`). Gate 2 must specify the exact safe preflight/merge contract for
every supported shape and ensure network-capable MCP calls obey the same active
policy as shell and built-in web access. MCP is never an enforcement bypass.

### 3.3 CI providers (`PROVIDERS`)

Treat all six providers as candidates until their full contract and first real
run pass: `github-actions`, `gitlab_ci` (`.gitlab-ci.yml`,
`artifacts:paths`), circleci (`.circleci/config.yml`, `store_artifacts`),
jenkins (`Jenkinsfile`, `archiveArtifacts` in `post{always}`), buildkite
(`.buildkite/pipeline.yml`, `artifact_paths`), and azure_pipelines
(`azure-pipelines.yml`, `publish` / `PublishPipelineArtifact@1`).

For an existing verified configuration, the adapter must parse its native
shape, add the enabled Rig repo gate and actionable report upload, preserve
every unrelated job/value, and be idempotent. Unknown, malformed, or
unverified configuration fails visibly and remains byte-for-byte unchanged.
When no CI exists, Rig emits nothing until the user selects a verified provider
and explicitly approves creation of a minimal native pipeline. The bootstrap
uses least permissions, no repository secrets, and remains pending until its
first real run succeeds.

## 4. Contract, evidence, safety, and failure boundaries

- **The governing design owns the exact contract.** For each live-hook axis it
  must name the emitted path/filename, vendor input/event schema and matcher
  fields, deny response and exit behavior, deliberate-proceed protocol, owned
  merge boundary, user-config preservation, and first/repeated-apply behavior.
  A registry path or generic marker is not an adapter contract.
- **Evidence is cumulative and per axis.** Each verified host/CI axis carries
  authoritative vendor documentation for the exact claimed behavior,
  vendor/version and verification date, fixtures and results, and successful
  first-wire evidence for executable behavior. A host-level citation cannot
  verify several axes, and documentation cannot substitute for first wire.
- **No speculative config.** Unverified/advisory axes emit nothing beyond the
  enabled deterministic floors. Genuine vendor absence degrades explicitly.
- **One policy across network surfaces.** `.rig/network-policy.json`
  mechanically governs verified shell, built-in web, and network-capable MCP
  surfaces. Every deny names its category and rule; legitimate near-matches
  pass; exact one-use approval permits only the unchanged action once; an
  activated permanent allowance or disablement takes effect thereafter.
- **Approval cannot be self-issued.** Verified host-native user-presence
  approval may be used only when it attests the exact digest and prevents
  replay; otherwise the external user-presence signature path applies.
- **Secrets.** MCP entries record env-var references only; `credential_safety`
  stays `manual_note_required` except where a report confirms inline-safe
  (`cursor:stdio`, `copilot`). No inline tokens.
- **Volatility (date-stamp + re-verify quarterly):** Antigravity absorbing Gemini
  CLI (deprecation 2026-06-18); Windsurf→Devin Desktop (Cascade EOL 2026-07-01,
  Devin Local rewrite may move hook/skill discovery); Cursor hooks beta; Codex
  hooks experimental; Antigravity CLI MCP issue #60; Cline MCP discussion #2418.

## 5. Ordered slices (status + verification command)

- **[ ] REOPENED — Slice A, capability registry and contract inventory.**
  Preserve the 19-host candidate data, but demote every executable axis lacking
  the exact Gate-2 contract or complete evidence bundle. Record unresolved
  fields explicitly; never infer them from another host or axis.
  → host registry/contract tests named by the re-frozen design.
- **[ ] REOPENED — Slice B, policy-backed adapters.** Replace additive
  note/marker behavior with each verified host's exact schema, matcher,
  deny/exit, one-use proceed, merge/preservation, and repeated-apply contract.
  Enforce the active policy consistently across verified shell, built-in web,
  and network-capable MCP surfaces.
  → AT-BASE-2 and AT-HOST-1/2 fixtures for every advertised executable axis.
- **[ ] REOPENED — Slice C, MCP lifecycle.** Preserve researched dispositions,
  retire unsupported MCP from every legacy/catalogue output path, preserve
  user-owned prior files with migration guidance, and prove supported MCP
  cannot bypass policy.
  → AT-HOST-5 plus legacy Basic and catalogue regressions.
- **[ ] REOPENED — Slice D, CI integration and bootstrap.** Implement safe,
  additive existing-CI parsing/merge and explicit-approval absent-CI bootstrap
  for all six providers. Fail visibly and unchanged on unknown/malformed input;
  run enabled controls/services with least permissions/no repository secrets;
  upload actionable reports; apply idempotently.
  → AT-CI-1…4 provider fixtures and real first-run records.
- **[ ] Slice E — Instruction-graft targets.** `apply.js` currently appends the
  pointer to `AGENTS.md` only; make it host-aware using `surfaces.instruction`
  (`.agents/rules/`, `GEMINI.md`, `.cursor/rules/*.mdc`, `.kiro/steering/*.md`,
  `.clinerules`, `.devin/rules/`, `CLAUDE.md`, …), appended never-clobber
  (AT-SHAPE-1). Advisory-MCP / unsupported-MCP hosts get a one-line MCP note.
  → `node --test tests/advanced-graft.test.js tests/advanced-apply.test.js`
- **[ ] Slice F — Per-axis evidence, gate, and docs.** For each claimed host/CI
  axis, record authoritative exact-surface documentation, vendor/version/date,
  fixture/result evidence, and passing first wire. Mark every incomplete
  advertised executable axis `incomplete`, emit nothing speculative, and block
  initial release; only genuine vendor absence degrades. Update operator
  coverage to match and, once Gate 2 is re-frozen, confirm this plan traces to
  the technical specification.
  → AT-HOST-3/4, AT-CI-4, first-wire matrix, then `npm test`.

## 5a. Acceptance coverage

Before it can be re-frozen, the technical specification must map these Gate 1
cases to executable tests. The older AC-HOST/AC-CI checks are narrower
scaffolding, not substitutes:

- **[ ] AT-BASE-2:** the same default-deny policy governs verified shell, web,
  and network-capable MCP surfaces; unavailable enforcement is reported.
- **[ ] AT-HOST-1:** every verified live-hook axis exposes its complete exact
  contract, including preservation and first/repeated apply.
- **[ ] AT-HOST-2:** all frozen categories deny with category/rule, near-matches
  pass, exact one-use approval permits the unchanged action once, and activated
  permanent policy choices take precedence.
- **[ ] AT-HOST-3:** every verified axis has its own cumulative documentation,
  vendor/version/date, fixture/results, and first-wire evidence.
- **[ ] AT-HOST-4:** any incomplete executable axis blocks initial release;
  genuine vendor absence degrades and emits no speculative config.
- **[ ] AT-HOST-5:** unsupported MCP is retired across all paths while
  preserving user-owned prior files and issuing migration guidance.
- **[ ] AT-CI-1:** verified existing CI is changed only through a safe additive
  merge that preserves unrelated jobs/values.
- **[ ] AT-CI-2:** absent CI is bootstrapped only after provider selection and
  explicit approval.
- **[ ] AT-CI-3:** every emitted pipeline really runs enabled controls/services,
  uploads actionable reports, uses least permissions/no repository secrets, and
  applies idempotently.
- **[ ] AT-CI-4:** unknown/malformed/unverified CI fails visibly and unchanged;
  an emitted integration stays pending until its first real run succeeds.
- **[ ] AC-INSTR-1 (host-native pointer, never clobber).** The pointer is
  appended to the host's `surfaces.instruction` target (created if absent, never
  overwriting existing content); an advisory-/unsupported-MCP host also receives
  a one-line MCP note. *(tests/advanced-graft.test.js — to author)*

## 6. Rejected alternatives

- **Fabricate a repo-scoped MCP path for windsurf/cline/hermes to reach 100%.**
  Rejected — vendors only ship user-global MCP; a committed file would not be
  read. Advisory note is the honest graft.
- **Force an MCP path for pi.** Rejected — vendor permanently refuses MCP.
- **Mark pi/cursor skills as NOT SUPPORTED.** Rejected — reversed by evidence
  (`.agents/skills/`, `.cursor/skills/`).
- **Conflate the three Cognition products.** Rejected — cloud Devin (UI/trigger),
  Devin CLI (`.devin/` committable), and Devin Desktop/ex-Windsurf
  (`.windsurf/`, user-global MCP) have divergent surfaces; they must map to
  distinct host identities.

## 7. Historical research rulings

### Resolved identity/disposition inputs

- **Devin identity mapping — CONFIRMED (2026-07-25).** `devin` → **Devin CLI**;
  `windsurf` → **Devin Desktop** (ex-Windsurf, vendor-renamed); **Cloud Devin is
  not in scope.** Grounded in the git trace: the original project (ponytail, now
  Rig) added Devin as *Devin CLI* — commit #318 "Add Devin CLI plugin manifest"
  (`.devin-plugin/plugin.json`, `devin plugins install`), classifying Devin CLI
  as a *skill-capable* host and Windsurf as a *separate instruction-only*
  adapter. Cloud Devin was never offered.

- **CodeWhale conflict — research disposition (2026-07-25).** MCP + skills are
  candidate advisory/user-global surfaces; `.codewhale/hooks.toml` is a
  candidate repo-scoped hook pending its exact contract and first wire.
- **Prior delivery ruling — reopened.** The 2026-07-25 single-PR ruling and
  green-`npm test` target cannot promote the release before the specification
  gate and per-axis first-wire gate pass.

### Research dispositions for Gate-2 resolution

- **Advisory MCP for user-global-only hosts** (Windsurf/Devin Desktop, Cline,
  Hermes): emit a note pointing the user at their user-global MCP file; do not
  graft a per-repo file.
- **Retire `pi` MCP** (`.omp/mcp.json`) across legacy and catalogue paths;
  preserve any user-owned prior file and emit migration guidance. pi hooks =
  none (extensions only); candidate grafts are instruction +
  `.agents/skills/`.
- **Swival hooks = advisory** (startup/exit + command-middleware only, no
  edit-time gate); graft instruction + skills + `.swival/mcp.json`.
- **Antigravity** rules pointer appended to a file under `.agents/rules/` (the
  official target) rather than depending on the community `trigger: always_on`
  frontmatter key.
