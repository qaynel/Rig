---
date: 2026-09-02
source: intent owner
topics: path-b-onboarding, gate1-signing, security
decisions:
status: current
summary: Grilling oracle and adversarial tests for eight onboarding hardening findings (AT-HD-1 through AT-HD-8)
---

# Onboarding hardening grilling — 2026-09-02

Eight findings were surfaced in a security/correctness review of the Path B
onboarding system. This trace records the grilling session: user intent, ruling
on the F8 immutability question, acceptance criteria, and the adversarial test
file produced before any implementation.

## User intent

Fix all eight findings. Tests were requested first to lock intent before
implementation planning begins.

## F8 ruling (from the intent owner)

Individual reasoning trace bodies are immutable. Frontmatter fields (`status:`,
`topics:`, `summary:`) and aggregate summary files (generated index, hub
synthesis) are mutable as more traces are added. The wiki-maintenance skill's
approach (frontmatter edits permitted, body never rewritten) is correct.
`wiki/reasoning/README.md` must be updated to state this distinction rather than
saying traces are "never edited" without qualification.

## Acceptance criteria (AT-HD-1 through AT-HD-8)

Each criterion is expressed as an observable Given/When/Then and has a
corresponding adversarial test in `tests/onboarding-hardening.test.js`. Every
test is red before implementation and green only when the finding is fixed.

### AT-HD-1 — proposal body integrity (F1, Blocker)

*Given* a `.rig/state.json` in `proposed` phase whose `proposal.grafts` (or
`selected_skills`) have been replaced after the approval was obtained — with
`content_digest` updated per-row so per-row validation passes — but
`proposal.digest` still points at the original canonical body, *when* `apply`
is called with a valid approval receipt, *then* `apply` throws before mutating
any repository-owned file, with a message indicating a digest/integrity failure.

A design that consumes `state.proposal.*` fields without first re-deriving
`sha256(canonical(proposal_body))` and comparing to `state.proposal.digest`
fails this case.

### AT-HD-2 — atomicWrite .tmp symlink TOCTOU (F2, Blocker)

*Given* a symlink placed at `<state_file>.tmp` pointing to a file outside the
repository target, *when* any onboarding action triggers `atomicWrite` for that
state file, *then* the write is refused before any byte reaches the outside
symlink target. The sentinel content of the outside file remains unchanged after
the call. A design where `fs.writeFileSync` follows the symlink and writes bytes
to the outside location before any error is raised fails this case, even if a
subsequent `containedPath` check throws.

Fix requires: `fs.openSync(temporary, 'wx', 0o600)` (O_EXCL) instead of
`fs.writeFileSync`, so the open refuses if the path exists — including as a
symlink.

### AT-HD-3 — post-approval inventory mutation (F3, High)

*Given* a proposal in `proposed` phase with a valid approval receipt, *when* a
new file is written to the repository between proposal signing and the `apply`
call, *then* `apply` throws before mutating any repository-owned file, with a
message indicating the inventory changed or is stale. A design where `apply`
only re-checks `catalog_digest` and ignores inventory drift fails this case.

Fix requires: at the top of `apply`, re-run `inventoryHarness(target)` and fail
if `digest !== state.inventory.digest`.

### AT-HD-4 — mixed-host instruction-only fallback (F4, High)

*Given* a repository with the Codex native scope installed
(`.agents/skills/rig-onboarding/SKILL.md` present) and a host that relies on
the instruction-only scope (reads from `.rig/skills/`), *when* `apply` projects
a selected skill, *then* the skill is projected into BOTH the Codex native scope
(`.agents/skills/<skill>/SKILL.md`) AND the instruction-only scope
(`.rig/skills/<skill>/SKILL.md`). A design where instruction-only is skipped
because the global native-scope union is non-empty fails this case.

Fix requires: `installedSkillScopes` to receive the list of installed hosts and
emit a scope per host (native if available, instruction-only otherwise), rather
than collapsing to a single global empty-union guard.

### AT-HD-5 — version single source of truth (F5, High)

*Given* the repository, *when* README.md's `--version` examples and
`buildSkillCatalog`'s default `releaseTag` are inspected, *then* both derive
from one canonical source (`package.json` version or `rig/manifest.json`).
`buildSkillCatalog` must not have a hardcoded `releaseTag = 'v...'` default.
README examples must match the canonical version. A test fails if they diverge.

Fix requires: remove `releaseTag = 'v5.0.0'` default from `buildSkillCatalog`;
require callers to pass it; derive from `package.json` version everywhere.

### AT-HD-6 — inventory drift check fails open (F6, Medium)

*Given* `inventoryDriftFailures` is called with a target whose `inventoryHarness`
traversal would throw (e.g. non-existent target directory), *when* it is called,
*then* it throws or pushes a hard failure — it does not return `[]`. A design
with `try { ... } catch { return []; }` fails this case.

Fix requires: export `inventoryDriftFailures` from `onboarding-check.js` (for
direct testing); let the exception propagate or push a `hard_failure` entry for
`inventory-broken`.

### AT-HD-7 — MCP text duplication (F7, Medium)

*Given* a call to the MCP `rig-onboarding` tool for any action, *when* the
response is inspected, *then* `content[0].text` is a short human-readable
summary (phase, next_action, hard-failure count — under 300 characters) that is
distinct from `JSON.stringify(structuredContent)`. A design that emits
`JSON.stringify({ next_action, ...result })` into `content[0].text` fails this
case.

Fix required in both `rig-mcp/index.js` and `rig/mcp-runtime/index.js`. A test
must assert `content[0].text.length < 300` and `content[0].text !==
JSON.stringify(result)`.

### AT-HD-8 — wiki immutability policy (F8, Medium)

*Given* `wiki/reasoning/README.md` and `.claude/skills/wiki-maintenance/SKILL.md`,
*when* they are read, *then*: (a) `reasoning/README.md` does not say traces are
"never edited" without qualifying that frontmatter fields are mutable metadata;
(b) `wiki-maintenance/SKILL.md` does not authorise rewriting trace body content;
(c) both documents explicitly address body immutability. Per the intent owner's
ruling: trace bodies are immutable, frontmatter and aggregate summaries are
mutable.

Fix requires: update `reasoning/README.md` to distinguish body (immutable) from
frontmatter metadata (mutable). No body edits are needed; no trace reverts are
needed.

## Testing infrastructure

File: `tests/onboarding-hardening.test.js`

All 8 tests are red as of this trace (confirmed by `node --test
tests/onboarding-hardening.test.js`). Run them as part of `npm test` to verify
they remain red until fixed and green after.

## What must happen before Gate 1 signing

1. `rig-product-design` must produce or update `wiki/gate2/technical-spec.md`
   with the implementation approach for all 8 findings. It is checked for
   presence, not frozen.
2. The intent owner reviews this oracle and the test file.
3. The intent owner runs `node scripts/approve-gate1.js` to sign the oracle.
4. Only then does implementation begin.

## Open decisions

None. All 8 acceptance criteria are unambiguous. F8 ruling was given by the
intent owner in the grilling session (2026-09-02): trace bodies are immutable,
frontmatter and aggregates are mutable.
