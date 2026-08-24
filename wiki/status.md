# Status - checked 2026-08-24 (updated 2026-08-24, 11:41 UTC)

## Owner approval ceremony — all design-complete tickets approved (2026-08-24)

Owner re-signed Gate 1 oracle with Secretive key (fingerprint `SHA256:0Ok+jnRuyWIZdLUPt3ZtN4StHaDIsVtVM24A12zajRY`) a second time to approve all 16 design-complete tickets (RIG-101, 103–116) for implementation. All tickets moved from **Request for Signing** → **Coding**. Oracle verified: 5 files, 68 acceptance cases. Full test suite green: root 380/380, pi-extension 15/15, rig-mcp 3/3.

**Approved for implementation (moved to Coding):** RIG-101 (rig-mcp distribution), RIG-103–104 (MCP unification), RIG-106–107 (subagent mode + runtime entrypoint), RIG-108–111 (zero-caller modules + shipping paths + host contracts), RIG-112–116 (catalogue contract through leaf promotion).

## Ticketing structure updated (2026-08-24)

The Kanban board (`wiki/Tickets.md`) has been restructured to reflect the Rig development workflow:

**Current stages (as of 2026-08-24, post-approval):**
1. **Backlog** — nothing started
2. **Solution Discovery** — grilling in session, solution not yet clear
3. **Acceptance Criteria & Testing** — acceptance criteria and testing infrastructure being defined
4. **Request for Signing** — ready for hardware-key sign-off (currently empty; all approved)
5. **Coding** — development in progress (19 tickets: RIG-101, 103-116, 105, 119, 122 — all owner-approved)
6. **Ready for Commit** — tests green, ready for deployment (currently empty)
7. **Blocked** — waiting for owner input (2 tickets: RIG-102, 120)
8. **Done** — deployed and complete (4 tickets: RIG-102, 117, 118, 121)

All existing tickets have been organized into their appropriate stage based on status.

## Grilling session — owner rulings landed (2026-08-24)

Owner ruled on the five close-out items ([framing](reasoning/2026-08-24-grilling-five-open-decisions.md)).
Process doctrine captured verbatim in
[reasoning/2026-08-24-process-doctrine-and-one-lock.md](reasoning/2026-08-24-process-doctrine-and-one-lock.md)
(D25 business intent optional, D26 one lock, D27 freeze-timing), synthesized into
[the gate](topics/the-two-gates.md).

- **RIG-120 naming — DONE (code):** canonical name is just `qaynel/Rig`; the
  reverted `-v0.1` suffix is stripped from every manifest, marketplace,
  openclaw/opencode, `check-versions.js`, and the wiki. **Owner action left:**
  rename the GitHub remote from `Rig-v0.1` to `Rig` or install URLs 404.
- **RIG-112 — CLOSED, no freeze:** the "freeze now?" was a mis-raised question;
  by D27 nothing locks until solution+acceptance+tests are all in and sound. Fixed
  the `catalogue-contract` phrasing that generated it so it won't regenerate.
- **RIG-108 — WIRED (2026-08-24):** graft = augment-existing-capability
  managed blocks (**keep**, owner-confirmed); enforcement = policy allow/deny +
  one-use approval (now: `rig policy grant-approval` CLI + deterministic script);
  git-dispatch = pre-commit injection/secret scan (now: `rig validate-commit` CLI).
  Both callable, testable, integrated into Hermes plugin. See
  [enforcement-and-git-dispatch-wiring](topics/enforcement-and-git-dispatch-wiring.md).
- **RIG-113 / RIG-115 — pending owner content:** the lint skill is context-driven;
  owner will supply the "good code / good linting" knowledge base and, if needed,
  the specific `AT-LF-*` test cases. Agent to draft first passes to react to.

Oracle-touching outcomes (RIG-113 lists, RIG-115 cases) batch into the single
RIG-120 re-sign when ready.

## Testing-infrastructure audit (2026-08-24) — owner's instinct confirmed

Acceptance criteria largely exist (as prose in `wiki/specs/`); **runnable
testing infrastructure does not**, for the active close-out tickets:

- **RIG-108/109 (enforcement + git-dispatch):** now WIRED into the CLI
  (`rig policy grant-approval` → `grantApproval`; `rig validate-commit` →
  `runPreCommit`), so they have real production callers. **But every test still
  reaches them by direct `require`** (`release-blockers.test.js:23`,
  `advanced-oracle.test.js:288/335`) — no test exercises the CLI shipping path.
  The green gate does **not** prove the wiring works end to end. This is exactly
  RIG-109's unmet ask. Needed: a shipping-path test invoking the two CLI
  commands + the invariant meta-test (no `rig/lib/*.js` reached only by
  direct-require).
- **RIG-113 (`ecosystem-preferences.md` + `setup-decision-rule.md`):** ranked
  lists, EOL signals, setup contracts, and the propose/deliver/write decision
  rule are authored and good. **No tests.** One `[ASSUMED]` open item: the
  `.rig-backup` mechanism must reconcile with Rig's existing git-floor/clean-tree
  write convention.
- **RIG-115 (`acceptance-test-profiles.md`):** three suites / 14 Given-Expected
  cases (Applicability, Execution consent, Shell trust) authored well. **Not in
  signed `acceptance.md`** (which holds only AT-LF-1..19) and **in no test
  file.** Cases CONSENT-5, SHELL-2/3/5 are `[ASSUMED]` and need verification
  against the real `.rig/` policy (network-policy.json, resource caps, symlink
  handling) before they can be locked.

Path to finish: answer the `[ASSUMED]` open questions → build the AT-LF-* test
infrastructure (and the shipping-path tests) so each fails-before/passes-after →
one re-sign locks RIG-115 cases + any RIG-113 acceptance into the oracle.

## Owner ceremony + decisions (2026-08-24, later)

Owner ran the Gate 1 re-signing ceremony (`node scripts/approve-gate1.js`) with
their Secretive key (fingerprint `SHA256:0Ok+jnRuyWIZdLUPt3ZtN4StHaDIsVtVM24A12zajRY`,
comment `rig-gate-key@secretive.Manoj's-MacBook-Pro.local`) after landing
**RIG-102**: `test:code` now runs `npm test --prefix rig-mcp`, mirrored in the
signed `wiki/gate1/package-scripts.json`. Full gate green: root 380/380,
pi-extension 15/15, rig-mcp 3/3. Local signing convention moved from the
locally-excluded `.context/` to a tracked-gitignored `.credentials/` directory
(`scripts/approve-gate1.js` now reads `.credentials/gate1.env`).

Owner also approved three pending product decisions (implementation still
pending, doesn't touch the signed oracle): **RIG-119** fold spec-driven dev
into `rig-grilling`/`rig-product-design`, no new skill; **RIG-122** ship the
wiki convention as an optional markdown-only graft post-release; **RIG-105**
surface the Antigravity manual MCP step + a verification check, not
auto-write. RIG-108/112/113/115 remain blocked — each needs decision
*content* (not just approval) before there's anything to land or re-sign.

## Ticket burndown pass complete (2026-08-24)

Worked the whole RIG-101..122 backlog (`Tickets.md`). Every ticket now has a
solution doc under [`wiki/tickets/`](tickets/) linked from its board card, and
the board is re-columned (Done / To Do / Blocked). Full gate green throughout:
`npm test` = 13/13 + 380/380 + 15/15.

**Resolved + landed (Done):** RIG-117 (stale `agentic-harness-demo` →
`qaynel/Rig-v0.1` across all manifests/marketplace/openclaw/opencode + new
identity guard in `check-versions.js`), RIG-118 (README capability column +
rig-mcp pointer), RIG-121 (roadmap placeholder count + product-spec gap rows).
Incidental: gitignored `wiki/.obsidian/` — its vendored plugin binaries tripped
the secret-hygiene scan and were blocking the gate.

**Designed, implementation-ready (To Do):** RIG-101, 103, 104, 106, 107, 108,
109, 110, 111, 112, 113, 114, 115, 116 — each solution doc gives files, contract,
and tests. Key finding: several (102, 108, 112, 113, 115) ultimately re-sign the
Gate 1 oracle to *land*, because `package.json` scripts + `acceptance.md` are
under `gate1.sig`. RIG-108: verified `release-evidence.js` *does* have a caller
(`scripts/review-receipt.js`); the other three modules are genuinely zero-caller.

**Deferred — needs owner/PM input (Blocked):** RIG-102 (owner re-sign to land the
1-line change), RIG-105 (1-line approach confirm), RIG-119 (spec-driven adoption
decision), RIG-120 (release ceremony — owner signing keys), RIG-122 (wiki-graft
decision). Each carries a recommendation.

Open reconciliation surfaced for the release: `qaynel/Rig` (install.sh/README)
vs `qaynel/Rig-v0.1` (actual remote) — see RIG-117/RIG-120.
See [burndown trace](reasoning/2026-08-24-ticket-burndown.md).

---


If a page elsewhere in the wiki seems to disagree with this one, trust this one
— and check [the timeline's "reading a document by its date" table](index/timeline.md#reading-a-document-by-its-date)
to see what that page's era still believed.

The signed oracle remains unchanged and green at 68 acceptance cases. The
working technical design is v0.16 and is present rather than frozen. D24 keeps
the beta boundary at all 115 Policy leaves plus the 55-skill vendored shelf,
detected-host onboarding, the mandatory safety baseline, six CI providers, and
named-tag `5.0.0` distribution.

The protected oracle, secret scan, rule-copy check, and version check pass on
the current bytes. `npm test` is green end to end: the root suite is
**380/380** and the pi-extension suite is **15/15**. A prior read of this page
claimed `AT-BASE-3` and `AT-SECRET-1` were failing against the frozen business
text and required an owner-authorized Gate 1 re-signing ceremony; re-running
both on the current bytes shows they pass, so that re-signing ceremony is not
needed. The `pandas` benchmark import some local runs report as failing is a
missing `.venv` setup in that environment, not a suite failure.

The leftover production holes from the last pass are closed: apply writes a CI
file only when that path is in the signed plan and still compare-and-swaps it;
uninstall on a linked worktree no longer crashes, and install still places the
secret-guard hook in the shared hooks directory. The copy check fails closed
on a sync-map entry that is a symlink out of the repository.

## Production review findings

The nine findings supplied on 2026-08-23 are implemented and have focused
regression coverage.

| Finding | Current state |
|---|---|
| Repository symlinks escape write/delete boundaries | One shared realpath-aware containment guard protects lifecycle, payload, coverage, remediation, apply, and CI paths. Ancestor symlinks resolving outside the target fail before mutation. |
| Installer omits catalogue and safety runtime | The tagged-release payload installs the catalogue metadata, all service/baseline fragments, `materialize.js`, and all runtime modules under `.rig/runtime/`; local Tier 1 remains static-only. |
| Bare repository receives no vendored skills | Hostless install now receives all 55 neutral skills under `.rig/skills/` while still creating no absent host-specific tree. |
| Service packs repeat prohibited generic boilerplate | All Policy packs name exact scopes, applicability, dispositions, leaf-specific checks, distinct acceptance targets, explicit given/pass/fail evidence, and slice behavior. Generic selected services without repository bindings fail as coverage gaps instead of `process.exit(0)`. |
| Five CI providers have no adapter | GitHub Actions, GitLab CI, CircleCI, Jenkins, Buildkite, and Azure Pipelines each render and apply a provider-visible, detail-free repository check with approval, preservation, idempotence, journaling, and first-wire coverage. |
| Shipping journal and uninstall are incompatible; crash window is ambiguous | JSONL is authoritative for install, resume, and reverse removal. Pending records reconcile landed, unlanded, or conflicting state. The shipping CLI restores chained hooks, removes install-ID-attributed global entries, writes removal evidence, lists purge targets before deletion, and preserves user policy. |
| Review producer and validator schemas differ | Both use one strict `report-only` schema bound to technical-spec, catalogue-fragment, and exact PR implementation digests plus the PR base, exact passing case coverage, no release-blocking findings, and no unresolved IDs. |
| Distribution test never runs the installer/archive | The regression builds a tagged archive, transports it through fake `curl`, executes the real installer under `dash`, and checks tag, skills, catalogue, and runtime in the installed target. |
| Installer requires Bash | The root stub is POSIX `sh` with no Bash shebang, `pipefail`, substring expansion, or `[[ ... ]]`. |

[Intent-owner findings](reasoning/2026-08-23-production-release-blockers.md)

## Release boundary

The owner selected plan-time disclosure for model-assisted secret triage. The
policy proposal, exact disclosure-bound approval, CLI flow, persistent status,
and regressions are implemented with actual SSHSIG verification. One-use
approval replay, recovery signing/ordering, real lint argv execution, vetted
history scanning, structured semantic drift, axis-specific host contracts, and
uninstall integration are also covered. The full gate is green (see above); the
release is blocked on the signer-class attestation and a fresh independent
receipt bound to the resulting exact PR worktree.

After those are resolved, rerun the full gate on the final bytes and explicitly
cut/publish `v5.0.0`; tag publication is never an implicit side effect of code
changes.

A default local `sh rig/bootstrap.sh` (no `--with-runtime`) is now
markdown-only end to end: per-skill code and `.rig/plumbing` are gated behind
`active_delivery` alongside the runtime engine, and `.tmpl`/`TODOS-format.md`
never land. All 55 `SKILL.md` files still land unconditionally, so the frozen
oracle's 55-skill reading is unaffected and no re-sign was required
([AD-37](index/decisions.md), [lean-install protocol](reasoning/2026-08-23-lean-install-protocol.md)).

## Current mechanics

- `npm test` verifies the protected oracle first, then secrets, rule copies,
  versions, the root Node suite, and pi-extension tests.
- `install.sh` downloads a named tag to disk and executes only the extracted
  local bootstrap with its explicit active-delivery runtime gate.
- `.rig/install-manifest.jsonl` is the single lifecycle authority.
- Policy activation and recovery verify external SSHSIG receipts under separate
  namespaces; caller-set verification booleans are not accepted by shipping
  commands.
- The release-review wrapper starts a fresh reviewer process, binds the exact PR
  implementation worktree and base, and refuses incomplete or failing evidence.
- Historical review receipts remain void for current bytes.

## Owner-controlled release inputs

- Produce the authorized fresh independent review against the exact PR
  worktree.
- Add the intent owner's signer-class attestation comment to the frozen Gate 1
  signer file through an owner-authorized re-signing ceremony.
- Confirm the final `v5.0.0` tag and publication operation after the full gate
  is green.
