# Rig 6.0.0 — specification sheet

**Date:** 2026-10-13; delivery order reconciled 2026-10-17. **State:** release
candidate; the owner-signed test:e2e amendment verifies and current-byte
release evidence remains required. This is a working specification,
not a newly signed acceptance oracle.
**Delivery:** one branch, one PR to `qa-prod`, followed by promotion to `prod`.
**Companion:** [Statement of work](statement-of-work.md).

## Purpose and authority

Ship a coherent, usable Rig release that clears every genuinely open, buggy or
half-built item, leaving only owner-directed, never-started work for redesign.
Every completed item needs a fix and proving evidence; replacement needs a
strong written reason. Difficulty and priority do not justify dropping work.

The [owner decisions and ledger](00-master-plan.md) define scope. The
[review findings](../../reasoning/2026-10-13-close-everything-plan-review.md) and
[six settled delivery answers](../../reasoning/2026-10-13-close-everything-plan-review-complete.md)
explain the amendments. Existing signed artifacts remain protected. This sheet
consolidates the master and linked subplans without changing the frozen oracle.

## Product contract

| Area | Required behavior | Evidence required for completion |
|---|---|---|
| Central corpus | Skills, rules, services, standards, upstream metadata and onboarding instructions have one canonical root, `rig/corpus/`. The user's own agent selects and unpacks the smallest useful capabilities into the repository. | Generated projections are reproducible, canonical Rig content has one authoring authority, and installed MCP descriptors agree with the write contract. |
| Onboarding | Inspect existing infrastructure, propose the improvement, obtain approval for exact proposed bytes, apply through journaled writes, then check. Repository configuration and docs survive outside approved managed sections. | Fresh and existing-repository flows reach a real green check with explicitly selected services and nonzero executed check counts. |
| Third-party skills | Fetch selected resources during onboarding from pinned upstream revisions and digests. Keep licences, provenance and required local patches in the corpus. | Verified downloads and patch application; invalid digest, unavailable upstream or missing capability produces a named non-pass. No offline-vendoring promise. |
| Catalogue | Finish every original catalogue capability. Preserve stable IDs, owned scopes, cumulative minimal/mid/maximal check sets, named slices and dependency edges. Proven duplicates may merge with a written reason and compatibility. | Installed good/bad fixtures discriminate each service's promised behavior. Grade growth, ceilings, slice-only dependencies and old/mixed selection IDs are tested. Delivered count equals 115 minus documented merges. |
| External tools | Use tools already available. Missing scanners or cloud tools produce explicit gaps with setup guidance. This policy is separate from fetching third-party skill resources. | Missing-tool, unsupported-input and runner-error cases cannot report a conforming result. Config-only checks never claim live infrastructure assurance. |
| Lint and format | Preserve good existing tools; offer approved setup/replacement using the already approved preferences and signals. Replacement needs its own consent and recoverable original configuration. | Good-tool/no-write, declined proposal/no-change, approved setup/exact write scope, and accepted replacement/byte-identical undo; edited/shared configuration and interrupted restoration preserve recoverable preimages. |
| Upgrade and removal | Upgrade a v5 installation through a resumable transaction; preserve user edits, selections and original preimages, and invalidate approvals/check results bound to changed bytes. | Already-onboarded v5, edited owned files/grafts, corrupt journals, symlink conflicts, interruption and retry are exercised. Install/uninstall preserves the complete initial file inventory and bytes, including existing reports and ignored files. |
| Agent standards | Enforce proven AI development rules here and ship the same standards through the corpus. Offer an installed rule as enforced only when its check also ships. | Actual executed test evidence supports completion claims; a title substring is only reference hygiene. Comment-only, skipped and failing evidence cannot satisfy the proving-test requirement. |
| Coherence and upkeep | Keep current docs, instructions, projections, catalogue claims and trackers consistent. Run weekly health, dependency drift, wiki budgets and real-download E2E; report failures visibly. | Broken tracker/doc/corpus assertions fail. Historical version references and explicit retirement statements remain valid. CI tracker API errors fail; tokenless local omission is visible. |
| Release | Prepare 6.0.0 metadata/docs before final verification; obtain the one owner signature, fresh digest-bound review and green full gate. Promote using automated checks on the exact QA commit. | Final PR head has matching signature/review/E2E evidence. QA health/full-gate/coherence and real-download clean-install checks pass on the promoted SHA. No manual outside-repository install prerequisite. |

## Concrete defects included

The [bug subplan](02-bug-fixes.md) owns these eight items and their reproductions:

- Corrupt global configuration must not crash uninstall or alter that file.
- A nameless legacy managed-block record must remove only attributable content.
- Read-only command batches decide network permission per command and retain
  changed-path reporting; ungranted commands do not reach the network.
- Durable one-use approval must be proven with independent approval objects;
  removing the durable protection makes the candidate test fail.
- An undeclared-network diagnostic appears once at installed CLI/CI callers;
  removing library stderr output must not hide it.
- Cookie-import browser descendants, forked skill scripts and Xvfb sessions
  must terminate on the relevant success, timeout, stop and cancellation paths.
  Required upstream changes remain tested patches on fetched pinned content.

## Technical approach and boundaries

Reuse the existing payload, onboarding, journal, catalogue and check seams.
Expand the canonical corpus, migrate both install paths to one pure projection
function, then remove superseded copies and dead materialization code. Compare
projection output before deletion and enumerate intended text/delivery changes.
Active consumers must stop using retired source paths; immutable history and
explicit compatibility fixtures are provenance, not runtime authorities.

| Boundary | Required control and failure behavior |
|---|---|
| Projection scripts | Pure shipped projectors have no I/O or network. Agent-written scripts need approval and enforced filesystem/network isolation, read-only repository input and staged output. Missing isolation refuses execution. Process cleanup alone is not a sandbox. |
| Target writes | Validate output paths, sizes, approved scope and realpath/symlink containment; apply only through journaled writes. A script cannot mutate the target directly or substitute bytes after approval. |
| Recovery | An ownership conflict or best-effort uninstall result stops migration; it does not authorize overwrite. Keep the last preimage until restoration succeeds. Scope changes to shared configs instead of expanding generic deletion authority. |
| Catalogue execution | Bind executable checks to approved service selections and existing runner controls. Separate discovery evidence from conformity, so present-but-broken tools can be repaired. |
| Concurrent work | Independent service batches may follow the corpus spine, but shared projection/schema/journal changes have one owner. Existing serialization and digest checks protect applies; no new concurrent writer is assumed. |
| Trackers and automation | Distinguish disposition, candidate delivery state and actual QA delivery. Validate declared transitions before merge and live agreement after delivery. Execution jobs are read-only; only the health reporting job receives issue-write authority. |

## Verification and signing

The owner authorized one final signature for this branch. Agents prepare exact
candidate amendments outside protected artifacts: moved paths, service wording,
removed APIs, package scripts, verifier counts, manifest entries and trace
targets. Candidate tests are provisional, never signed acceptance.

An isolated advisory runner exercises proposed amendments and unsigned
regressions without changing protected originals. It distinguishes verifier
failures from test failures and rejects deviations from the declared expected
failure set. The authoritative `npm test` stays fail-closed. Only the owner
applies the final protected-file bundle and signs it.

Use focused tests per implementation slice. After the final metadata and owner
bundle, run `npm test`, then produce a fresh wrapper-authored review receipt
targeting `wiki/gate2/technical-spec.md`. The deployment checker independently
validates its design/catalogue digests and complete frozen-case coverage.
Clean-install E2E uses the exact candidate archive/SHA through the public
installer path, real dependency downloads, an MCP stdio tool call, approved
onboarding, selected service checks and scoped uninstall verification. A
published tag receives a separate public-download smoke test. Any subsequent
change invalidates affected evidence and requires fresh verification.

## Completion and boundaries of scope

Completion requires all included capabilities proved through their shipping
path, current docs and trackers reconciled, no unexplained review findings,
the final signed gate green, and automated promotion evidence for the actual
QA commit. Tracker closures follow the published tag and passing download smoke
test. Named coverage gaps remain honest gaps, not successful assurance.

The owner-directed redesign backlog is exactly RIG-116, RIG-122, RIG-130,
RIG-133 and RIG-156. Close those issues as not planned with the `redesign` label
and a backlog link; they are not delivered fixes. Per-host support matrices,
automatic external-tool installation and agent edits/signatures of protected
acceptance artifacts are outside this delivery contract.

The working approach may adapt to evidence during implementation. No product
decision remains open; changes to settled intent or protected acceptance need
the owner process, not an undocumented shortcut.
