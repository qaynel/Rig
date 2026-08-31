# Path B — Agent-Led Adaptive Onboarding Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. This repo also mandates `rig/tier-1/routing.md` and `rig-tdd`; every task below is a red→green→refactor→commit loop against the **already-frozen** Path B oracle tests. Do not write production code before the matching test is red in front of you.

**Goal:** Build Rig's agent-led adaptive onboarding: `install rig` lays down a release-pinned skill-capability catalogue plus a shared `prepare`/`propose`/`apply`/`check` engine, and a host agent (not Rig code) grafts the smallest useful capability delta onto the repository's existing framework under content-bound human approval.

**Architecture:** One domain function `handleOnboarding(request)` owns four actions (`prepare`, `propose`, `apply`, `check`). The installed CLI (`.rig/bin/rig onboarding`) and both MCP servers (`rig-mcp/` root + `.rig/runtime/rig-mcp/` installed) are thin adapters over it with zero decision logic. Rig code only enumerates known paths, parses bounded self-declared structure, hashes, redacts, validates, renders Markdown, journals, applies approved bytes, and runs mechanical checks. The host agent owns every relevance / reuse / delta / graft / add / omit judgment. Repository-owned files change only inside versioned `<!-- rig:graft … -->` sections.

**Tech Stack:** Node.js standard library only (`node:crypto`, `node:fs`, `node:path`, `node:test`). No new npm dependencies, no YAML parser. `@modelcontextprotocol/sdk` already vendored under `rig-mcp/node_modules`. POSIX `sh` for the installer launcher and `rig/bootstrap.sh`.

**Spec (travels with this plan — read both):**
- Technical design: `wiki/reasoning/2026-08-31-path-b-technical-spec.md` (F-1..F-6, S-1..S-4; the authoritative contract source — every schema, marker grammar, failure code, and command shape is quoted verbatim there).
- Product direction: `wiki/reasoning/2026-08-31-path-b-product-direction.md`, `wiki/reasoning/2026-08-31-path-b-follow-up-decisions.md`, `wiki/reasoning/2026-08-31-path-b-adapt-scope.md`.
- Signed oracle: `wiki/gate1/business-spec.md` (§ "Path B onboarding outcome", §2 business rules, §6 property 7), `wiki/gate1/acceptance.md` cases **AT-PB-1 … AT-PB-10** (section I).
- Acceptance oracle rationale + evidence map: `wiki/reasoning/2026-08-31-path-b-acceptance-oracle.md`.

---

## Global Constraints

Every task's requirements implicitly include this section. Values are copied verbatim from the technical spec §2 and the signed oracle.

- **The executable oracle is frozen and signed.** `node scripts/check-advanced-spec.js` currently exits 0: "Oracle verified: 14 files, 83 acceptance cases". You may **not** edit, and must keep byte-identical, every file in `wiki/gate1/testing-infrastructure.manifest`: all `tests/path-b-*.test.js`, `tests/helpers/path-b.js`, `tests/advanced-*.test.js`, `tests/helpers/advanced.js`, `scripts/check-advanced-spec.js`, `wiki/gate1/package-scripts.json`. You may **not** run or simulate `node scripts/approve-gate1.js`. If a Path B test looks wrong, stop and return to grilling — do not change it.
- **The frozen test file IS the spec for its task.** Where this plan and a `tests/path-b-*.test.js` assertion disagree, the test wins. Read the whole test file before starting its task.
- **Rig code never infers desire from repository shape.** No keyword classifier, no vendor-prefix stripping-and-guessing, no "looks like a testing repo" logic. Exact self-declared `capability`/`overlap_tags` and the explicit alias map are the only machine signals; everything else is the host agent's job.
- **JSON discipline:** every emitted JSON/JSONL uses `schema_version: 1`, UTF-8, LF line endings, two-space indent, exactly one trailing newline (`` `${JSON.stringify(v, null, 2)}\n` ``). Mutation-input objects reject unknown keys.
- **Digests:** lowercase SHA-256 hex. Object digests are over canonical JSON — object keys sorted recursively, arrays kept in declared semantic order, lists whose schema says order-irrelevant sorted first, no insignificant whitespace. Use the helper shape in `tests/helpers/path-b.js` `canonical()` as the reference implementation; ship an equivalent std-lib helper in `rig/lib/`.
- **Path safety:** repository-relative POSIX paths only. Reject absolute paths, empty segments, `.`/`..`, NUL, symlinks that escape the repo, and multiply-linked mutation targets. Reuse the existing containment seam in `rig/lib/path-safety.js` / `rig/lib/inspect.js`.
- **Apply concurrency:** one exclusive `.rig/onboarding.lock` (records PID + start time, never auto-broken, removed in a `finally`). Every repository mutation is preflighted before the first write and goes through the existing pending/applied journal (`rig/lib/payload.js` `journalWriter`). A mid-apply failure keeps completed writes, does not claim success, and resumes only on a byte-identical approved proposal.
- **Governed catalogue is untouchable.** `rig/catalog.json` and everything under `rig/catalog/services/**` stay byte-identical. `tests/path-b-catalog.test.js` pins their combined SHA-256 to `9cb13bfddfdc645028b197d39383a3fd654e459d2793bec47649b6123717f7aa`. The skill shelf is a **separate** taxonomy that never imports, rewrites, or reads a service selection.
- **Skill counts (this release snapshot):** 55 optional vendored skills + 7 established core workflow skills (grilling, product-design, implementation, execution, tdd, debugging, code-review) + `rig-onboarding` = **63** in the generated skill catalogue. `listVendoredSkills()` returns the **55**.
- **Eleven family IDs, sorted:** `browser-and-research`, `debugging`, `delivery-and-operations`, `design-and-experience`, `implementation-and-orchestration`, `knowledge-and-documentation`, `requirements`, `review`, `safety-and-security`, `specification-and-planning`, `testing`.
- **Graft marker grammar (version 1, whole lines, exact):**
  - open: `^<!-- rig:graft capability="([a-z0-9]+(?:-[a-z0-9]+)*(?:\.[a-z0-9]+(?:-[a-z0-9]+)*)+)" version="(1)" begin -->$`
  - close: `^<!-- rig:graft capability="\1" end -->$`
  - Markdown-compatible surfaces only (`.md`, `.mdx`, `.mdc`, extensionless files classified as Markdown instruction files). JSON/YAML/TOML/code are refused unchanged.
- **Release tag:** `v5.0.0`. Installer always passes `--with-runtime`.
- **Onboarding never auto-runs.** Install ends by telling the user to invoke `rig-onboarding` in a host agent. `install` does not read semantic repository content, run `prepare`, choose optional skills, produce a proposal, or apply a graft.
- **Inner loop:** `node --test tests/path-b-<area>.test.js` (or a single `--test-name-pattern`). **Full gate before push:** `npm test` (runs `scripts/check-advanced-spec.js` first, then `test:code`). Never push on a red or unrun gate. `npm run test:rig` is not a substitute.
- **Wiki cadence:** this is multi-step work that changes what's true. File a dated reasoning trace under `wiki/reasoning/` at least every three minutes of active work and whenever an approach fails, then run `node scripts/build-wiki-index.js`. Update the topic hubs (`onboarding-flow`, `what-rig-is`, `graft-mechanics`, `the-catalogue`, `testing-strategy`, `delivery-plan`) and `wiki/index/decisions.md` in the same change per `wiki/reasoning/README.md`.

---

## Preconditions (verify before Task 1)

- [ ] `node scripts/check-advanced-spec.js` exits 0 and prints "83 acceptance cases". (If it fails, the oracle is not signed — stop; the human signing ceremony is a hard blocker and no agent may perform it.)
- [ ] `node --test tests/path-b-*.test.js` runs and is **red** (currently 54 fail / 1 pass — the one green test is the governed-catalogue byte guard). This is the baseline you are turning green.
- [ ] `npm test` on the untouched branch is otherwise green (the Path B failures are expected; nothing else is).
- [ ] Note the stale wiki text: `wiki/status.md` / `wiki/Home.md` still say "owner signature pending". The committed signature (`wiki/gate1/gate1.sig`, re-signed in `5694fd7b`) and the passing gate say otherwise. Reconcile this in your first wiki trace; treat `check-advanced-spec.js` exit 0 as the source of truth for "may implementation begin".

---

## File Structure

### New modules

| Path | Responsibility |
|---|---|
| `rig/lib/onboarding.js` | `handleOnboarding(request)` — the shared four-action domain handler. Discriminated-union input, canonical response envelope. No I/O beyond `.rig/` state, journal, and approved bytes. Owns the `.rig/onboarding.lock`. |
| `rig/lib/onboarding-state.js` | `.rig/state.json` schema, strict validation, `revision` CAS, atomic write, allowed/forbidden phase transitions, proposal/summary digesting, and the four Markdown renderers (`adopted-config.md`, `overlaps.md`, `grafts.md`, `onboarding-summary.md` validation). |
| `rig/lib/skill-catalog.js` | Recursive load of the capability hierarchy, frontmatter validation, `families.json` + `migrations.json` readers, and the in-memory catalogue builder shared by the generator and the check-mode drift test. |
| `rig/lib/adapt-overlap.js` | S-2 exact-match overlap surface: `E(e) ∩ R(r)` set logic, grouped output, set-difference of unmatched Rig capabilities. Zero side effects. |
| `rig/lib/onboarding-check.js` | S-4: attributable weight (files/bytes) from the latest applied journal, `soft_budget` comparison → `payload-file-growth` / `payload-byte-growth` warnings, and the closed hard-failure set. Consumed by onboarding `check` and the installed `rig check` command. |
| `scripts/build-skill-catalog.js` | Dev/release generator: reads frontmatter + `families.json` + `migrations.json`, writes `rig/catalog/skills/catalog.json` deterministically. `--check` regenerates in memory and fails on drift. Wired into `npm test` via `scripts/check-versions.js` or a sibling check. |
| `rig/tier-1/skills/onboarding/SKILL.md` | Canonical onboarding playbook (the seven-step mandate). Single source; installed to `.rig/skills/onboarding/SKILL.md`. |
| `rig/tier-1/skills/onboarding/wrapper.claude.md`, `wrapper.codex.md` (or manifest-templated) | Thin native discovery wrappers that point at `.rig/skills/onboarding/SKILL.md`. No playbook copy. |
| `install` (repo root, executable) | Public launcher implementing `install rig [--host <host>]... [--target <repo>] [--version <tag>]`. Delegates to `install.sh` / `rig/bootstrap.sh`. |
| `rig/catalog/skills/families.json` | Bounded generator input: `{ schema_version: 1, families: [{ id, title, description }] }`, unique + sorted by id, ids == the eleven family IDs. |
| `rig/catalog/skills/migrations.json` | `{ schema_version: 1, aliases: { "<legacy-name>": "<canonical-name>" } }`. Alias targets must exist; aliases unique. |
| `rig/catalog/skills/<family>/<capability-leaf>/<source-dir>/SKILL.md` | Relocated optional shelf (moved from the current flat `rig/catalog/skills/<source-dir>/`). |

### Modified modules

| Path | Change |
|---|---|
| `rig/lib/skills.js` | `listVendoredSkills()` becomes recursive over the capability hierarchy and returns `{ name, dir, source_rel, family, tool, capability, guarantees, overlap_tags }`. Keeps the existing name-collision tie-break (`connect-chrome` vs `open-rig-browser`). |
| `rig/lib/payload.js` | Add `parseGraftSections`, `upsertGraftSection`, `removeGraftSection` (one shared parser). `runPayload({ activeDelivery })` now: stages the 55-skill shelf once under `.rig/runtime/rig/catalog/skills/`, copies the generated catalogue to `.rig/catalog.json` (conflict, don't overwrite, if user-edited), projects **only the 8 mandatory** skills into host discovery pre-approval, and installs the runtime (`.rig/runtime/rig/lib/onboarding.js`, `.rig/runtime/rig-mcp/`, `.rig/bin/rig`, `.rig/skills/onboarding/SKILL.md`). `journalWriter` records `managed_grafts` (full current section set per path). |
| `rig/lib/inspect.js` | Export `HARNESS_DIRS`, `HARNESS_NAMES`, `collectHarnessFiles` (if not already) and add `inventoryHarness(target)` → the S-1 structural inventory object. Reuses the existing enumeration, 256 KiB bound, hashing, redaction, containment. No change to `profileRepo`. |
| `rig/lib/lifecycle.js` / `rig/lib/uninstall.js` | Teach uninstall the `graft_managed` ownership class: parse the file, remove only capabilities in the latest journal record, preserve later user edits, never restore a whole preimage over a grafted file. |
| `rig/lib/cli-advanced.js` + `rig/bin/rig` | Add the `onboarding` subcommand: `rig onboarding --input <request.json>` → `handleOnboarding` → response JSON on stdout, non-zero exit on hard failure. Add/extend `rig check` to call `onboarding-check.js`. |
| `rig-mcp/index.js` + `rig/mcp-runtime/` (installed copy source) | Register `rig_onboarding` with the four-action union `inputSchema`, the response `outputSchema`, and annotations `{ readOnlyHint:false, destructiveHint:true, idempotentHint:true, openWorldHint:false }`. Structured content = the domain response; text content = a short render of `next_action` + failures + warnings. No decision logic. |
| `rig/bootstrap.sh` | `--host <id>` (repeatable) → validate against the host registry, de-dupe first-seen, join comma-separated, pass one `--hosts a,b`. Always `--with-runtime`. Final message: the exact two lines below. |
| `rig/manifest.json` | New payload ops: generated `.rig/catalog.json`, `.rig/runtime/rig/catalog/skills/**`, `.rig/runtime/rig/lib/onboarding.js` (+ deps), `.rig/skills/onboarding/SKILL.md`, native `rig-onboarding` wrappers, `.rig/runtime/rig-mcp/**`. Restrict pre-approval host skill projection to the 8 mandatory names. No service-catalogue op changes. |
| `wiki/topics/*`, `wiki/index/decisions.md`, `wiki/reasoning/**` | Kept in sync per the cadence rule. |

### The exact installer success message (F-6, `AT-PB-6`)

```
Rig is installed. In your host agent, invoke rig-onboarding for this repository.
Nothing is adapted until you approve its onboarding summary.
```

When several hosts were explicit/detected, output first lists them as `host: <id>` lines in first-seen order (one line per host, de-duplicated), then prints the two lines above.

---

## Slice order (from technical spec §14)

1. **Catalogue spine** — F-1 + F-3 → `tests/path-b-catalog.test.js`
2. **Mechanical context** — S-1 + S-2 + F-4 prepared state → `tests/path-b-inventory.test.js`, `tests/path-b-state.test.js`
3. **Safe graft primitive** — F-2 → `tests/path-b-graft.test.js`
4. **Shared onboarding vertical slice** — F-5 + S-3 → `tests/path-b-onboarding.test.js`, `tests/path-b-mcp.test.js`
5. **Operator path** — F-6 → `tests/path-b-install.test.js`
6. **Failure / weight closure** — S-4 → `tests/path-b-weight.test.js`
7. **Full gate** — `npm test`

Each slice below is one task. Sub-steps are 2–5 minute actions. Commit at each green sub-milestone with a `feat:` / `test:` message; keep commits small.

---

## Task 1: Catalogue spine (F-1 + F-3)

Deliverable: `tests/path-b-catalog.test.js` fully green (7 tests) without regressing `npm test`.

**Files:**
- Create: `rig/catalog/skills/families.json`, `rig/catalog/skills/migrations.json`, `scripts/build-skill-catalog.js`, `rig/lib/skill-catalog.js`, `rig/catalog/skills/catalog.json` (generated output — committed).
- Move: every `rig/catalog/skills/<dir>/` (55 of them, incl. `_core`) → `rig/catalog/skills/<family>/<capability-leaf>/<dir>/`. Keep `LICENSE.upstream`, `UPSTREAM.md`, `README.md` at `rig/catalog/skills/`.
- Modify: `rig/lib/skills.js` (`listVendoredSkills` recursive + metadata), every optional `SKILL.md` (frontmatter fields), the 7 core `rig/tier-1/skills/*/SKILL.md` (frontmatter fields), `rig/lib/payload.js` (`activeDelivery` staging + `.rig/catalog.json` copy + conflict + 8-mandatory projection), `rig/manifest.json`, `rig/lib/inspect.js` only if the catalogue load path is shared.
- Test: `tests/path-b-catalog.test.js` (frozen — do not edit).

**Interfaces:**
- Produces `listVendoredSkills() -> Array<{ name, dir, source_rel, family, tool, capability, guarantees: string[], overlap_tags: string[] }>` — length **55**; `source_rel` matches `^rig/catalog/skills/<family>/[^/]+/[^/]+/SKILL\.md$`; `guarantees` non-empty, unique, each ≤ 160 code points, no `\n`; `overlap_tags` sorted + unique; includes `name:'rig'` with `source_rel` ending `/_core/SKILL.md`, plus `connect-chrome` and `open-rig-browser` as distinct entries.
- Produces `rig/catalog/skills/catalog.json` and its byte-identical install copy `.rig/catalog.json`:
  ```json
  {
    "schema_version": 1,
    "catalog_kind": "skill-shelf",
    "release": { "version": "<tag>", "skills_digest": "<sha256 of canonical(rows)>" },
    "taxonomy": { "id": "skill-shelf-v1", "families": [ { "id", "title", "description" } ] },
    "skills": [ { "id", "name", "description", "family", "tool", "capability",
                  "guarantees": [], "overlap_tags": [], "aliases": [],
                  "source_kind": "core|optional", "required": bool, "source_rel" } ],
    "soft_budget": { "basis": "previous-release", "files": 0, "bytes": 0 }
  }
  ```
  - `skills.length === 63`. `taxonomy.families.map(f=>f.id)` deep-equals the eleven sorted family IDs.
  - Grouping `skill.capability -> [ids].sort()` deep-equals the `MEMBERSHIP` map hard-coded at the top of `tests/path-b-catalog.test.js` (lines 11–58 — treat that map as authoritative membership).
  - Families sorted by `id`; skills sorted by `(family, capability, id)`; `aliases` + `overlap_tags` unique + lexically sorted.
  - `release.skills_digest === sha256(canonical(rows))` where `rows` is each skill projected to exactly `{id,name,description,family,tool,capability,guarantees,overlap_tags,aliases,source_kind,required,source_rel}` (see test lines 151–153).
  - File bytes exactly `` `${JSON.stringify(value, null, 2)}\n` ``.
- Consumes on `prepare`: a valid `.rig/catalog.json`. Malformed metadata (missing `guarantees`, alias like `unknown-vendor:invented`) makes `handleOnboarding({action:'prepare'})` **throw** matching `/catalog|guarantee|alias|invalid/i` and write **no** `.rig/state.json` (test lines 114–127). A prepare with a tampered `release.skills_digest` makes a later `propose` throw `/catalog|stale|digest/i` (test 174–201).
- `runPayload(target, hosts, { activeDelivery: true, releaseTag: 'v5.0.0' })` must, in the `activeDelivery` path:
  - copy `rig/catalog/skills/catalog.json` bytes verbatim to `<target>/.rig/catalog.json`;
  - stage exactly 55 `SKILL.md` files under `<target>/.rig/runtime/rig/catalog/skills/` (no host discovers this path);
  - project into `.agents/skills/` (and `.claude/skills/` when selected) **only**: `rig-code-review`, `rig-debugging`, `rig-execution`, `rig-grilling`, `rig-implementation`, `rig-onboarding`, `rig-product-design`, `rig-tdd`;
  - if `<target>/.rig/catalog.json` already exists and differs from the pinned bytes (user-edited, no clean receipt), **throw** `/catalog|conflict|edited|receipt/i` and leave the file untouched (test 203–211).

**Frontmatter contract added to every canonical `SKILL.md` in scope** (technical spec §3.3): `family`, `tool` (lowercase kebab primary substrate, e.g. `host-agent`), `capability` (`^[a-z0-9-]+\.[a-z0-9-]+$`, first segment == `family`, listed in membership), `guarantees` (block sequence, non-empty, unique, ≤160 cp, one line each), `overlap_tags` (sorted, unique, `^[a-z0-9-]+$`). Parser supports only bounded scalar + block-sequence YAML shapes — **no YAML dependency**.

**Steps:**

- [ ] **1.1** Read `tests/path-b-catalog.test.js` end to end. Write the membership map, `FAMILY_IDS`, and the `sourceCatalog()`/digest expectations into a scratch note. Run `node --test tests/path-b-catalog.test.js` — confirm all 7 red (1 unrelated green byte-guard).
- [ ] **1.2** Author `rig/catalog/skills/families.json` (11 rows, sorted, titles + boundary descriptions from technical spec §3.1).
- [ ] **1.3** Create the capability-hierarchy directories and `git mv` each of the 55 source dirs into `<family>/<capability-leaf>/<dir>/` per the membership map. Keep git history (`git mv`). Leave the 3 reserved files in place.
- [ ] **1.4** Add the six frontmatter fields to each optional `SKILL.md` (55) and each core `SKILL.md` (7: `rig/tier-1/skills/{grilling,product-design,execution,tdd,debugging,code-review}/SKILL.md` and the implementation skill source `skills/rig/SKILL.md`). Assign `family`/`capability`/`tool`/`guarantees`/`overlap_tags` from the membership map + technical spec §3.2. Keep existing `name`/`description`.
- [ ] **1.5** Author `rig/catalog/skills/migrations.json`. At minimum record the `connect-chrome` tie-break so canonical frontmatter names are unique (technical spec §3.5). Only add an alias when a callable name genuinely changed.
- [ ] **1.6** Implement `rig/lib/skill-catalog.js`: bounded frontmatter parser, recursive source walk, `families.json`/`migrations.json` load, and `buildSkillCatalog()` returning the in-memory catalogue object (sorted, digested per the rules above). Validation throws on missing/invalid metadata, duplicate names, invalid alias targets, capability/family mismatch.
- [ ] **1.7** Rewrite `listVendoredSkills()` in `rig/lib/skills.js` to delegate to `skill-catalog.js` (recursive, full metadata, 55 entries, collision tie-break preserved).
- [ ] **1.8** Run `node --test tests/path-b-catalog.test.js -t "recursive sources"` — green.
- [ ] **1.9** Implement `scripts/build-skill-catalog.js` (writes `rig/catalog/skills/catalog.json`; `--check` fails on drift). Run it. Commit the generated file.
- [ ] **1.10** Run `node --test tests/path-b-catalog.test.js -t "AT-PB-1"` and `-t "AT-PB-3 generated"` — green.
- [ ] **1.11** Extend `runPayload` (`activeDelivery` branch) + `rig/manifest.json`: stage the 55-skill runtime shelf, copy `.rig/catalog.json`, restrict pre-approval projection to the 8 mandatory names (add `rig-onboarding` as a placeholder wrapper now — real playbook lands in Task 4; a stub `SKILL.md` pointing at `.rig/skills/onboarding/SKILL.md` is fine here), and add the user-edited-catalogue conflict guard.
- [ ] **1.12** Run `node --test tests/path-b-catalog.test.js` — all green.
- [ ] **1.13** Wire `build-skill-catalog.js --check` into the test gate (sibling of `scripts/check-versions.js`, or extend it). Run `node scripts/check-rule-copies.js && node scripts/check-versions.js`.
- [ ] **1.14** Run `npm test`. Fix fallout in `tests/rig-bootstrap.test.js` and any skill-count / discovery-path assertions caused by the "only 8 mandatory projected pre-approval" change and the source relocation. Do **not** weaken a Path B assertion to do it; adjust the non-frozen tests / manifest to the new true behavior and record why in a wiki trace.
- [ ] **1.15** File a `wiki/reasoning/2026-09-01-path-b-slice1-catalogue.md` trace, update `wiki/topics/the-catalogue.md` + `onboarding-flow.md` + `wiki/index/decisions.md`, run `node scripts/build-wiki-index.js`. Commit.

---

## Task 2: Structural inventory + overlap surface (S-1, S-2)

Deliverable: `tests/path-b-inventory.test.js` fully green (9 tests). `prepare` renders `adopted-config.md` + `overlaps.md`; no semantic decisions.

**Files:**
- Modify: `rig/lib/inspect.js` (add `inventoryHarness`), create `rig/lib/adapt-overlap.js`.
- Consumed by Task 3's `handleOnboarding({action:'prepare'})` — but the two writer functions must be independently testable.
- Test: `tests/path-b-inventory.test.js` (frozen).

**Interfaces:**
- `inventoryHarness(target) -> { schema_version: 1, digest, entries: [...], warnings: [...] }`
  - `entries[]`: `{ path, host, kind, name, title, headings: string[], capability_tags: string[], bytes, sha256 }`, unique + sorted by POSIX `path`.
  - `kind` mechanically mapped from the known root: root instruction names + Copilot file → `instruction`; rules dirs → `rule`; Kiro steering → `steering`; skill `SKILL.md` → `skill`; other file below a skill dir → `skill-asset`; `hooks` → `hook`; unknown known-root file → `other`. `host` from the existing registry/path mapping. `AGENTS.md` → `{ kind:'instruction' }`; `.agents/rules/*` → `rule`; `.agents/skills/x/SKILL.md` → `{ kind:'skill', host:'codex' }`; `.claude/skills/x/SKILL.md` → `{ host:'claude' }`; `.agents/skills/x/reference.md` → `skill-asset`; `hooks/*.json` → `hook`.
  - `name`: skill frontmatter `name` else basename. `title`: frontmatter `title`/`name` → first ATX heading → basename. `headings`: ATX heading text only. `capability_tags`: **only** from valid self-declared `capability` + `overlap_tags`, sorted (e.g. `['code-review','pull-request','review.code-and-pull-request']`). **No body prose or secret string may appear anywhere in the object** — run existing redaction + whitespace normalisation on every extracted string.
  - `digest === sha256(canonical({ entries, warnings }))`. Repeated calls byte-identical.
  - `warnings[]`: `{ path, code: 'oversized'|'unreadable'|'non-utf8'|'malformed-frontmatter', detail }` — `detail` redacted (must not echo file bytes). 256 KiB bound enforced.
  - **Throws** (no partial output) on: a symlink under a harness dir that resolves outside the repo (`/outside|escape|symlink/i`); two aliases resolving to one real path (`/duplicate|alias|real path/i`). Follows **one** contained symlink to a repo-internal path without inventing a second entry and without inventorying the link target's own directory.
- `adopted-config.md` (rendered by `prepare`, deterministic): title; one sentence "structural inventory, not an endorsement"; inventory digest + counts; `Configuration` table header exactly `Path | Host | Kind | Name | Capability tags | Bytes | SHA-256`; `Warnings` table `Path | Code | Detail` or `None.`; rows sorted by path.
- `overlaps.md` (rendered by `prepare`): title; one sentence that matches are hints / code takes no action (`/matches are hints/i`); `Tagged overlaps` grouped by existing path then Rig capability (`Existing path | Match tags | Rig capability | Rig skills`); `Unmapped existing entries`; `Rig capabilities without a declared match`. Rows lexical.
- Overlap match rule (S-2): for inventory entry `e`, `E(e) = declared capability/tags ∪ exact aliases resolved via migrations for e.name`; for Rig skill `r`, `R(r) = { r.capability } ∪ r.overlap_tags ∪ r.aliases`. Match iff `E(e) ∩ R(r) ≠ ∅`. No unknown-prefix stripping, no filename/heading/body-keyword inference. Multiple skills under one capability listed together (not duplicates). Third set = `all Rig capabilities − matched Rig capabilities`; informational, not an install list. Zero selection/mutation side effects; `state.applied.skills`/`grafts` stay `[]`, `state.proposal` stays `null`, `AGENTS.md` byte-identical, response `next_action === 'inspect-repository'`.

**Steps:**

- [ ] **2.1** Read `tests/path-b-inventory.test.js`. Note the `skill()` fixture helper and the exact expected `kind`/`host`/`capability_tags`/`headings` values.
- [ ] **2.2** Implement `inventoryHarness` in `rig/lib/inspect.js` reusing `collectHarnessFiles` enumeration + bound + hashing + redaction + containment. Add the mechanical `kind` map.
- [ ] **2.3** Run `node --test tests/path-b-inventory.test.js -t "AT-PB-7 inventory covers"` and `-t "declared metadata"` — green.
- [ ] **2.4** Add the malformed/oversized/non-utf8 warning path and the escaping-symlink / duplicate-real-path throws. Run `-t "AT-PB-7 inventory bounds"`, `-t "rejects escaping"`, `-t "one contained symlink"` — green.
- [ ] **2.5** Implement `rig/lib/adapt-overlap.js` (`buildOverlaps(inventory, catalog, migrations) -> { tagged, unmapped, unmatchedRigCapabilities }`) — pure, deterministic, no I/O.
- [ ] **2.6** Add the `adopted-config.md` and `overlaps.md` renderers (put them in `rig/lib/onboarding-state.js` or a `rig/lib/renderers.js` sibling — they are pure `object -> string`). These are exercised through `prepare` in Task 3 but unit-test them mentally against the table-header regexes now.
- [ ] **2.7** Run `node --test tests/path-b-inventory.test.js` — the two `AT-PB-8` tests still need `prepare` (Task 3). Everything else green.
- [ ] **2.8** Wiki trace `2026-09-01-path-b-slice2-inventory.md`, update `wiki/topics/onboarding-flow.md`, rebuild index, commit.

---

## Task 3: Onboarding state machine + prepare/propose (F-4, half of F-5)

Deliverable: `tests/path-b-state.test.js` fully green (6 tests) and the `AT-PB-8` prepare-dependent tests in `path-b-inventory.test.js` green.

**Files:**
- Create: `rig/lib/onboarding-state.js`, `rig/lib/onboarding.js` (actions `prepare` + `propose` only; `apply`/`check` are Task 4).
- Test: `tests/path-b-state.test.js`, plus `tests/path-b-inventory.test.js` `AT-PB-8` cases (frozen).

**Interfaces:**
- `handleOnboarding(request)` discriminated union (technical spec §7.3):
  ```
  PrepareRequest = { schema_version:1, action:'prepare', target }
  ProposeRequest = { schema_version:1, action:'propose', target, expected_revision:int>0,
                     proposal: ProposalWithoutDigest, summary_markdown }
  ApplyRequest   = { schema_version:1, action:'apply',  target, expected_revision:int>0, approval }
  CheckRequest   = { schema_version:1, action:'check',  target, expected_revision:int>0 }
  ```
- Response envelope (every action):
  ```json
  { "schema_version":1, "action":"prepare|propose|apply|check", "phase":"<phase>", "revision":1,
    "proposal_digest":null,
    "artifacts": { "catalog":{"path":".rig/catalog.json","sha256":"…"},
                   "adopted_config":{…}, "overlaps":{…},
                   "grafts":{"path":".rig/grafts.md","sha256":"…|null"},
                   "summary":{"path":".rig/onboarding-summary.md","sha256":"…|null"},
                   "state":{"path":".rig/state.json","sha256":"…"} },
    "critical_decisions":[], "hard_failures":[], "warnings":[],
    "next_action":"inspect-repository|resolve-critical-decisions|obtain-approval|apply|check|complete|repair-and-resume" }
  ```
  `prepare` additionally returns `context: { playbook, catalog, adopted_config, overlaps }` (strings + the parsed catalogue object). Later actions return paths/digests only.
- `.rig/state.json` (sole machine authority — technical spec §6.3): keys exactly `['applied','approval','checks','inventory','last_error','phase','proposal','release','revision','schema_version']` (sorted). `phase ∈ {prepared, needs-decision, proposed, approved, applying, applied, checked, failed}`. `applied` starts `{ proposal_digest:null, skills:[], grafts:[], owned_files:[] }`. File bytes `` `${JSON.stringify(state, null, 2)}\n` ``. Atomic write, `revision` CAS.
- Proposal (stored non-null form) per technical spec §6.3: `{ digest, inventory_digest, catalog_digest, summary_digest, capabilities[], selected_skills[], grafts[], owned_files[], critical_decisions[] }`. `digest === sha256(canonical(body))` where `body` is the proposal without its `digest` key (test `path-b-state.test.js:52`). Capability rows sorted by `capability`; `selected_skills` lexical; `grafts` by `(path, capability)`; `owned_files` by path; `critical_decisions` by `id`.
- `onboarding-summary.md` must contain these headings **once, in order**: `# Rig onboarding summary`, then `## Existing state`, `## Rig interpretation`, `## Reuse`, `## Grafts and improvements`, `## New capabilities`, `## Important decisions`, `## Resulting pipeline`, `## Expected user experience`. Missing / duplicate / out-of-order → reject; prose not judged. `summary_digest === sha256(fileBytes)` and participates in `proposal.digest`.
- **`prepare`**: acquire lock; `inventoryHarness`; validate `.rig/catalog.json` (throw on malformed metadata / bad alias, writing no state); write `.rig/state.json` (`phase:'prepared'`, `revision:1` first time), `.rig/adopted-config.md`, `.rig/overlaps.md`. Re-run: unchanged inventory+catalogue → no-op, same `revision`, byte-identical reports. Changed inventory digest → `revision++`, `phase:'prepared'`, clears `proposal`/`approval`/`checks`. Works offline (no `$PATH` tools). No repo-owned write; no `onboarding-summary.md` / `grafts.md` yet. `next_action: 'inspect-repository'`.
- **`propose`**: `expected_revision` must equal current (`/revision|stale|compare/i` otherwise). Reject unknown proposal keys (`/unknown/i`), unsafe graft paths like `../AGENTS.md` (`/path|invalid/i`), and malformed summaries (`/summary|heading/i`) — **without** writing partial state or `onboarding-summary.md`. On success: write `onboarding-summary.md`, set `phase:'proposed'` (or `'needs-decision'` if any `critical_decisions[].status !== 'resolved'`), store canonical proposal + `summary_digest`. Identical proposal+summary → no-op, same `revision`. Changed proposal/summary → `revision++`, invalidate prior approval. `next_action: 'obtain-approval'` (or `'resolve-critical-decisions'`).
- Forbidden-transition throws (no state advance): `check` from `prepared`; `apply` from `prepared`; unknown `action`; `schema_version: 2` → all match `/action|phase|transition|proposal|schema|version/i`.

**Steps:**

- [ ] **3.1** Read `tests/path-b-state.test.js` and the two `AT-PB-8` tests in `path-b-inventory.test.js`. Note `STATE_KEYS`, the canonical-digest check, and the "no partial state" assertions.
- [ ] **3.2** Implement `rig/lib/onboarding-state.js`: state schema validation, `readState`/`writeState` (atomic, CAS on `revision`), transition table, proposal canonicalisation + digest, summary heading validator, and the `adopted-config.md`/`overlaps.md`/`grafts.md` renderers (grafts renderer used in Task 4).
- [ ] **3.3** Implement `rig/lib/onboarding.js` with `prepare` only. Wire lock, `inventoryHarness`, catalogue validation, `adapt-overlap`, report writes, response envelope, `context` payload.
- [ ] **3.4** Run `node --test tests/path-b-state.test.js -t "prepare creates"` and `path-b-inventory.test.js -t "AT-PB-7 prepare writes"` / `-t "AT-PB-8"` — green.
- [ ] **3.5** Add `propose` to `rig/lib/onboarding.js`: revision CAS, strict input validation (unknown keys, unsafe paths), summary validation, canonical proposal storage, `needs-decision` branch, idempotency, approval invalidation.
- [ ] **3.6** Run `node --test tests/path-b-state.test.js` — all 6 green (the `applyAndCheck` test needs Task 4; if it references `apply` it will still fail — note which and carry forward).
- [ ] **3.7** Run `node --test tests/path-b-inventory.test.js` — all 9 green.
- [ ] **3.8** Wiki trace `2026-09-01-path-b-slice3-state.md`, update `wiki/topics/onboarding-flow.md` + `specification-gate.md`, rebuild index, commit.

---

## Task 4: Safe graft primitive (F-2)

Deliverable: `tests/path-b-graft.test.js` fully green (6 tests). Parser + upsert + remove + journal `managed_grafts` + `uninstall` section-only removal.

**Files:**
- Modify: `rig/lib/payload.js` (add 3 exports over one parser), `rig/lib/lifecycle.js` (`graft_managed` ownership), `rig/lib/uninstall.js`. `rig/lib/graft.js` is reduced to this parser or removed once callers migrate.
- Test: `tests/path-b-graft.test.js` (frozen).

**Interfaces (technical spec §4.3):**
```
parseGraftSections(source: Buffer) -> {
  newline,
  sections: [{ capability, version: 1, start, end, content, content_digest }]
}
upsertGraftSection(target, { path, capability, version: 1, content, expected_file_digest }, writeFile)
  -> { changed, action: 'create'|'update'|'noop', file_digest }
removeGraftSection(target, { path, capability, expected_file_digest }, writeFile)
  -> { changed, action: 'remove'|'noop', file_digest|null }
```
- The test calls them as `operation(target, args, writer)` where `writer = journalWriter(target)` then `writer.finish()`. `content` is canonicalised to no leading/trailing blank line inside the envelope; marker text in `content` is rejected (`/content|marker|graft/i`).
- Owned byte range = from the open marker's first byte through the close marker's line ending. No surrounding byte normalised; file newline style preserved (CRLF and no-final-newline fixtures). `create` appends exactly one separator newline when required; clean `remove` deletes the range **and** that one separator, restoring the pre-graft outside bytes exactly (no whole-file snapshot restore).
- `parseGraftSections` **throws** on: unknown `version` (`"2"`); mismatched begin/end capability; orphan close; nested markers; two sections for one capability in one file; invalid UTF-8 (`/utf-?8|encoding|invalid/i`). Other errors match `/graft|marker|version|nested|mismatch/i`.
- `upsertGraftSection` **throws**, changing no byte, on: stale `expected_file_digest` (`/stale|digest|preimage/i`); non-Markdown target path like `config.json` (`/unsupported|markdown|file type/i`, and does not create the file); symlink target (`/symlink|link|ambiguous/i`); hard-linked target (`/hard.?link|link|ambiguous/i`).
- Journal: the latest `applied` record for a grafted path carries `managed_grafts: [{ capability, version: 1, content_digest }]` describing **every** current Rig section in that path (not just the one just changed) — so a two-capability file's last record lists both, `.sort()`-comparable by capability (test line 194). Records are read from `.rig/install-manifest.jsonl`.
- `uninstall(target)` returns `{ status: 'removed', ... }` and, for a `graft_managed` path, removes only the capabilities in the latest record — even when the user edited a managed body — while preserving user edits **outside** the sections and appended after them. Test: user changes `TDD body.` → `User-edited managed body.` and appends a line; after uninstall the file equals `<original user bytes> + "User edit after onboarding.\n"`.

**Steps:**

- [ ] **4.1** Read `tests/path-b-graft.test.js`. Note `mutate()` (journalWriter + finish), the `CAPABILITY`/`SECOND` constants, and the malformed-body table.
- [ ] **4.2** Implement `parseGraftSections` (one bounded line scanner; strict grammar; all throw cases). Run `-t "malformed ownership"` marker/utf8 asserts — green for the pure-parse portion.
- [ ] **4.3** Implement `upsertGraftSection` (CAS on `expected_file_digest`, Markdown-only guard, symlink/hard-link refusal via `path-safety`/`fs.lstat`+`fs.stat` nlink, content canonicalisation, journal write). Run `-t "create update and reapply"` — green.
- [ ] **4.4** Implement `removeGraftSection` (range + one separator; idempotent noop when state already records absent). Run `-t "one-of-many removal"` and `-t "CRLF and no-final-newline"` — green.
- [ ] **4.5** Extend `journalWriter` to accumulate and emit `managed_grafts` (full current set per path). Run `-t "journal records every current section"` up to the `records.at(-1).managed_grafts` assert — green.
- [ ] **4.6** Add `graft_managed` to `rig/lib/lifecycle.js` ownership classes and teach `rig/lib/uninstall.js` section-only removal with user-edit preservation. Run `-t "journal records every current section"` fully — green.
- [ ] **4.7** Run `node --test tests/path-b-graft.test.js` — all green. Run `npm test` — fix any `graft.js` caller regressions (keep `tests/*` green).
- [ ] **4.8** Wiki trace `2026-09-01-path-b-slice4-graft.md`, update `wiki/topics/graft-mechanics.md` + `install-manifest-removal.md` + `wiki/index/invariants.md`, rebuild index, commit.

---

## Task 5: Onboarding vertical slice — apply/check + CLI + MCP + one router/playbook (F-5, S-3)

Deliverable: `tests/path-b-onboarding.test.js` (8 tests) and `tests/path-b-mcp.test.js` (6 tests) fully green.

**Files:**
- Modify: `rig/lib/onboarding.js` (add `apply` + `check`), `rig/lib/cli-advanced.js` + `rig/bin/rig` (the `onboarding` subcommand), `rig-mcp/index.js` (+ `rig/mcp-runtime` install source), `rig/manifest.json` (canonical playbook + wrappers + installed MCP + runtime lib).
- Create: `rig/tier-1/skills/onboarding/SKILL.md` (canonical playbook) + native wrappers; installed `.rig/runtime/rig/lib/onboarding.js` payload path.
- Test: `tests/path-b-onboarding.test.js`, `tests/path-b-mcp.test.js` (frozen).

**Interfaces:**
- Canonical playbook `.rig/skills/onboarding/SKILL.md` body must contain, in order, the seven step headings so both regexes match: `/Understand[\s\S]*Discover[\s\S]*Catalogue-read[\s\S]*Delta[\s\S]*Propose[\s\S]*Summarise[\s\S]*Apply on approval/` (technical spec §7.1). `prepare`'s `context.playbook` returns these exact installed bytes (`tests/path-b-mcp.test.js:132`).
- `.rig/routing.md` remains the only always-on pipeline mandate; its body keeps the phrase sequence `/Grilling …Business Specifications …Acceptance Criteria …Tests …Technical Specifications …LOCK …Test-Driven Development …Verification/i`. Host adapters (`.agents/rules/rig.md`, `CLAUDE.md`) contain `.rig/routing.md` and **must not** re-embed the `Business Specifications …Acceptance Criteria …Technical Specifications` sequence. Native `rig-onboarding` wrappers (`.agents/skills/rig-onboarding/SKILL.md`, `.claude/skills/rig-onboarding/SKILL.md`) contain `.rig/skills/onboarding/SKILL.md` and must not re-embed `Catalogue-read …Apply on approval`. Across every non-runtime instruction file exactly one carries the full router sequence and exactly one carries the full playbook sequence (`tests/path-b-mcp.test.js:115-118`). Every `` `.rig/...` `` reference in an adapter/wrapper resolves on disk.
- **`apply`** (ApplyRequest): `approval` must be a `plan-approval` receipt whose `plan_digest === state.proposal.digest`; `{ method: 'host-native', verified: true }` with no `plan_digest` is rejected (`/approval|receipt|digest/i`). Any unresolved critical decision blocks (`/decision|unresolved|approval/i`). A receipt bound to a superseded `proposal_digest` after the proposal changed is rejected (`/approval|digest|stale|summary/i`). On success: acquire lock, preflight, then write only the selected skill projections (canonical name; `.agents/skills/rig-qa/SKILL.md` with `^name: rig-qa$`; **not** `rig-qa-only`), the approved marked grafts (via `upsertGraftSection`), and approved `owned_files`; set `phase:'applied'`, `next_action:'check'`; record `applied.skills` / `applied.grafts` / `applied.owned_files` / `applied.proposal_digest`. Idempotent re-apply on the same revision+digest is a no-op (byte-identical tree; exactly one graft section). Partial apply is resumable on identical approved bytes.
- **`check`** (CheckRequest): reconcile `.rig/` Markdown projections + state + catalogue + summary + journal + disk. Reaches `phase:'checked'`, `checks.status:'pass'`, `next_action:'complete'` only with zero hard failures (warnings allowed). `grafts.md` render must contain `state.applied.proposal_digest` and, per row, `skill.*path` and `capability.*path` substrings; its sha256 equals `response.artifacts.grafts.sha256`. Hard-failure behaviour is Task 6.
- CLI: `.rig/bin/rig onboarding --input <request.json>` writes `JSON.stringify(response)` to stdout, exit 0 on success. `JSON.parse(cli.stdout)` deep-equals `handleOnboarding(request)` (`tests/path-b-onboarding.test.js:157-171`).
- MCP: `rig-mcp/index.js` registers tool `rig_onboarding`; `inputSchema` JSON contains `"prepare"|"propose"|"apply"|"check"`; publishes `outputSchema`; `annotations` deep-equals `{ readOnlyHint:false, destructiveHint:true, idempotentHint:true, openWorldHint:false }`. `callTool({name:'rig_onboarding', arguments:request}).structuredContent` deep-equals the domain response for root **and** the installed copy `.rig/runtime/rig-mcp/index.js`; `content[0].text` includes the `next_action` token. Listing tools must not create `.rig/state.json`.

**Steps:**

- [ ] **5.1** Read both frozen test files. Note the fixture proposal in `tests/helpers/path-b.js` (`proposal()`, `summary()`, `approval()`, `applyAndCheck()`) — your `apply`/`check` must satisfy exactly that flow: capability `testing.web-quality-assurance`, skill `qa`, graft into `AGENTS.md`.
- [ ] **5.2** Author `rig/tier-1/skills/onboarding/SKILL.md` (seven-step playbook, technical spec §7.1 + §7.2 critical-decision predicate). Add native wrappers. Add manifest ops so install lands the canonical file, the wrappers (8-mandatory projection already includes `rig-onboarding`), and `.rig/runtime/rig/lib/onboarding.js` (+ its `require` graph) and `.rig/runtime/rig-mcp/`.
- [ ] **5.3** Implement `apply` in `rig/lib/onboarding.js`. Run `node --test tests/path-b-onboarding.test.js -t "approved apply selectively projects"` — green.
- [ ] **5.4** Implement `check` (happy path + `grafts.md` render + reconciliation). Run `-t "applied Markdown projections"` (in `path-b-state.test.js`) and `-t "approved apply"` — green.
- [ ] **5.5** Run the approval-binding / critical-decision / idempotent-resume tests (`-t "unresolved consequential"`, `-t "approval binds the exact proposal"`, `-t "identical approved apply is idempotent"`) — green.
- [ ] **5.6** Add the `onboarding` subcommand to `rig/lib/cli-advanced.js` + `rig/bin/rig` (read `--input`, call `handleOnboarding`, print JSON, exit non-zero on `phase === 'failed'`). Run `-t "installed CLI is a JSON adapter"` — green.
- [ ] **5.7** Register `rig_onboarding` in `rig-mcp/index.js` (thin adapter; text render helper in `rig-mcp/instructions.js` or sibling). Ensure the installed copy source stays byte/behaviour identical (existing rig-mcp parity test). Run `node --test tests/path-b-mcp.test.js` — green.
- [ ] **5.8** Adjust `.rig/routing.md` source + host adapter templates + `rig-onboarding` wrappers so the "exactly one file carries each sequence" and "pointer resolves" assertions pass. Run `-t "AT-PB-9"` (both) — green.
- [ ] **5.9** `node --test tests/path-b-onboarding.test.js tests/path-b-mcp.test.js tests/path-b-state.test.js` — all green. `npm test --prefix rig-mcp`. Then `npm test`.
- [ ] **5.10** Wiki trace `2026-09-01-path-b-slice5-vertical.md`; update `wiki/topics/onboarding-flow.md`, `what-rig-is.md`, `services-and-reports.md`, `wiki/index/decisions.md`; rebuild index; commit.

---

## Task 6: Operator path — `install rig` (F-6)

Deliverable: `tests/path-b-install.test.js` fully green (4 tests).

**Files:**
- Create: repo-root `install` (executable POSIX `sh`).
- Modify: `install.sh` (host arg pass-through) and `rig/bootstrap.sh` (`--host` repeatable → `--hosts`, final message, always `--with-runtime`).
- Test: `tests/path-b-install.test.js` (frozen).

**Interfaces:**
- `install` invoked as `sh install rig [--version <tag>] [--target <path>] [--host <id>]...` and `sh install --help`.
  - `--help` (exit 0) prints `install rig` and `--host <host>`, and must **not** print `--tier` / `Basic` / `Advanced install`.
  - `rig` is a required operand (not a tier). No `--host` → detection preserved (`.claude` present → `.claude/skills/rig-onboarding/SKILL.md` installed, `.agents` absent). Repeated `--host codex --host claude --host codex` → de-duped first-seen: stdout has one `host: codex` then `host: claude` (codex index < claude index), and explicit hosts **replace** detection (`.cursor` present but no `.cursor/rules/rig.mdc` written).
  - Unknown `--host invented-host` → non-zero exit, message matches `/unknown host|invented-host/i`, and **no** `.rig/` directory or `AGENTS.md` change (fail before any target write).
  - Always installs runtime + catalogue + 8 mandatory skills + canonical router/adapters + 55-skill runtime shelf. Never writes `.rig/state.json` or `.rig/onboarding-summary.md`. `AGENTS.md` stays byte-identical.
  - Success stdout matches `/Rig is installed\. In your host agent, invoke rig-onboarding for this repository\./` and `/Nothing is adapted until you approve its onboarding summary\./`.
- The test drives `install` through `installFixture()` which stubs `curl` to copy a local tarball; `runInstall` calls `sh <launcher> rig --version v5.0.0 --target <t> [args]`. Host validation happens in `bootstrap.sh` against the existing host registry; make sure the unknown-host check runs **before** `runPayload`.

**Steps:**

- [ ] **6.1** Read `tests/path-b-install.test.js` incl. `installFixture`/`targetUnder`/`runInstall`. Note the launcher is `path.join(root, 'install')` and must be executable.
- [ ] **6.2** Write `install`: parse `rig` operand + `--version`/`--target`/`--host` (repeatable), reject unknown flags, forward to `install.sh` (or directly to `bootstrap.sh` for the unpacked path) with de-duped `--hosts a,b` and always `--with-runtime`.
- [ ] **6.3** Add `--host` (repeatable) handling to `rig/bootstrap.sh`: validate each against the host registry **before** any write, de-dupe first-seen, emit `host: <id>` lines, set the final two-line message. Route "no --host" to existing detection.
- [ ] **6.4** `chmod +x install`. Run `node --test tests/path-b-install.test.js` — iterate to green.
- [ ] **6.5** Update README quick start + install docs to the single `install rig [--host <host>]` command + the explicit `rig-onboarding` next step + "no auto-trigger" (technical spec §8.2). Keep `install.sh`/`bootstrap.sh` documented as subordinate diagnostic paths.
- [ ] **6.6** `npm test` (watch `tests/rig-bootstrap.test.js`). Wiki trace `2026-09-01-path-b-slice6-operator.md`, update `wiki/topics/distribution-and-release.md` + `delivery-plan.md`, rebuild index, commit.

---

## Task 7: Failure & weight closure (S-4)

Deliverable: `tests/path-b-weight.test.js` fully green (11 tests: 1 warn-only, 9 hard-failure codes, 1 legitimate-staging).

**Files:**
- Create: `rig/lib/onboarding-check.js`. Modify: `rig/lib/onboarding.js` `check` to call it; `rig/bin/rig` / `cli-advanced.js` `check` exit non-zero on hard failure.
- Test: `tests/path-b-weight.test.js` (frozen).

**Interfaces (technical spec §12):**
- Weight from latest applied journal: `files` = distinct existing paths with a current Rig-owned write or Rig graft; `bytes` = full bytes of Rig-owned files + only managed-section bytes of repo-owned files + journal/preimage overhead. Compare with `catalog.soft_budget` (`{ basis, files, bytes }`, set by the test via `setSoftBudget`). If a previous-release budget is present and a total grew → emit `payload-file-growth` and/or `payload-byte-growth` warnings (old/new/delta). Zero/missing baseline → still report totals, no threshold warning. **No weight value changes exit status.** `checks.weight` = `{ files, bytes, previous_release_files, previous_release_bytes }`; `state.checks.weight.files > 1` and `.bytes > 1` in the warn test.
- `checks` block: `{ status:'pass'|'fail', hard_failures:[{code,path|null,detail}], warnings:[{code,detail}], weight:{…} }`.
- Hard-failure codes — each independently seeded by `CORRUPTIONS` in the test; each must produce `result.phase === 'failed'`, `result.next_action === 'repair-and-resume'`, `codes(result).has(<code>)`, and a **non-zero CLI exit**:
  - `duplicate-destination` — two applied skill rows resolve to the same path.
  - `duplicate-skill-projection` — same canonical skill twice in one host discovery scope.
  - `duplicate-graft` — a path has >1 section for one capability (appended duplicate section).
  - `malformed-graft` — orphaned / mismatched / nested / unknown-version marker on disk (close capability changed to `testing.other`).
  - `dangling-reference` — a canonical router/wrapper reference does not resolve (`.rig/routing.md` deleted).
  - `skill-name-mismatch` — installed dir vs rewritten frontmatter `name` differ (`rig-qa` → `name: wrong-name`).
  - `self-prefix-regression` — canonical `rig` projected as `rig-rig` (dir `.agents/skills/rig-rig` with `name: rig-rig`).
  - `state-incomplete` — required state file absent (`onboarding-summary.md` removed) / digests disagree.
  - `unapproved-write` — a projection/graft on disk not in the approved proposal/journal (`.agents/skills/rig-qa-only` created).
- Not failures: one staged non-discoverable runtime source + one approved native projection; legitimate projections into distinct approved host scopes (multi-host install) — reported, not failed.

**Steps:**

- [ ] **7.1** Read `tests/path-b-weight.test.js` incl. `setSoftBudget`, `CORRUPTIONS`, `recheck`.
- [ ] **7.2** Implement `rig/lib/onboarding-check.js` weight computation + budget warnings. Run `-t "file and byte growth warn"` — green.
- [ ] **7.3** Implement the nine hard-failure detectors (each a small pure predicate over state + disk + journal). Wire into `check`: any hard failure → `phase:'failed'`, `next_action:'repair-and-resume'`, `checks.status:'fail'`.
- [ ] **7.4** Make `rig onboarding --input` exit non-zero when the response `phase === 'failed'`. Run the parametrised `-t "is a hard failure"` tests — green (all 9).
- [ ] **7.5** Run `-t "legitimate runtime staging"` (multi-host) — green. Then `node --test tests/path-b-weight.test.js` — all green.
- [ ] **7.6** Integrate the same checker into the installed `rig check` command surface (technical spec §12 says it's shared). Keep existing `rig check` tests green.
- [ ] **7.7** Wiki trace `2026-09-01-path-b-slice7-checks.md`, update `wiki/topics/testing-strategy.md` + `trust-and-failure-boundaries.md` + `wiki/index/traps.md` (reproduce the historical double-write / dangling-implementation / `rig-rig` regressions as named guarded invariants), rebuild index, commit.

---

## Task 8: Full gate + re-baseline evidence

Deliverable: `npm test` green top to bottom; a dense multi-host adaptation run recorded as product evidence.

**Steps:**

- [ ] **8.1** `node --test tests/path-b-*.test.js` — 55/55 green.
- [ ] **8.2** `npm test` — green. Triage every non-Path-B failure: it is either a real regression you introduced (fix the code) or a non-frozen test/manifest that legitimately must change to match new true behavior (change it, and record why in a wiki trace). Never edit a `wiki/gate1/testing-infrastructure.manifest` file.
- [ ] **8.3** `node scripts/check-advanced-spec.js` still exits 0 with "14 files, 83 acceptance cases" — the oracle is untouched.
- [ ] **8.4** Run Rig's own adaptation eval: `install rig` onto `inspp/claude-task-master-main` (or the current eval target), then drive `rig-onboarding` end to end in a host agent. Record the score against the frozen rubric (RIG-156 / `wiki/reasoning/2026-08-30-adaptation-eval-*`). This is evidence, not a gate.
- [ ] **8.5** Final wiki pass: move `wiki/status.md`/`Home.md` "signature pending" text to "Path B oracle signed 2026-08-31; implementation landed"; update `wiki/topics/the-two-gates.md`, `delivery-plan.md`; `node scripts/build-wiki-index.js`. Update `wiki/index/acceptance-cases.md` to show AT-PB-1..10 traced to their now-green tests.
- [ ] **8.6** `superpowers:finishing-a-development-branch` — open the PR against `qa-prod` (`gh pr create --base qa-prod`). PR body: the slice list, the frozen-oracle statement, and the adaptation-eval score.

---

## Integration risks (call these out in your first wiki trace; none reopens intent)

- **Pre-approval projection drops from 55 → 8.** `installVendoredSkillsOp` currently fans all 55 vendored skills into `.claude/skills/` / `.agents/skills/`. Path B makes only the 8 mandatory discoverable until onboarding approves more. `tests/rig-bootstrap.test.js` and any "skill count in discovery tree" assertion will move — update the non-frozen tests + `rig/manifest.json` to the new true behavior, don't fight it.
- **Source relocation** of 55 skill dirs into the capability hierarchy will touch `scripts/check-rule-copies.js` expectations and any hard-coded `rig/catalog/skills/<name>` path. Grep before moving.
- **`.claude`/`.agents` skill payload parity** (`CLAUDE.md`: their payloads must stay identical) still holds for the projected set.
- **Runtime size:** the 55-skill `.rig/runtime/rig/catalog/skills/` shelf is large but non-discoverable; S-4 counts it as staging, not a duplicate. Do not try to trim it.
- **`connect-chrome` / `open-rig-browser`** both currently declare `name: open-rig-browser`. The migration must make `connect-chrome`'s frontmatter declare `connect-chrome` (its existing tie-break name) so canonical names are unique; both stay as two skills in `browser-and-research.browser-session`.
- **`rig` self-prefix:** canonical `rig` must never project as `rig-rig` (existing `rewriteSkillName` handles this; S-4 `self-prefix-regression` guards it).

---

## Self-Review (run against the spec before handing off)

**Spec coverage** — every AT-PB case maps to a task:

| Case | Contract | Task | Primary frozen test |
|---|---|---|---|
| AT-PB-1 | F-1 skill shelf complete/coherent/separate | 1 | `path-b-catalog.test.js` |
| AT-PB-2 | F-2 marked removable grafts | 4 | `path-b-graft.test.js` |
| AT-PB-3 | F-3 deterministic pinned non-discoverable catalogue | 1 | `path-b-catalog.test.js` |
| AT-PB-4 | F-4 strict atomic truthful state | 3 | `path-b-state.test.js` |
| AT-PB-5 | F-5 agent proposes / one engine validates+applies | 3 + 5 | `path-b-onboarding.test.js`, `path-b-mcp.test.js` |
| AT-PB-6 | F-6 one explicit install command | 6 | `path-b-install.test.js` |
| AT-PB-7 | S-1 bounded structural inventory | 2 | `path-b-inventory.test.js` |
| AT-PB-8 | S-2 exact-match overlap advice | 2 + 3 | `path-b-inventory.test.js` |
| AT-PB-9 | S-3 one router + one playbook | 5 | `path-b-mcp.test.js` |
| AT-PB-10 | S-4 warn-only weight + closed hard-failure set | 7 | `path-b-weight.test.js` |

**Placeholder scan:** every code step points at a frozen test as its literal acceptance check and quotes the schema/signature/marker/failure-code verbatim from `wiki/reasoning/2026-08-31-path-b-technical-spec.md`. No task says "add error handling" without naming the exact throw regex the frozen test asserts.

**Type consistency:** `handleOnboarding` request union, response envelope, `.rig/state.json` key set, proposal shape, `parseGraftSections`/`upsertGraftSection`/`removeGraftSection` signatures, `inventoryHarness` shape, `catalog.json` shape, and the nine S-4 failure codes are defined once here and used unchanged downstream. `next_action` token set is fixed: `inspect-repository`, `resolve-critical-decisions`, `obtain-approval`, `apply`, `check`, `complete`, `repair-and-resume`. `phase` set is fixed: `prepared`, `needs-decision`, `proposed`, `approved`, `applying`, `applied`, `checked`, `failed`.

**Known deviation from writing-plans defaults:** implementation-body code is **not** transcribed in full. The 10 frozen `tests/path-b-*.test.js` files plus the 1260-line technical spec already fix every observable contract byte-for-byte, and the repo's own rule (`CLAUDE.md`, `rig-implementation`) is to write the laziest thing that makes the frozen test pass. Reproducing invented final code here would lower fidelity and risk contradicting the signed oracle. Each task therefore hands the executor: exact files, exact interface contracts, the red test command, the expected failure, and the green test command.
