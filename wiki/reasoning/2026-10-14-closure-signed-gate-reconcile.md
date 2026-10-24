---
date: 2026-10-14
source: agent
topics: the-overhaul
decisions:
status: historical
summary: The re-signed Gate 1 signature covers the un-amended oracle, so five candidate amendments are still outside the signed bytes; four of the twelve reds are fixable in editable code and are being fixed now.
---
Done: verified the gate. `node scripts/check-advanced-spec.js` passes
("Oracle verified: 16 files, 95 acceptance cases"), and the manifest digests
still match the committed test bodies — so the owner's new signature
(`wiki/gate1/gate1.sig`, uncommitted) signs the oracle **as it was**, not the
five candidate amendments in
`wiki/specs/close-everything/candidate-amendments/owner-bundle.md`. Signing is
cryptographically complete; the amendment content was never applied.

Triage of the twelve reds:

- AT-HOST-5 — fixable without touching a frozen file: `materializeSelectedHosts`
  was dropped in f7be799b. Restore it as a thin read-only reader over the shared
  `MCP_HOSTS` table (no second table), and the signed case passes as written.
  The AT-HOST-5 amendment then becomes unnecessary.
- AT-UNINSTALL-3 — a production regression, not an amendment: the signed case
  requires `uninstall(target, { purge: true })` to remove `reports/rig`.
  `tests/release-blockers.test.js` (editable, not pinned) asserts the opposite;
  the signed oracle wins and that editable expectation is corrected.
- `tests/path-b-hardening.test.js` is **not** in
  `wiki/gate1/testing-infrastructure.manifest`; it is an ordinary editable test.
  Its uncommitted hunk re-pointed two reads at the retired `rig/tier-1/`, which
  no longer exists — reverted to the committed `rig/corpus/` paths, and the
  candidate note that proposed that same change is now dead.
  Its remaining reds are stale expectations: the mandatory shelf is 10 skills
  (8 phase skills + `router` + the RIG-149 `rig` fallback name), and the
  staged `.rig/runtime/rig/catalog/skills/` shelf is retired by North star 6.
- AT-SHAPE-6 and AT-PB-3 cannot be closed by an agent. AT-SHAPE-6 demands the
  "generic baseline / not tailored" disclaimer in all 805 service fragments,
  which the T-4.5/T-4.6 authoring rule deliberately retired; AT-PB-3 demands an
  install-staged shelf, which North star 6 retired. Both need the owner's
  batched re-sign of the amended bodies.

In flight: the three code fixes plus the path-b-hardening expectation refresh.
Next: re-run the affected files, then one full `npm test`.

## Result (same session)

Fixed and proved, each by its own file run:

- `rig/lib/host-capabilities.js` — `materializeSelectedHosts(target, hostIds)`
  restored as a read-only reader over `MCP_HOSTS` via `contractFor`; it writes
  nothing. `node --test tests/advanced-oracle.test.js` → AT-HOST-5 passes.
- `rig/lib/lifecycle.js` — an explicit `purge` now drops `reports/rig`
  wholesale after the ledger cleanup. AT-UNINSTALL-3 passes;
  `tests/install-uninstall-roundtrip.test.js` 26/26.
- `tests/release-blockers.test.js` — the editable expectation that a report
  survives an explicit purge contradicted the signed case and was corrected
  (40/40). `rig/lib/evidence-artifacts.js`'s header comment no longer claims
  reports are never a purge scope.
- `tests/path-b-hardening.test.js` (editable, not pinned) — retired `rig/tier-1`
  reads dropped, the mandatory shelf asserted from one `MANDATORY_SKILLS` list
  of 10 (eight phase skills, `router`, and the RIG-149 `rig` fallback name),
  the shelf-leak check skips the names Rig projects itself, and the two staged
  -source cases stage the shelf skill from the repository instead of assuming
  install staged it. 65/65.
- `rig/lib/release-evidence.js` — `implementationDigest` raised a bare ENOENT
  for any tracked-but-deleted file, which made three RIG-124 release-evidence
  tests fail the moment a candidate file was removed. It now names the file and
  says to stage the deletion. `scripts/check-test-evidence.js` is green again.

Removed as duplicates: the AT-HOST-5 candidate (withdrawn — the API is back, so
there is nothing for the owner to apply), the path-b-hardening candidate note
(applied directly), and the three `rig-135/*.patch` copies that were byte-identical
to the shipped `rig/corpus/upstream/patches/` versions (`rig-135.md` now cites the
shipped paths).

Left for the owner, and only the owner: AT-SHAPE-6 and AT-PB-3. Each needs the
amended body signed; neither can be closed by changing production code without
contradicting a settled decision (the T-4.5/T-4.6 authoring rule, North star 6).
The owner's batch is now four cases, not five.

One real duplicate is reported, not changed: the corpus router ships twice to
`.rig/skills/router/` and `.rig/skills/rig/`, and the second name collides with
the shelf's own `rig` routing skill at `rig/catalog/skills/.../workflow-routing/_core/`.
Deduplicating means either dropping a projected name (routing.md cites both) or
retiring the shelf entry, which lives under the `rig/catalog/` tree this plan
does not touch. It is an owner decision.

## One-table test, kept honest

`tests/mcp-one-table.test.js` asserted the *absence* of the export
(`'materializeSelectedHosts' in hostCapabilities === false`), which is the
opposite of the signed AT-HOST-5. The property it is really defending — one MCP
disposition table — now has a direct assertion: the reader may contain no host
entry of its own, and for every registry host what it reports must equal the
descriptor that host's contract advertises. Mutation-checked: naming a single
host inside the reader turns it red (fail 1), the clean tree passes (3/3).

## Gate movement

Full `npm test` before this session: 1,042 pass / 12 fail. After the fixes
above, confirmed by a clean serial run: **1,052 pass / 2 fail**. An intermediate
run showed four, two of which were self-inflicted by the
new MCP instructions-parity line in `scripts/check-rule-copies.js` — this
gate's own fixtures copy `rig/` without `rig-mcp/`, so the unguarded read threw
instead of reporting. The pair check now runs only when both files are present
(`tests/corpus-contract.test.js` 8/8, and the mutation still fails the gate).

Remaining reds, both owner-only: AT-SHAPE-6 and AT-PB-3. AT-PB-3 is a single
assertion (`staged.length === 55` against a shelf that is now fetched, so 0).
Every other release validator is green on this tree: `check-advanced-spec`,
`check-versions`, `check-rule-copies`, `project-repo --check`, `check-coherence`
(including the 72 executed proving-test references), and `git diff --check`.
Nothing is committed; the worktree is left for the owner's signing session.
