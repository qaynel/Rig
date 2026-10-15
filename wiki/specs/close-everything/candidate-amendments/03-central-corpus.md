# Subplan 03 candidate amendments — central corpus

**Status: CANDIDATE, unsigned.** Prepared 2026-10-13 under the close-everything
plan ([central corpus](../03-central-corpus.md)). Frozen files under
`wiki/gate1/` and the tests pinned in `wiki/gate1/testing-infrastructure.manifest`
were **not** edited. The owner applies these diffs in the single batched
re-sign; agents never sign. Each section is one amendment; later slices append
sections here.

## A1. AT-HOST-5 — WITHDRAWN 2026-10-14

No amendment is needed. `materializeSelectedHosts` is back in
`rig/lib/host-capabilities.js` as a read-only reader over the single
`MCP_HOSTS` table — it reports each selected host's MCP disposition and writes
nothing, so the second disposition table that justified the removal does not
return. The frozen case passes unchanged
(`node --test tests/advanced-oracle.test.js` — AT-HOST-5 green). The unsigned
runnable copy of the amended case has been deleted. Do not apply this section.

## A4. AT-PB-3 — fetch optional shelf skills during onboarding

- File: `tests/path-b-catalog.test.js`, case `AT-PB-3 install pins one
  non-discoverable shelf and projects only mandatory skills`.
- Why: the owner selected fetch-at-onboarding. A default active install carries
  pinned fetch metadata, not 55 vendored `SKILL.md` files; the eight mandatory
  Rig skills remain projected to Codex. Existing upstream onboarding tests
  prove approved fetch, digest verification, patching, and receipt enforcement.
- Applicable diff: [`owner-amendments.patch`](owner-amendments.patch), the single
  patch holding all four frozen-case amendments.
- **Correction, 2026-10-14:** the earlier hand-written diff was incomplete. With
  only `staged.length` amended, the case stays red on the next assertion: the
  native projection now also carries `rig` and `rig-router`, so the expected
  list is ten names, not eight. The patch amends both. It also keeps the
  `.rig/catalog.json` byte-equality assertion, which still passes, rather than
  dropping it as the earlier draft proposed.

- Unsigned runnable copy:
  `03-central-corpus/at-pb-3.candidate.test.js`
  (`node --test wiki/specs/close-everything/candidate-amendments/03-central-corpus/at-pb-3.candidate.test.js`).
- Frozen-suite effect until applied: the existing `staged.length === 55`
  assertion remains red against fetch-at-onboarding behavior.

## A2. Third-party fetch (slice 4) — no frozen-test change yet; one pending amendment recorded

Fetch metadata, patches and the verify/patch pipeline are additive: the shelf
under `rig/catalog/skills/` still ships and AT-PB-3 (55 staged SKILL.md files)
and the licence checks stay green byte-for-byte. The pipeline reproduces the
four RIG-135 runtime files exactly from the pinned upstream revision (tested),
which proves the patches apply; it does not yet replace the whole shelf.

Pending amendment (not applied, needs the owner's re-sign): to drop the
vendored 6.9 MB shelf from the install and stage it by fetch, AT-PB-3's
`staged.length === 55` check and the `.rig/runtime/rig/catalog/skills` staging
assertions in `tests/path-b-catalog.test.js`, `tests/path-b-weight.test.js` and
`tests/path-b-hardening.test.js` (the last is not pinned) change to "55 after
fetch". 83 of the 298 shelf files also carry Rig-authored changes beyond the
rename (catalogue frontmatter, neutralised strings, RIG-135 code) that are not
reproducible from upstream bytes alone; those need an overlay in the corpus
before whole-shelf fetch is possible. Recorded as a remaining gap, not hidden.

## A3. Contract (slice 6) — pinned package scripts and pinned-file leftovers

No frozen test is red because of slice 6. Items the owner may want to fold into
the single re-sign, none required for green:

- `wiki/gate1/package-scripts.json` pins `test:code`, which calls
  `node scripts/check-rule-copies.js`. The script was rewritten in place
  (reproducible projection plus no-twin) rather than renamed. A rename to
  `check-corpus.js`, or a `pretest` step running `node scripts/project-repo.js`
  so generated host files need not be checked in, changes that pinned snapshot
  and belongs in the bundle.
- `rig/catalog.json` (hashed by AT-PB-1) still carries four `reuses` strings
  naming `rig/tier-1/skills/...`. They are inert metadata (no code reads them);
  correcting them changes the pinned catalogue hash, so they ship as-is until
  the re-sign.
- `tests/onboarding-hardening.test.js` (pinned) has one comment mentioning
  `rig/tier-1/routing.md`; comment only.
