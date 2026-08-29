---
date: 2026-08-25
source: agent
topics: distribution-and-release, host-and-ci-coverage, onboarding-flow, review-receipts, testing-strategy
decisions: owner approved RIG-134 Option A (classify all, fix observable, defer debt)
---

# Pre-v5 gate runbook + finding classification

The owner approved **Option A** of [[RIG-134]] and asked for the gate fixes to be
offboarded so a **lower-reasoning model** can execute them without re-reading the
investigation. This file is that offboarding: the debt-vs-observable
classification of every known finding (the judgment half, done here once), then a
flat ordered task list (the mechanical half, for the low model), then the exit
condition.

Read order for the executor: this file top-to-bottom, then the one ticket named
by each task. Nothing else is required. The investigation background lives in
[[2026-08-25-structural-investigation-session-record]] but is **not** needed to do
the work.

**Hard rule for every task below:** do **not** edit
`tests/advanced-oracle.test.js` or anything under `wiki/gate1/` — those are the
owner-signed oracle. New tests go in unsigned files (`tests/*.test.js` that are
not `advanced-oracle.test.js`). If a fix seems to require editing a signed file,
stop and flag it; it needs an owner re-sign, not a code change.

---

## 1. The classification (done — do not re-litigate)

Rule used: a finding is **`v5-observable`** if it is observable in a capability
v5.0.0 claims to support — i.e. it changes bytes written into / removed from a
user's repository, breaks a printed onboarding step a stranger follows, or ships
a false capability claim in output. Everything else is **`debt`** and defers to
the v5.1 migration inventory ([[RIG-132]]).

### Must-fix before v5.0.0 (`v5-observable`)

| Finding | Ticket | Why observable | Fix shape |
|---|---|---|---|
| 134.1 | [[RIG-134]] / [[RIG-128]] 128.1–128.3 | `rig apply` writes `.rig/host-contracts/<host>/<axis>.json` into the user repo from raw `REGISTRY`, so descriptors contradict the write path (antigravity advertises a repo auto-write RIG-105 made manual-only) | Route `contractFor` (`host-capabilities.js:223`) through the interpreted host semantics (`mcp-hosts.js` `MCP_HOSTS`), so the descriptor and the writer agree. **Leaf fix, not the collapse.** |
| 128.4 | [[RIG-128]] | OpenClaw repo auto-write `mergeJson` (`renderers.js:11-23`) `JSON.parse`s a JSON5 file and resets `obj={}` on parse error — silent user-data loss on install | Fail closed on unparseable input like `global-writes.js:118-121`; route JSON5 hosts through a JSON5-safe read or the native CLI, not `JSON.parse` |
| 128.5 | [[RIG-128]] | Repo merge writer swallows a parse error and overwrites (silent data loss); `setAtPath` drops entries on a primitive at a dotted key | Make the repo writer fail-closed like the global one; throw "invalid JSON … left unchanged" |
| 126.1 | [[RIG-126]] | **Critical.** Printed post-install chain (`bootstrap.sh:124-134`) dead-ends after `inspect`: `review.json` / `rig.json` / `approval.json` have no producer; literal `--host <host-id>` runs verbatim | Add the `host-review` stage (inspection → verdict-bearing `review.json`) + a menu→`rig.json` step, or collapse the flow so printed commands chain with real defaults |
| 126.2 | [[RIG-126]] | Antigravity manual MCP step never renders on the staged `--with-runtime` flow a real user follows (`apply.js` does no MCP/credential rendering) | Render `.rig/mcp-setup.md` + the check prompt on the staged path, not only the legacy Basic path |
| 126.3 | [[RIG-126]] | `rig check --host antigravity` false-passes on a stray `rig` entry and false-fails a correctly-pasted non-`rig` server | Compare against the expected server name from `receipt.manualEntries.antigravity` |
| 126.4 | [[RIG-126]] | Final `rig check` is silent on success — a user cannot tell a clean install from a no-op | Print a positive confirmation on a clean `runChecks` |
| 127.1 | [[RIG-127]] | `rig --uninstall` after a default markdown install reverses almost nothing (no receipt exists; routing/rules/skills/`.claude`/`.agents`/managed lines all remain) | Make the journal path the only uninstaller: `--uninstall` delegates to `lifecycle.js`, or remove the flag |
| 127.2 | [[RIG-127]] | Non-purge uninstall deletes the journal even when files were kept best-effort → record-less orphan, second uninstall can't retry | Keep the journal while best-effort files remain; delete it last |
| 127.3 | [[RIG-127]] | `--purge` leaves the install manifest on disk (deletion only in the non-purge branch) | Delete the manifest last in **both** modes |
| 127.4 | [[RIG-127]] | Preimage backups are unjournaled write-only orphans, never removed on uninstall (committable-path half already fixed round-2) | Journal the preimage writes so they are reversible; remove on uninstall |
| 127.5 | [[RIG-127]] | Linked-worktree apply renames the user's `pre-commit` to `.rig-chained` and writes a shim with plain fs, un-journaled; uninstall never restores it — permanent hijack across every worktree | Journal the hook write; restore on uninstall |
| 127.6 | [[RIG-127]] | `managed_line` uninstall strips the line but never deletes files Rig created fresh → empty `AGENTS.md`/`GEMINI.md`/`CLAUDE.md`/`copilot-instructions.md` orphans | Delete a file Rig created fresh when the managed strip empties it |
| 127.7 | [[RIG-127]] | Journal uninstaller leaves emptied `.claude/skills/…`, `.agents/skills/…`, `.rig/` trees behind | `rmdir` emptied Rig dirs (the `uninstall.js` path already does this for `.rig`) |
| 127.8 | [[RIG-127]] | A corrupted **middle** journal line is silently dropped by the truncated-final-line `try/catch`; its file is never reversed or reported (receipt raised as major) | Fail closed on an unparsable non-final record; report it |
| 127.10 | [[RIG-127]] | Legacy uninstaller hardcodes `.git/hooks/pre-commit` (worktree-blind); `.rig/install-id` is removed by neither uninstaller | Resolve the hook path per-worktree; journal + remove `install-id` |
| 129.1 | [[RIG-129]] | Ships a **false** capability claim: `host-capabilities.js:135` marks pi `mcp_config: unsupported` "refused by design", citing a Skills page that says nothing about MCP; pi supports MCP via a first-party extension | Correct the claim + citation, or downgrade to `unknown`. (The provenance-enum mechanism is v5.1 / [[RIG-132]]; this is the leaf correction.) |

Plus the two structural pre-v5 items that are not "findings" but gate conditions:

| Item | Ticket | Fix shape |
|---|---|---|
| Done = named green test | [[RIG-131]] | Write `scripts/check-ticket-traceability.js`, wire into `npm test`, work the initial violation list (expect RIG-104/105/107 back to Backlog) |
| Raw-field allowlist ratchet + committed debt inventory | [[RIG-132]] pre-v5 slice | A static check that no module outside a grandfathered allowlist destructures raw `REGISTRY` capability fields (`mcp_config`, `surfaces`, `instruction`, …); the allowlist file **is** the debt inventory; its count is printed. Adding a module fails CI. |

### Defer to v5.1 (`debt` — record in the inventory, do not fix now)

| Finding | Ticket | Why deferrable |
|---|---|---|
| 134.2 | [[RIG-134]] | `materializeSelectedHosts` has zero production callers — ships nothing; its removal is Contract-phase work |
| 134.3 | [[RIG-134]] / [[RIG-133]] | A signed case tests that dead function — a coverage-budget waste, not shipped-wrong behaviour; strengthens RIG-133 |
| 128.3 (internal) | [[RIG-128]] | The **shipped descriptor** correctness is handled by 134.1; the remaining code-level triplication of the codewhale location (host-capabilities vs credentials vs global-writes) is internal cleanup |
| 128.6 | [[RIG-128]] | Hermes key mismatch is harmless (`autoWrite=false`); cline two-URL is a citation issue (129.3) |
| 126.5 | [[RIG-126]] | `rig/bin/rig` failing from a source checkout affects developers, not the installed end-user flow |
| 129.2 | [[RIG-129]] | A wrong path in an internal code comment; product behaviour is correct |
| 129.3 | [[RIG-129]] | cline cited to two URLs — cosmetic |
| 129.4 | [[RIG-129]] | codewhale cited to two files, both key claims valid — cosmetic |

---

## 2. The runbook (flat, ordered, for the low model)

Do these in order. After each numbered step run the fast subset
(`npm run test:rig` or the single new test file); run the full gate (`npm test`)
only at step 6, right before ship. Every step has an acceptance test named — that
is what makes it Done, per [[RIG-131]].

1. **RIG-131 — make Done mechanical.** Write `scripts/check-ticket-traceability.js`
   and wire it into `npm test`. Then work its violation list. Do this first so
   every later step's Done claim is checkable. Acceptance: see [[RIG-131]] §Acceptance.

2. **134.1 — `contractFor` agrees with the write path.** One equivalence test
   asserting the emitted descriptor and the renderer produce the same
   disposition/path/key for every host in `REGISTRY`; make it green. Closes
   128.1, 128.2, and the shipped-descriptor half of 128.3.

3. **Uninstall cluster (127.1–127.8, 127.10).** Land one real
   install→uninstall→"tree is clean" roundtrip test first (this is [[RIG-125]]'s
   roundtrip test, pulled forward as the gate for this cluster), then fix each
   sub-finding under it. 127.9 is already fixed — do not re-open it.

4. **Onboarding cluster (126.1–126.4).** Land the "printed sequence runs to green
   check" end-to-end test, then make the printed chain produce its own inputs and
   render the manual MCP step on the staged path.

5. **MCP write safety (128.4, 128.5) and the pi claim (129.1).** Fail-closed repo
   writer + JSON5-safe path; correct or downgrade the pi MCP claim.

6. **Debt inventory + ratchet (RIG-132 pre-v5 slice).** Commit the allowlist of
   modules permitted to read raw `REGISTRY` fields as the single debt-inventory
   artefact; print its count; add the static check that fails when a new module
   joins. Confirm no semantic-model runtime is emitted into a target repository
   (installs still land markdown/instruction files only).

7. **Ship.** Full gate green, then [[RIG-120]]'s release ceremony (fresh receipt
   on the exact bytes, owner re-sign, cut and publish v5.0.0).

---

## 3. Exit condition (when the gate is passed)

All of:

- Every `v5-observable` finding above is fixed as a bounded leaf fix (or, for
  129.1, its claim downgraded), each with a named green test.
- `check-ticket-traceability.js` is green — no Done card rests on prose.
- The raw-field allowlist ratchet is green and its count is printed; the allowlist
  is the committed debt inventory.
- No semantic-model runtime enters target repositories.
- The full gate (`npm test`) is green and [[RIG-120]]'s receipt passes on the
  final bytes.

Two clean independent review rounds are corroboration on top of this, never the
definition — that substitution is the exact mistake the whole investigation
found ([[2026-08-25-escaping-the-quadratic]]).

## Links

[[RIG-134]] · [[RIG-131]] · [[RIG-132]] · [[RIG-126]] · [[RIG-127]] · [[RIG-128]] ·
[[RIG-129]] · [[RIG-120]] · [[2026-08-25-structural-investigation-session-record]]
· [[2026-08-25-prev5-classification-and-migration-pattern]].
