# Owner amendment bundle — unsigned candidate

Prepared 2026-10-14 for the single owner review and re-sign. This index does
not authorize edits to `wiki/gate1/`, `package.json` scripts, or catalogue
compatibility files. The owner applies any selected changes and regenerates
the signed manifest and signature only in the authorized signing session.

**Current owner entrypoint:** the binding-review batch is consolidated in
[`binding-review-owner.patch`](binding-review-owner.patch), with its review
request and exact owner steps in
[`2026-10-18-binding-review-unfreeze-request.md`](2026-10-18-binding-review-unfreeze-request.md).
The older `owner-amendments.patch` below is historical evidence for the earlier
four-case batch; do not apply it in addition to the consolidated patch.

## Apply it with one patch

[`owner-amendments.patch`](owner-amendments.patch) carries all four frozen-case
amendments (`AT-SHAPE-6`, `AT-LF-20` in `tests/advanced-oracle.test.js`;
`AT-PB-1`, `AT-PB-3` in `tests/path-b-catalog.test.js`). It was produced and
proved in a throwaway copy of this tree, never in the worktree:

```sh
git apply wiki/specs/close-everything/candidate-amendments/owner-amendments.patch
node --test tests/advanced-oracle.test.js tests/path-b-catalog.test.js   # 83 pass, 0 fail
```

After applying, the two manifest digests become (verify, do not trust):

| File | sha256 after the patch |
| --- | --- |
| `tests/advanced-oracle.test.js` | `ac25a4a5350cca2b44b750338fece95e6622ec987b50ecf1d5f3537c91b0bcc0` |
| `tests/path-b-catalog.test.js` | `afd34735c736ad5276db161905456a490e2c058d467d4c5a94a04f40d32069c7` |

Recompute with `shasum -a 256 <file>` on the final bytes; if anything else in
the tree moves first, `AT-PB-1`'s catalogue pin must be recomputed too (see its
note). Acceptance IDs are unchanged, so `scripts/check-advanced-spec.js` still
expects 95.

**Two corrections this patch carries that the earlier hand-written diffs did
not.** Both would have left the gate red after signing:

1. `AT-PB-3` needed a second change. Amending `staged.length` alone stops at the
   next assertion — the native projection now also carries `rig` and
   `rig-router`, so the expected list is ten names, not eight.
2. `AT-PB-1`'s recorded catalogue digest was stale (`c28174db…`); the current
   bytes hash to `3e5bcd14…`.

**One open question before signing.** The router ships twice: the corpus router
projects both as `rig-router` and, under RIG-149, as `rig` — the same bytes
under two names, and the second collides with the shelf's own `rig` routing
skill (`rig/catalog/skills/.../workflow-routing/_core/`). The patch pins the
current behaviour (ten names). Choosing to de-duplicate instead changes that
same line to nine names and touches `rig/manifest.json`, `rig/corpus/routing.md`,
two tests and the regenerated projections. It is a product decision, so nothing
here assumes it.

## Gate 1 case amendments

These change existing case bodies in place. They add or remove no acceptance
IDs; the current verifier count stays **95**. Existing Gate 2 trace rows retain
their IDs, titles, and target files. The owner should confirm those rows against
the final amended bodies before signing.

| Case | Candidate | Proposed change | Advisory evidence |
| --- | --- | --- | --- |
| `AT-PB-3` | [central corpus bundle](03-central-corpus.md#a4-at-pb-3--fetch-optional-shelf-skills-during-onboarding) · [runnable case](03-central-corpus/at-pb-3.candidate.test.js) | Pin upstream shelf metadata at install; assert optional skills are fetched during onboarding rather than staged at install. | `node --test wiki/specs/close-everything/candidate-amendments/03-central-corpus/at-pb-3.candidate.test.js` — 1 pass. |
| `AT-PB-1` | [active catalogue pin](04-catalogue/AT-PB-1.md) | Replace the compatibility catalogue paths with `rig/corpus/catalogue.json` and `rig/corpus/services/`. | Recomputed path/NUL/bytes/NUL SHA-256: 1,036 files, `c28174db89e2f41d8e2fee15cde2e2f583ffc70f9277a77a98d502d94eee81bf` — matches the candidate. |
| `AT-SHAPE-6` | [authored guidance amendment](04-catalogue/AT-SHAPE-6.md) | Keep the 115-service authored-content gate; assert that retired boilerplate is absent. | `node --test tests/advanced-catalogue.test.js` — 10 pass. |
| `AT-LF-20` | [RIG-146 amendment](rig-146.md) · [runnable case](rig-146/at-lf-20.candidate.test.js) | Use independent approval objects so the durable one-use record, not an in-memory flag, rejects reuse. | `node --test wiki/specs/close-everything/candidate-amendments/rig-146/at-lf-20.candidate.test.js` — 1 pass. The recorded mutation check also proves the candidate fails when durable enforcement is removed. |

The [onboarding service-offer candidate](04-catalogue/onboarding-offer.candidate.test.js)
is an additional unsigned regression, not a frozen Gate 1 amendment; its run
passed 1/1. The [RIG-135 patch notes](rig-135.md) and three patch files are
supporting provenance, not extra acceptance IDs.

The complete candidate inventory is: `03-central-corpus.md` and its one
remaining runnable case copy (`at-pb-3.candidate.test.js`);
`04-catalogue/AT-PB-1.md`, `AT-SHAPE-6.md`, and the onboarding-offer candidate;
`06-e2e/package-scripts.md`; the three
`rig-135/*.patch` files and `rig-135.md`; `rig-146.md` and its runnable case;
and `08-coherence/package-scripts.md`. This bundle is the consolidated owner
entrypoint for that inventory.

## Package scripts and test manifest

The two package-script proposals must be merged in the same owner change:

- [Clean-install entrypoint](06-e2e/package-scripts.md): add
  `test:e2e: node scripts/clean-install-e2e.js`.
- [Coherence entrypoint](08-coherence/package-scripts.md): add
  `node scripts/check-coherence.js` to `test:code` after the version check;
  leave `npm test` unchanged.

Both changes require the corresponding `wiki/gate1/package-scripts.json`
snapshot update. After the owner applies the final contents, regenerate the
manifest digests for `tests/advanced-oracle.test.js`,
`tests/path-b-catalog.test.js`, and `wiki/gate1/package-scripts.json`. Keep all
other manifest entries, its sorted order, and its current 16-file count unless
the selected final diff changes the listed file set. `scripts/check-advanced-spec.js`
continues to expect 95 active acceptance IDs.

**Current evidence:** the four frozen cases are green under the patch above
(`node --test tests/advanced-oracle.test.js tests/path-b-catalog.test.js` —
83 pass, 0 fail, run in a throwaway copy). On the unamended worktree the full
gate is 1,052 pass / 2 fail, and those two are exactly `AT-SHAPE-6` and
`AT-PB-3`. The coherence command now passes with all 63 declared
tracker transitions and the executed-test evidence gate; the service guidance
contract passes. The clean-install scenarios pass on a provisional temporary
archive, including real npm install and MCP traffic. Exact branch-SHA evidence
requires the frozen bytes to be committed after the owner's signature; the
public v6.0.0 tag and post-publication smoke remain later release steps.

**Still pending for T-10.3:** the two package-script proposals are pinned
Gate 1 changes and cannot be exercised through `npm run` until the owner applies
them in the authorized signing session. This bundle records their exact script
lines and verifier manifest change; keep T-10.3 open until those advisory runs
are green and the final trace targets are checked against the signed bytes.

## Paths, wording, API, and trace review

- The active source root moved from `rig/tier-1/` to `rig/corpus/`; active
  service authoring and the frozen 115-service pin now use
  `rig/corpus/catalogue.json` and `rig/corpus/services/`. Keep the legacy
  `rig/catalog/` compatibility tree unchanged in this owner batch unless a
  separate approved amendment names it.
- `tests/path-b-hardening.test.js` is **not** pinned in
  `wiki/gate1/testing-infrastructure.manifest`; it is an ordinary editable test.
  Its retired-path reads and its stale shelf expectations were corrected
  directly on 2026-10-14, and its candidate note was deleted.
- Service wording changes are limited to the `AT-SHAPE-6` assertion above;
  the 115 service IDs and grade counts do not change.
- `AT-HOST-5` needs no amendment: `materializeSelectedHosts` is restored as a
  read-only reader over the shared `MCP_HOSTS` table, so the signed case passes
  as written. Its candidate was withdrawn on 2026-10-14.
- No acceptance IDs are added or dropped. Check that every final Gate 2 trace
  target still names the manifested file and exact title for `AT-PB-1`,
  `AT-PB-3`, `AT-SHAPE-6`, and `AT-LF-20` before signing.
- The older explanatory section A2 in `03-central-corpus.md` says the vendored
  shelf still ships. That statement predates the later whole-shelf fetch and
  removal work; use its AT-PB-3 candidate diff above as current and do not copy
  the stale shelf-retention paragraph into the signed bundle.

## Readiness

Case-level advisory evidence is green for the four listed cases, and the active
catalogue pin matches its recomputed digest. The two package-script candidates
remain blocked as stated above. Keep this bundle unsigned and do not run
`scripts/approve-gate1.js`; T-10.3 remains open until every selected item has a
green advisory run and the owner receives the complete final diff.
