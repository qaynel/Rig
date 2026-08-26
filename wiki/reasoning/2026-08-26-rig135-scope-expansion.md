---
date: 2026-08-26
source: intent owner
topics: rig-135-subprocess-cleanup
decisions:
---

Owner instruction: "expand the ticket to include the new sites too except
the 3 which we deferred to other tickets."

Context: the 2026-08-26 pending-triage pass resolved all 21
`pending-triage` sites in `wiki/tickets/RIG-135.md` /
`rig/spawn-guard-allowlist.json` into 19 `debt`, 18 `allowlisted`, and 3
`separate-follow-up`. Before this instruction, the ticket's own
"Localization summary" and acceptance criteria still scoped mandatory
migration to only two sites — site 1 (`rig-memory-ingest.ts`) and site 5
(`rig-brain-sync.ts`'s bun ingest) — plus the reference implementation
(`scripts/review-receipt.js`). Every other `debt` site, including all 7
found during the grilling-pass extension (sites 15–21) and all 4 found
during the pending-triage pass (`rig/lib/checks.js`,
`rig/lib/lint-format.js`, `rig/catalog/baseline/check.js`,
`rig/catalog/skills/browse/src/project-slug.ts`), was scoped as
"opportunistic" — tracked by the build-time ratchet so it can't get
worse, but not required to close this ticket.

The owner's instruction changes that: all 19 sites the allowlist
classifies `debt` now migrate to `rig/lib/spawn-guarded.js` inside this
ticket, once the helper is built. The 3 `separate-follow-up` sites
(`browser-skill-commands.ts`, `xvfb.ts`, `cookie-import-browser.ts`) are
explicitly excluded — they're already tracked as their own tickets
(RIG-135.1 #78, RIG-135.2 #79, RIG-135.3 #80) pending a browse-skill-owned
decision on Bun-native group-kill, which this ticket has no standing to
make. The 18 `allowlisted` sites are unaffected — they were individually
verified safe outside the helper indefinitely, not deferred.

No new technical uncertainty here: every one of the 19 debt sites was
already individually traced and classified with a known fix shape (route
through the helper's `spawnGuardedSync`/`spawnGuarded` entry points once
it exists) during the grilling and pending-triage passes. This is a scope
ruling, not a new investigation — it changes which already-classified
sites are mandatory-before-close versus opportunistic, and it does not
touch the frozen recursive-cleanup contract, the test oracle
(`tests/spawn-guarded.test.js`), or the API-shape question already
flagged as outstanding.

Applied in the same change:
- `wiki/tickets/RIG-135.md`: "Localization summary" and "Acceptance
  criteria" sections rewritten to list all 19 mandatory sites; status
  line updated; build-time-guard bullet annotated.
- GitHub issue #75 body synced to match.
