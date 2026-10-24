# Deployment tracker

The owner asked for this by name on 2026-10-24, because nothing is being
committed: *"Keep track of what you're doing. Keep a note tracker, deployment
tracker, or something like that."* With no git history to fall back on, **this
file is the resumable state.** Update it as work lands, not at the end.

Branch `vaibhav-kodiyan/gstack-pasted-text`. Everything uncommitted by owner
instruction. Nothing pushed, published, or visible outside this machine.

## Last updated

2026-10-24, after the owner answered all four open decisions.

## Gate state

| What | Command | Last result | When |
|---|---|---|---|
| Programme signature | `node scripts/approve-gate1.js status --programme ai-sdlc` | protected, `gate1-owner` | 2026-10-24 |
| 6.0.0 oracle | `node scripts/approve-gate1.js status` | protected; 16 files, 95 cases | 2026-10-24 |
| Traceability graph | `node scripts/check-traceability.js` | complete: 84/84/84, 30 fixtures, 20 journeys, 11 packages | 2026-10-24 |
| Acceptance lane, archive present | `RIG_PUBLIC_ARCHIVE=<built> node --test tests/ai-sdlc/*.test.js` | 88 tests, 87 pass, 1 fail | 2026-10-24 |
| Acceptance lane, no archive | `node --test tests/ai-sdlc/*.test.js` | 88 tests, 85 pass, 3 fail | 2026-10-24 |
| Repository gate | `env -u GITHUB_TOKEN -u GH_TOKEN npm test` | **not clean on the last run** — 1311 tests, 1304 pass, 1 fail, 1 cancelled, 5 skipped. See the note below. An earlier exit-0 run exists on the integrated bytes. | 2026-10-24 |

### The unresolved gate run

The last full gate run did not come back clean, and this has **not** been
diagnosed. Full output is in `evidence-npm-test-2026-10-24.log` beside this
file. Two problems:

- `tests/migrate-v5.test.js` hung for roughly twenty minutes and was cancelled:
  *"Promise resolution is still pending but the event loop has already
  resolved."*
- `spawnGuarded cancel kills the entire descendant subtree (RIG-135)` failed
  with `ENOTEMPTY` while removing its own temporary directory.

Both have the signature of interference rather than a code regression: an
earlier gate run was killed at a thirty-minute limit and its Node test
processes were still alive when this run started, which would leave stray
children inside the very temporary directory the second failure could not
remove. **That is a hypothesis, not a finding.** The first action for whoever
picks this up is a clean re-run on a quiet machine — confirm no stray `node
--test` processes are alive first — and if either failure survives, treat it
as real and investigate it properly before anything else proceeds.

The single standing acceptance failure is the hardware-signing case, and it is now known
to be a **wrong signed criterion**, not a missing implementation — see C1 in
`NEXT-AGENT-INSTRUCTIONS.md`.

## Work packages

| Package | Built | Verified | Notes |
|---|---|---|---|
| WP01 contract path | yes | yes | signing criterion needs owner amendment |
| WP02 first complete task | yes | yes | |
| WP03 memory and offline search | yes | yes | ships with the kit per North star 25 |
| WP04 preferences and onboarding | yes | yes | |
| WP05 routing and efficiency | yes | yes | efficiency baseline uses fixed replay fixtures |
| WP06 safe parallel work | yes | yes | no file lock; documented shortcut |
| WP07 verification and release evidence | yes | **no** | release approval is name-only; C3 replaces it |
| WP08 knowledge and recovery | yes | yes | |
| WP09 bounded improvement | yes | yes | |
| WP10 public install and upgrade | yes | partial | archive built locally, never downloaded |
| WP11 release candidate and QA | **no** | — | the remaining work |

## Open work, in order

| # | Item | Blocked by | State |
|---|---|---|---|
| 1 | Independent report-only review of the twenty modules | nothing | **not started** — do this first |
| 2 | Correct the unsigned documents that still say implementation is paused | nothing | not started |
| 3 | Ship the licence text for the search data alongside it | nothing | not started |
| 4 | Replace name-only release approval with real authentication, no secret written anywhere | nothing | **not started** — owner: "make it complete" |
| 5 | Advertise the search capability so a host agent sees and can graft it | nothing | not started |
| 6 | Prepare the unfreeze request for the hardware-signing criterion | nothing to prepare it; owner to sign | not started |
| 7 | Build, publish, download back and verify the archive in CI | publishing needs owner authorisation | not started |
| 8 | Extend the install check to every claimed platform | item 7 | not started |
| 9 | Exact-commit evidence chain | items 1–8, plus the signed amendment | not started |

## Owner decisions — all answered, do not re-ask

| Decision | Ruling | Date |
|---|---|---|
| Does human authentication have to be a USB security key? | No. Any prompt an agent cannot perform — Touch ID, `sudo`, Windows administrator. The signed criterion is wrong and needs amendment. | 2026-10-24 |
| Should offline search be in the default install? | Wrong question. Ship everything, described; the user's agent decides what to graft. | 2026-10-24 |
| Should publishing require real authentication? | Yes, covering principal and key, with no secret reaching git or GitHub. Complete, not half-done. | 2026-10-24 |
| Commit the work? | No. Keep it uncommitted for now. | 2026-10-24 |

## Standing authorisation boundary

Not authorised, and not to be taken without the owner saying so separately:
commit, push, open a pull request, publish a release, change any GitHub issue,
touch production.

## How to update this file

When something in the tables above changes, change it here in the same action
that changed it — not in a batch at the end of a session. A session that dies
mid-task should leave this file telling the next one exactly where it stopped.
