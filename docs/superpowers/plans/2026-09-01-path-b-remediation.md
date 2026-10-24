# Path B — Adaptive Onboarding Remediation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development. Every task is a red→green→refactor→commit loop against the frozen oracle (83 cases, 14 files) — do not break it. New adversarial test files are NOT in the frozen manifest and may be freely created.

**Goal:** Fix 13 correctness defects found by the `rig-debugging` triage of the Path B vertical slice (see `.context/attachments/9igqGp/pasted_text_2026-09-01_13-41-25.txt` for the full triage report). Defects 2 (approval authentication) and 12 (duplicate-name silent rename) are blocked on a human signing ceremony and are tracked in the questionnaire, not here.

**Authority:**
- Triage source: `.context/attachments/9igqGp/pasted_text_2026-09-01_13-41-25.txt` — each task header maps to one "why it fails" section; the triage is the source of truth for each defect and its remediation steps.
- Technical spec: `wiki/reasoning/2026-08-31-path-b-technical-spec.md`
- Signed oracle (frozen, 83 cases): `wiki/gate1/testing-infrastructure.manifest`
- Gate script: `node scripts/check-advanced-spec.js` — must remain exit 0 after every task.

---

## Global Constraints

Every task inherits these. Do not re-read them per task — they are fixed for the branch.

- **Frozen oracle is inviolable.** `node scripts/check-advanced-spec.js` must remain exit 0 ("83 acceptance cases") after your commit. Every file in `wiki/gate1/testing-infrastructure.manifest` is byte-frozen: do not modify `tests/path-b-*.test.js`, `tests/advanced-*.test.js`, `tests/helpers/path-b.js`, `tests/helpers/advanced.js`, `scripts/check-advanced-spec.js`, or `wiki/gate1/package-scripts.json`. New test files (e.g. `tests/path-b-adversarial.test.js`, `tests/path-b-hardening.test.js`) are not in the manifest and are freely created.
- **New tests are the spec.** Write a failing test that captures the triage's reproduced failure BEFORE fixing production code. Commit test + fix together after both are green.
- **Node.js stdlib only.** `node:crypto`, `node:fs`, `node:path`, `node:test`. No new npm deps.
- **JSON discipline:** `schema_version: 1`, UTF-8, LF line endings, two-space indent, exactly one trailing newline.
- **Digests:** lowercase SHA-256 hex. Canonical JSON: keys sorted recursively, semantically-ordered arrays kept, order-irrelevant lists sorted.
- **Path safety:** POSIX repo-relative paths only. Reuse `rig/lib/path-safety.js`.
- **No apply concurrency breach.** The existing `.rig/onboarding.lock` contract is unchanged.
- **Governed catalogue is untouchable.** `rig/catalog.json` and `rig/catalog/services/**` stay byte-identical. `tests/path-b-catalog.test.js` pins their combined SHA-256.
- **Inner loop:** `node --test tests/path-b-<area>.test.js` + your new test file. **Full gate before commit:** `npm test` (runs `check-advanced-spec.js` + `test:code`). Never commit on red.
- **Wiki cadence:** file a dated reasoning trace under `wiki/reasoning/` at least every three minutes of active work and run `node scripts/build-wiki-index.js`. Update topic hubs and `wiki/index/decisions.md` per `wiki/reasoning/README.md`.
- **`tests/path-b-hardening.test.js` is a shared file** — Task 1 created it; Tasks 2–13 APPEND new tests to it. Read its current content before adding tests; do not re-write the header.

---

## Task 1 — Documentation consistency fix

**Triage section:** "Current documentation contradicts the signed state"

**Why it fails:** Two manually-maintained status statements still say the adaptive acceptance amendment is "red" or "awaiting signature," while `check-advanced-spec.js` exits 0. The signed oracle and generated current-status page are correct; two other files disagree.

**Status: COMPLETE** (commits `0c654d4b`, `aae4958f`, `4ea41d93`, `f0d2cc0d`, `e756b3af`)

---

## Task 2 — Single playbook write per mode

**Triage section:** "The canonical onboarding playbook is written twice"

**Why it fails:** Installation first writes a wrapper to the canonical destination, then in adaptive mode overwrites it with the full playbook — producing two applied journal records for the same destination.

**Acceptance criteria (add to `tests/path-b-hardening.test.js`):**
- In adaptive (Path B) install: exactly one applied journal record for the canonical onboarding playbook destination. Assert `records.filter(r => r.dest === PLAYBOOK_DEST && r.status === 'applied').length === 1`.
- In legacy (non-adaptive) install: the wrapper is written and the full playbook is NOT. Assert the reverse.
- `node --test tests/path-b-install.test.js tests/path-b-hardening.test.js` green.

**Files to touch:**
- `rig/lib/payload.js` — remove the unconditional wrapper write; keep it only on the legacy path.
- `tests/path-b-hardening.test.js` — append the two install-mode journal-record tests.
- `wiki/reasoning/2026-09-01-path-b-remediation-t2-playbook.md` (new trace)

**Do not touch:** `tests/path-b-install.test.js` (frozen).

---

## Task 3 — Adaptive install gating for instruction-only hosts

**Triage section:** "The adaptive install exposes all skills on instruction-only hosts"

**Why it fails:** The adaptive gate was placed on Claude and Codex optional-skill projections, but the neutral optional shelf remains unconditional. Instruction-only hosts (Cursor, etc.) discover all 63 skills before approval.

**Acceptance criteria (add to `tests/path-b-hardening.test.js`):**
- For each instruction-only host (Cursor, GitHub Agent, OpenCode, Devin — use the host registry): after `install rig --host <host>`, exactly 8 mandatory skills are discoverable. Assert `discoverable.length === 8`.
- The 55-skill staged shelf is present but NOT inside any host discovery root.
- `node --test tests/path-b-install.test.js tests/path-b-hardening.test.js` green.

**Files to touch:**
- `rig/lib/payload.js` — make neutral optional-skill fan-out conditional on `activeDelivery === 'legacy'` (or equivalent).
- `rig/lib/host-capabilities.js` — add/verify instruction-only host classification.
- `tests/path-b-hardening.test.js` — append matrix test per instruction-only host.
- `wiki/reasoning/2026-09-01-path-b-remediation-t3-install-gate.md` (new trace)

**Do not touch:** `tests/path-b-install.test.js` (frozen).

---

## Task 4 — Strict state decoder

**Triage section:** "Persisted state is not strictly decoded"

**Why it fails:** `readState` checks schema version, revision, and top-level required keys but accepts extra keys and does not validate phase enums, nested proposals, approvals, applied rows, or cross-field invariants. An injected unknown field survives into the next transition.

**Acceptance criteria (add to `tests/path-b-hardening.test.js`):**
- Injecting an unknown top-level key into `.rig/state.json` and then calling any onboarding action throws with a validation error. Test for at least: unknown top-level key, invalid phase enum, proposal present in wrong phase, applied-digest present without applied phase, invalid digest format (non-hex).
- The strict decoder is used by ALL onboarding actions (prepare, propose, apply, check).
- `node --test tests/path-b-state.test.js tests/path-b-hardening.test.js` green.

**Files to touch:**
- `rig/lib/onboarding-state.js` — add strict decoder function called from `readState`.
- `tests/path-b-hardening.test.js` — append ≥5 strict-decode rejection tests.
- `wiki/reasoning/2026-09-01-path-b-remediation-t4-strict-decode.md` (new trace)

**Do not touch:** `tests/path-b-state.test.js` (frozen).

---

## Task 5 — Repository inventory from host registry

**Triage section:** "Repository inventory omits supported host roots"

**Why it fails:** `inventoryHarness` uses a hard-coded set of scan roots rather than the full host registry. Cursor's skill root, GitHub agent definitions, OpenCode agents, Devin skills, and other supported surfaces are omitted.

**Acceptance criteria (add to `tests/path-b-hardening.test.js`):**
- A matrix fixture per supported host: create a skill at that host's root, call `inventoryHarness`, assert the skill appears in the inventory.
- Derive inventory scan roots from the host registry, not a second list.
- Remove any path-specific conditionals that infer host/artifact kind from path shape; use registry metadata.
- `node --test tests/path-b-inventory.test.js tests/path-b-hardening.test.js` green.

**Files to touch:**
- `rig/lib/inspect.js` — derive `HARNESS_DIRS` from the host registry.
- `rig/lib/host-capabilities.js` — add registry metadata for scan roots, artifact kinds, and hook roots per host.
- `tests/path-b-hardening.test.js` — append matrix test per supported host.
- `wiki/reasoning/2026-09-01-path-b-remediation-t5-host-registry.md` (new trace)

**Do not touch:** `tests/path-b-inventory.test.js` (frozen).

---

## Task 6 — Unapproved graft enumeration in check

**Triage section:** "Valid but unapproved grafts are invisible"

**Why it fails:** `onboardingCheck` parses only paths named in applied state. It verifies that known grafts remain well-formed but does not enumerate all live Rig markers. A structurally valid graft added after approval is invisible to check.

**Acceptance criteria (add to `tests/path-b-hardening.test.js`):**
- After a successful apply, add a structurally valid Rig graft to a file not in applied state, run check — it must fail with an unapproved-graft error. Assert `result.failures.some(f => /unapproved.*graft/i.test(f.code))`.
- The check enumerates ALL live marker tuples (path, capability, version, content digest) and compares against proposal + applied state + journal.
- An extra section is NOT auto-removed; the failure message directs the operator to repair.
- `node --test tests/path-b-hardening.test.js` green.

**Files to touch:**
- `rig/lib/onboarding-check.js` — add live-marker enumeration step.
- `rig/lib/payload.js` — expose `enumerateGraftMarkers(target)` helper if not already present.
- `tests/path-b-hardening.test.js` — append unapproved-graft failure test.
- `wiki/reasoning/2026-09-01-path-b-remediation-t6-graft-enum.md` (new trace)

**Do not touch:** `tests/path-b-onboarding.test.js`, `tests/path-b-graft.test.js` (frozen).

---

## Task 7 — Dangling-reference check from registry

**Triage section:** "Dangling-reference checking ignores installed adapters"

**Why it fails:** Reference validation scans a short hand-written file list. Installed Cursor and other host adapters are not included; removing the canonical router leaves them dangling while check passes.

**Acceptance criteria (add to `tests/path-b-hardening.test.js`):**
- Matrix: for each supported host, after install, remove the canonical router target, run check — it must fail with a dangling-reference error. Assert at least one of `['cursor', 'github-agent', 'opencode', 'devin']` fails correctly.
- The adapter scan derives its source from the install manifest + host registry (same registry as Task 5).
- `node --test tests/path-b-hardening.test.js` green.

**Files to touch:**
- `rig/lib/onboarding-check.js` — replace hand-written list with registry enumeration.
- `tests/path-b-hardening.test.js` — append matrix dangling-reference tests.
- `wiki/reasoning/2026-09-01-path-b-remediation-t7-dangling-ref.md` (new trace)

**Do not touch:** frozen manifest files.

---

## Task 8 — Check re-inventory on every run

**Triage section:** "Check never refreshes the repository inventory"

**Why it fails:** Check compares cached catalogue, proposal, summary, state, and applied artifacts. It does not re-compute the repository inventory. A post-approval repository edit therefore cannot invalidate the approved snapshot.

**Acceptance criteria (add to `tests/path-b-hardening.test.js`):**
- After a successful apply, append a repository-owned instruction to a tracked file, run check — it must fail with a drift error. Assert `result.failures.some(f => /inventory.*drift|drift.*inventory|repo.*changed/i.test(f.code ?? f.message))`.
- The re-inventory normalizes out journal-proven Rig-managed sections so Rig's own approved graft does not create false drift.
- Drift requires new prepare, proposal, and approval.
- `node --test tests/path-b-hardening.test.js` green.

**Files to touch:**
- `rig/lib/onboarding-check.js` — call `inventoryHarness(target)` and compare against the stored approved snapshot (normalizing Rig-managed sections).
- `rig/lib/onboarding-state.js` — preserve the per-path canonical inventory snapshot in state (not only the aggregate digest).
- `tests/path-b-hardening.test.js` — append post-approval drift test.
- `wiki/reasoning/2026-09-01-path-b-remediation-t8-reinventory.md` (new trace)

**Do not touch:** frozen manifest files.

---

## Task 9 — Multi-host projection deduplication

**Triage section:** "Multi-host state drops real projections"

**Why it fails:** Projection rows are deduplicated by skill identifier only. In a two-host install, the second host row replaces the first in state even though both files were written.

**Acceptance criteria (add to `tests/path-b-hardening.test.js`):**
- In a Codex + Claude two-host install, applied state records one row per (skill, host-scope, path) triple. Assert `appliedProjections.filter(r => r.skill_id === X).length === 2` for any skill projected to both hosts.
- Deleting the Codex copy is detected by check (via the per-host projection row).
- Define duplicates as the same canonical skill appearing twice INSIDE one host discovery scope — not across distinct hosts.
- `node --test tests/path-b-hardening.test.js` green.

**Files to touch:**
- `rig/lib/onboarding.js` (apply path) — deduplicate projections by `(skill_id, host, path)`, not by `skill_id` alone.
- `rig/lib/onboarding-state.js` — update projection row schema if needed.
- `rig/lib/onboarding-check.js` — verify each stored projection row independently.
- `tests/path-b-hardening.test.js` — append two-host projection state + deletion-detection tests.
- `wiki/reasoning/2026-09-01-path-b-remediation-t9-multihost.md` (new trace)

**Do not touch:** frozen manifest files.

---

## Task 10 — Reviewed skill identity binding (tree digest)

**Triage section:** "Reviewed skill identity does not bind the projected bytes"

**Why it fails:** The catalogue digest covers skill metadata; the proposal stores selected skill identifiers; apply reads current staged source files. No digest connects source bytes to the approved proposal. A modified staged skill is projected without detection.

**Acceptance criteria (add to `tests/path-b-hardening.test.js`):**
- After proposal approval, modify a staged skill source file, attempt apply — it must fail with a stale-proposal error. Assert `thrown.message` matches `/stale.*proposal|skill.*digest.*mismatch|tree.*digest/i`.
- Add a `tree_digest` field per selected skill in the proposal; it covers relative paths, modes, and bytes.
- Include tree digests in the generated catalogue + release digest.
- Bind selected tree digests and expected projected-output digests into the proposal.
- Before writing, verify staged tree against proposal tree digests.
- Recheck projected bytes during reconciliation (check action).
- `node --test tests/path-b-hardening.test.js` green.

**Files to touch:**
- `rig/lib/skill-catalog.js` — add `treeDigest(dir)` helper.
- `rig/lib/onboarding.js` (propose path) — embed tree digests in proposal.
- `rig/lib/onboarding.js` (apply path) — verify tree digests before writing.
- `rig/lib/onboarding-check.js` — re-verify projected bytes.
- `tests/path-b-hardening.test.js` — append post-approval source mutation test.
- `wiki/reasoning/2026-09-01-path-b-remediation-t10-tree-digest.md` (new trace)

**Do not touch:** frozen manifest files.

---

## Task 11 — Reapplication reconciliation

**Triage section:** "Reapplication forgets to remove the previous selection"

**Why it fails:** Apply writes new desired artifacts and replaces the applied ledger. It never computes "previously applied minus newly desired." Stale artifacts are no longer in state but their journal records make them appear authorized. Applying an empty replacement proposal leaves old skills and grafts in place while check returns success.

**Acceptance criteria (add to `tests/path-b-hardening.test.js`):**
- Apply a proposal selecting skill A, then apply a replacement proposal with no skills. Assert after second apply: skill A projection file is deleted, graft section is removed from host files, check returns success (no stale artifacts).
- Ownership rule: delete obsolete skill projection only when its current bytes still match journal-proven ownership.
- Safety rule: fail safely when the user edited an obsolete Rig-owned artifact.
- Journal removals before replacing state; advance state only after disk exactly matches new proposal.
- `node --test tests/path-b-hardening.test.js` green.

**Files to touch:**
- `rig/lib/onboarding.js` (apply path) — compute `previousApplied ∖ newlyDesired` and remove obsolete artifacts.
- `rig/lib/payload.js` — expose a journal-aware ownership-checked delete.
- `tests/path-b-hardening.test.js` — append empty-replacement + stale-artifact tests.
- `wiki/reasoning/2026-09-01-path-b-remediation-t11-reconcile.md` (new trace)

**Do not touch:** frozen manifest files.

---

## Task 12 — Empty file deletion when final graft section is removed

**Triage section:** "Removing a graft-created file leaves an empty file"

**Why it fails:** `removeGraftSection` constructs zero output bytes when the last section is removed, but the payload writer only knows how to write files. It writes an empty file and reports a null digest as though the path were absent.

**Acceptance criteria (add to `tests/path-b-hardening.test.js`):**
- After removing the final Rig graft section from a Rig-created file: the file is deleted (does not exist), not replaced with an empty file. Assert `!fs.existsSync(graftedPath)`.
- An originally-existing zero-byte file that received a graft: after removing the graft, the file is preserved as a zero-byte file (not deleted). Assert `fs.existsSync(originalPath) && fs.readFileSync(originalPath).length === 0`.
- The deletion uses a journaled delete/restore-absence operation with containment, hard-link, and symlink checks.
- `node --test tests/path-b-graft.test.js tests/path-b-hardening.test.js` green.

**Files to touch:**
- `rig/lib/payload.js` — add `journaledDelete(target, relPath, writer)` that deletes the file and journals absence; call it from `removeGraftSection` when output is zero bytes and the journal proves Rig created the file.
- `tests/path-b-hardening.test.js` — append deletion test + zero-byte preservation test.
- `wiki/reasoning/2026-09-01-path-b-remediation-t12-empty-delete.md` (new trace)

**Do not touch:** `tests/path-b-graft.test.js` (frozen).

---

## Task 13 — Journal-aware preflight for interrupted writes

**Triage section:** "Interrupted landed writes cannot resume"

**Why it fails:** Graft preflight runs before journal recovery and compares the live file only against the proposal's original preimage. If the desired bytes already landed (crash after write, before applied record), retrying the identical proposal fails with a stale-preimage error.

**Acceptance criteria (add to `tests/path-b-hardening.test.js`):**
- Simulate crash: write desired bytes to disk, do NOT write applied journal record. Retry same proposal — it must succeed (not stale-preimage error). Assert `result.status === 'applied'`.
- Three-way preflight logic: (a) live bytes = desired → finalize without rewrite; (b) live bytes = preimage → proceed with write; (c) otherwise → conflict error.
- Applies to projections, grafts, owned files, and multi-graft files.
- Crash tests at four boundaries: before pending record, after pending record, after disk write, after applied record. All four retry cleanly.
- `node --test tests/path-b-hardening.test.js` green.

**Files to touch:**
- `rig/lib/payload.js` — make `journalWriter`'s preflight check the pending-desired digest before comparing against preimage.
- `tests/path-b-hardening.test.js` — append four-boundary crash-resume tests.
- `wiki/reasoning/2026-09-01-path-b-remediation-t13-journal-preflight.md` (new trace)

**Do not touch:** frozen manifest files.

---

## Questionnaire (blocked items — do not implement)

These two defects require human input before implementation can begin:

**Q1 — Oracle re-signing (blocks: duplicate-name fix + adversarial case addition)**
*Defect:* Duplicate declared skill names are silently renamed to the source directory name instead of failing. Fixing this changes observable behavior captured in the frozen test manifest, which requires the oracle to be amended and re-signed.
*Also blocks:* Adding the full set of reproduced adversarial failure paths as frozen oracle cases (which the triage recommends before implementation).
*Question:* Who will author the oracle amendment and perform the signing ceremony (`scripts/approve-gate1.js`)? Recommendation: combine the duplicate-name fix and all reproduced adversarial cases into a single oracle amendment, perform one re-sign, then implement.

**Q2 — Approval authentication channel (blocks: self-authenticating receipt fix)**
*Defect:* `apply` accepts a caller-controlled `verified: true` Boolean as approval evidence. It never verifies a host attestation or SSH signature, so a fabricated receipt applies the operation.
*Implementation direction is fixed* (require a real verifier; never accept `verified` as input; record `verified` only as verifier output).
*Question:* Which verification method should be wired first?
  - **A. Host-native:** requires a provider-specific attestation verifier bound to the repository, proposal digest, and revision.
  - **B. External SSH:** requires a signer identity and armored SSH signature, verified against the configured public allow-list and a dedicated namespace. Uses the existing `verifySshsig` path in `rig/lib/policy.js`.
  - **C. Both, with SSH as fallback when host-native is unavailable** (what the spec describes — recommended).
  *Also specify:* the signer identity and public key(s) for the SSH allow-list, and whether any release environment can supply a host-native attestation verifier.
