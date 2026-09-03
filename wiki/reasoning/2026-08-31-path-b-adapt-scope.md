---
date: 2026-08-31
source: agent
topics: onboarding-flow, what-rig-is
decisions:
status: current
supersedes:
tags: interdependency, trap
summary: Path-B "adapt" scoped as deterministic acceleration — Rig ships deterministic tools the onboarding host agent invokes (inventory existing config, reference it by path, selective skill install) with judgment injected by agent+user; D24 stays intact, inference/pruning-by-shape is gated behind grilling, and consolidation + repo-file reconciliation are deferred features.
---

# Path B — adaptive integration: scope, work-item map, grilling agenda

*Report-only investigation filed after the +12/100 adaptation eval and the
2026-08-30 Path A/B office-hours scoping. Maps the current pipeline, classifies
the eval's fixes against D24, and splits the work into buildable-now vs
gated-behind-grilling, plus a deferred-features bucket. The model was settled
with the intent owner across this session's grilling exchange; §1 records it.*

---

## 1. The model: deterministic acceleration

The intent owner resolved the framing fork (agent-driven adaptation vs a
mechanical pipeline feature) with a middle way, in their words **"deterministic
acceleration."**

- Rig ships **deterministic tools** the onboarding **host agent invokes**:
  detect markers (exists today), parse existing config into a structured
  inventory (new), reference it, and install a selected set (new).
- The **agent + user own the judgment** — what is relevant, what to reference,
  what to install. The tools never infer "relevant" from repo shape on their
  own; they execute a decision handed to them.
- **D24 stays intact.** D24 constrains what *Rig's own code decides
  autonomously*. Under deterministic acceleration the code decides nothing about
  what a repo "wants" — it is a fast, reliable executor for choices a human
  signed off on. Mechanical host/marker detection is unchanged.

Two premises from the eval are **withdrawn** by this session:

- **No deletion, either direction.** The eval's "delete what's not required" was
  written against a `--with-runtime` install-everything run. The fix is
  **selective install** (write only the chosen set), not install-all-then-prune.
  Rig never deletes the repo's pre-existing files, and never self-deletes its own
  payload post-install.
- **Governing constraint:** the install must be **context-weight neutral or
  negative** vs a naïve full install — never add to the bloat, ideally subtract.

---

## 2. What the current pipeline does with existing config

`.cursor/rules`, `.kiro/steering`, `.cursorrules`, `.claude/skills`,
`.windsurf/rules`, `.clinerules`, `.agents/*`, `hooks/` are known to
`rig/lib/inspect.js` as `HARNESS_DIRS` / `HARNESS_NAMES` (lines 11-27).

| Stage | What it does with those files | Reads content? |
|---|---|---|
| **inspect** (`inspect.js` `inspectTarget`) | `collectHarnessFiles` walks the known dirs/names, reads each file's **bytes** (line 126), computes a sha256, folds it into `harness_digest`, redacts secret-shaped strings, flags `suspicious_directive` / `secret_shaped` / `oversized` / `unreadable`. Output `inputs[]` is `{path, sha256, bytes}` only. | **Bytes only, for hashing + security scan.** No parse, no titles, no headings, no semantic model. Never referenced downstream as content. |
| **host detection** (`host-capabilities.discoverHosts`) | Maps marker paths → host ids mechanically. This is the D24-blessed layer. | No |
| **host review** (`hostReview`) | Turns findings into `ALLOW`/`QUARANTINE`/`BLOCK`. Purely a trust gate. | No |
| **recommend / profile** (`profile.js`) | `profileRepo` infers 4 shape signals (`source-code`, `test-runner`, `ui-surface`, `package-json`) from `package.json` + dir names; `recommend` marks **catalogue services** `not_recommended` when signals are missing — **advisory only, full menu stays selectable** (AD-14). Does **not** gate the Tier-1 skill payload. | Reads `package.json` only; never the cursor/kiro files. |
| **plan** (`plan.js` `createPlan`) | Emits owned-file operations for `.rig/**` + `ensure_line` on the root instruction file. Records preimages/collisions for files it will write. Never enumerates or references the repo's existing rules. | No |
| **apply** (`apply.js` / `payload.js`) | `runPayload` writes the manifest payload. `installVendoredSkillsOp` installs **all ~64 vendored skills** (markdown-only unless `activeDelivery`); no selection gate. `ensureGitignoreBlock` exists but no default manifest entry uses it. | No |
| **installed router** (`rig/tier-1/routing.md` → `.rig/routing.md`) | Names Rig's own skills and pipeline. Says nothing about the repo's existing `.cursor/rules` / `.kiro/steering` / plugin. The 2026-08-31 routing-hygiene fix reframed the phantom `wiki/status.md` cadence as an instruction to map-or-drop, but still adds no reference to what's already there. | n/a |

**Confirmed:** every stage detects **presence** (and hashes bytes for
integrity/security); **no stage reads or references the content** of the repo's
existing agent config, and nothing installs a subset tailored to the repo.

---

## 3. The eval's fixes, classified against D24

Eval fixes are its §3 "Breakage / conflict" list (F1-F5) plus its "single
highest-value change" a/b/c (FA-FC).

| # | Fix | Class | Why |
|---|---|---|---|
| **F1** | Phantom `wiki/status.md` / 3-min-cadence text in `routing.md` | **(a) within D24** — *done* | Pure-markdown reframe; shipped 2026-08-31 (routing hygiene, RIG-151/152). Path A. |
| **F2** | `routing.md` points at `rig/tier-1/...` "source checkout" paths | **(a) within D24** — *done* | Same fix / close-out. Markdown only. |
| **F3** | 3 always-on entrypoints funnel every task through `routing.md`, redundant mandate | **(a) within D24** | Rig knows which entrypoint files it writes. Making one canonical and the others point to it is mechanical; "which is canonical" is a trivial agent/user pick. |
| **F4** | Rig `rules/rig.md` YAGNI overlaps repo `CLAUDE.md` DRY/YAGNI section | **(a) to *surface*, (b) to *auto-trim*** | Surfacing "both files discuss YAGNI" from a heading/keyword inventory is mechanical and safe. Deciding to delete Rig's section is a semantic judgment → agent+user, or gated if Rig code does it. |
| **F5** | Review/TDD skill pileup (rig-code-review + pr-review-toolkit + plugin + superpowers), no precedence | **(a) to *surface + selective-install*, (b) to *auto-resolve*** | "Repo already has these review skills" is a mechanical dir check (same class as host detection). Skipping Rig's overlap or writing a precedence note is an agent+user choice. Rig code auto-picking the winner is gated. |
| **FA** | Reference existing Cursor/Kiro rules by path from `routing.md` | **(a) within D24** | Listing files that exist and emitting "honor these too" is additive markdown over real paths. No content claim. Enriching with per-rule summaries needs a content read → host agent does that during onboarding, not Rig code. |
| **FB** | Prune installed skill set to "what the stack implies"; drop duplicate `.claude/skills/` tree | **selective-install = (a); auto-derive-from-stack = (b)** | The 5.8 MB `.ts` dump is `--with-runtime` only (Path A / measurement). The markdown double-write (`.rig/skills/*` + `.claude/skills/rig-*`) is a real default-install weight issue → graft-mechanics gitignore call. "Prune to stack" *by explicit selection* is (a); *by Rig inferring the stack* is the D24-forbidden guess. |
| **FC** | Stop emitting conventions the target lacks | **(a) within D24** — *done* | = F1/F2. |

---

## 4. Work-item map

### Buildable within D24 (deterministic acceleration)

| ID | Item | Code surface | Effort | Expected eval-axis impact* |
|---|---|---|---|---|
| **B-1** | **Existing-config inventory tool.** New deterministic step: read the files `collectHarnessFiles` already gathers, emit `{path, host_family, kind (rule\|steering\|command\|skill\|instruction), title, headings[], byte_size}`. No semantic judgment — structure only. Carried in the plan, surfaced to the onboarding agent. | `rig/lib/inspect.js` (or new `lib/adapt-inventory.js`), `plan.js` to carry it, `routing.md` template to announce it | M | Enables B-2/B-4. Adaptation, signal-vs-noise, tailored-to-repo. |
| **B-2** | **Reference existing rules by path from the installed router.** Generated block in `.rig/routing.md`: "This repo already has agent config at «paths from B-1» — honor these alongside Rig's router." Mechanical path list, no content assertion. | `rig/tier-1/routing.md` template + `payload.js` post-payload injection (or manifest transform) | S–M | Directly answers "treated the repo as empty." Adaptation + breakage axes. Highest confidence mover. |
| **B-3** | **Selective skill-payload install.** Give the Tier-1 vendored-skill payload the same `select → rig.json` gate the catalogue services have. Default stays the **full set** (D24: explicit + trimmable, default full); onboarding agent + user trim; `installVendoredSkillsOp` honors the list. | `rig/lib/payload.js:100-123`, `rig/manifest.json` payload entry, `rig.json` schema, `resolve.js` | M–L | Biggest signal-vs-noise lever (~85% dead weight on a Node/TS repo). Serves the context-weight constraint. |
| **B-4** | **Existing-capability overlap surface.** B-1 inventory ∩ Rig's own skill list → a report the agent sees ("repo already provides review, tdd; Rig would add rig-code-review, rig-tdd"). Mechanical set-diff by capability tag. No auto-action — informs B-3 and any precedence note the agent authors. | new `lib/adapt-overlap.js`; capability tags on the ~64 catalog skills; `routing.md` template | M | Signal-vs-noise, net-capability, breakage (F3/F5). |
| **B-5** | **Single canonical entrypoint.** When Rig writes several always-on entrypoints (`CLAUDE.md` line, `.cursor/rules/rig.mdc`, `.kiro/steering/rig.md`), only one carries the full mandate; the others reference it. | `payload.js` entrypoint writers / manifest `ensure_line` + the `rig.mdc` / `rig.md` templates | S | Breakage (F3); minor signal-vs-noise. |
| **B-6** | **Context-weight budget check.** Deterministic post-install assertion: bytes/files Rig added ≤ threshold, and the skill-catalog double-write (`.rig/skills/*` + `.claude/skills/rig-*`) is deduped or gitignored (`ensureGitignoreBlock` exists, unused by default). Ties to the graft-mechanics gitignore decision (Path A). | `payload.js`, `check-runner.js` / `checks.js` | S–M | Signal-vs-noise; enforces "never add to the bloat." |

\* *All impact estimates are directional: the +12 baseline measured a
`--with-runtime` install-everything run. Path A must re-run the instrument
against a default **selective** install before any number here is real.*

### Gated behind grilling (amends/loosens D24, or opens a new consent boundary)

| ID | Item | Why gated |
|---|---|---|
| **G-1** | **Auto-derive the skill selection from stack signals.** Rig code infers "Node/TS CLI → these 7 skills, not ios-*" with no agent/user choice. `profile.js` already has the shape-inference machinery (advisory for catalogue); driving the Tier-1 payload with it is the amendment. | D24's stated rationale: inferring what a repo "wants" is a judgment; a wrong guess imposes tools the repo did not ask for — the exact thing the à-la-carte model prevents. |
| **G-2** | **Rig auto-trims its own overlapping content** (beyond surfacing in B-4): Rig code decides "repo's CLAUDE.md covers YAGNI, omit `rules/rig.md`'s section." | Requires semantic content comparison + an autonomous edit decision by Rig code. |
| **G-3** | **Content-level rule reconciliation:** read `07-testing.mdc`, detect conflict with rig-tdd doctrine, author a merge. | Semantic read + authored merge by Rig code, not the host agent. |
| **G-4** | **Any modification/removal of the repo's pre-existing files.** | Today's install is purely additive with preimages. Editing/deleting the user's own config — even agent-proposed — is a new consent boundary needing a preimage/uninstall story and a "nothing touched before sign-off" rule. |

### Deferred features (own track, separately gated when picked up)

| ID | Item | Note |
|---|---|---|
| **DF-1** | **Context consolidation / compression skill.** A Rig skill that collapses N near-duplicate skills/rules into one that manages + compresses context. Applies to target repos *and* to this repo (known context bloat here). | Intent owner flagged it as separate work this session. Not scoped now. |
| **DF-2** | **Repo-file reconciliation** — rewrite / merge / remove the repo's own agent config as a product feature (G-4 as a feature, not a guardrail question). | Deferred until real users ask. Needs its own grilling + preimage/consent design. |
| **DF-3** | **Re-runnable reconcile / `/rig onboarding` skill** — the post-install single-command wrapper (see `2026-08-31-post-install-rig-onboarding-skill.md`). One-shot vs re-runnable, markdown-only compatibility, consent model for pruning all open. | B-1…B-6 are its building blocks. |

---

## 5. Grilling agenda (before any G-class work)

For the `rig-grilling` → `rig-product-design` gate:

1. **How far does reconciliation go for v1?** Reference-by-path only (B-2),
   plus overlap-surface (B-4), or content-merge (G-3)? Fix the ceiling.
2. **Failure mode of a wrong guess.** If a needed skill is trimmed, or a stale /
   hostile existing rule is referenced as authoritative — what is the blast
   radius, and what makes it recoverable? Preimages cover files Rig *writes*; do
   they cover a *skip*?
3. **What signal justifies withholding an install?** "Host dir exists" is
   mechanical and safe. Is "package.json has no react" ever enough to withhold a
   skill, or must every withhold be a human choice? This is the D24-amendment
   question stated precisely (gates G-1).
4. **Does reference-by-path alone move the number?** Build B-1 + B-2, re-baseline
   a default selective install, measure. If it clears meaningfully-positive with
   only (a)-class items, the G-class work may be out of scope for beta.
5. **Consent model for selection.** D24 status quo (default-full, trim) vs
   default-lean, add. Who confirms — the agent, or the user explicitly, per skill
   / per family?
6. **Context-weight budget.** The actual ceiling — bytes? files? % over
   baseline? — and is exceeding it a hard fail or a warning?
7. **Precedence when capabilities overlap.** Repo has pr-review-toolkit, Rig
   adds rig-code-review: Rig silent, Rig emits a precedence note, or picking one
   is mandatory? Who authors the note?

---

## 6. Build order

B-1 → B-2 first (cheapest, highest-confidence, directly rebuts "treated the repo
as empty"), then re-baseline via Path A's instrument, then decide from grilling
question 4 whether B-3/B-4 land as-is or need the gate. B-5/B-6 are independent
and can land any time. Nothing here is blocked on a D24 change; the D24 question
only opens if grilling chooses to pursue G-1.
