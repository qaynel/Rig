---
date: 2026-10-24
source: agent
topics: testing-strategy, distribution-and-release, agent-working-conventions, gate1-signing
decisions:
status: current
supersedes:
tags: handoff, ai-sdlc, deployment-readiness, roadmap
summary: Handoff for the next coordinator — acceptance lane measured at 87/88 with a built archive, both signed contracts re-verified on final bytes, roadmap 19 updated with delivery status, and an ordered five-phase path to deployment-ready filed as rig-implementation-handoff/NEXT-AGENT-INSTRUCTIONS.md.
---

# AI-SDLC deployment handoff

The owner asked for the context another session needs to carry this to
deployment-ready: an updated roadmap and an instruction set. Both are written.
This trace records what was measured to write them, because the numbers in the
earlier handoff were stale.

## Re-verified on the final bytes

The last two code edits of wave 1 — the D9 attribution in `memory.js` and the
control-character rejection in `run-journal.js` — post-dated the earlier
verification run, so everything was re-measured.

| Check | Result |
|---|---|
| `node scripts/approve-gate1.js status --programme ai-sdlc` | `ai-sdlc contract protected: principal=gate1-owner` |
| `node scripts/approve-gate1.js status` | protected; `Oracle verified: 16 files, 95 acceptance cases` |
| `RIG_PUBLIC_ARCHIVE=<built> node --test tests/ai-sdlc/*.test.js` | **88 tests, 87 pass, 1 fail** |
| Protected set via `approve.programmeProtectedFiles` | 30 files |
| `tests/ai-sdlc/` on disk | 25 files: 24 proving tests plus `_harness.js` |

Both signed contracts still verify. Neither edit touched a protected byte.

## A stale number, corrected

`rig-implementation-handoff/README.md` and `CI-CD-PLAN.md` both recorded
"88 tests, 85 pass, 3 fail". That was measured without `RIG_PUBLIC_ARCHIVE`
set, which pushes PT-068 and PT-077 into the harness's `environmentBound`
branch. With an archive built by `node scripts/build-public-archive.js` the
lane is 87/88. Both documents now carry both numbers and say which is which,
because a reader who runs the bare command and sees three failures should not
conclude the branch regressed.

The remaining failure is PT-017 alone, which needs a physically present
`sk-ssh-ed25519@openssh.com` key. The signed harness refuses to simulate a
security-key touch. Under North star 12 that is a reported gap.

## Why PT-077 passing is not proof

PT-077's criterion says *real download*. It currently passes against an archive
built on the same machine seconds earlier, because `.context/` is gitignored
and no workflow builds or publishes the artifact. North star 11 makes an
automated real-download clean install a promotion requirement, so this gap
blocks release, not merely polish. Closing it needs a CI job that builds,
publishes, downloads back, and runs the lane against the downloaded bytes —
and publishing needs owner authorisation.

## What was written

- `wiki/specs/ai-sdlc-harness/19-work-packages-and-public-roadmap.md` — status
  moved from `proposed` to `implemented`; a Delivery status section records the
  measured state, per-package status for WP01–WP11, what open-source
  inheritance actually landed, and two corrections to the document's own
  claims (the WP03 test path, and the Claude-Mem/Hermes/DeepAgents ports that
  were planned and never performed).
- `rig-implementation-handoff/NEXT-AGENT-INSTRUCTIONS.md` — the ordered path:
  Phase A independent review, Phase B documentation corrections, Phase C four
  owner decisions, Phase D real-download proof, Phase E exact-commit QA chain.
  It carries the hard rules, the model-tiering scheme the owner asked for, the
  red-gate failure loop, and the traps already paid for once (the `node --test`
  directory form reporting one test; `trim()` not stripping zero-width
  characters; a stale developer-scope record in `~/.rig` outranking a project
  record).

## Still open

Nothing is committed. The independent report-only code review has still not
run against these bytes — it is Phase A, and it is the first thing the next
session should do, because under the governing brief the implementation cannot
certify itself. The four owner decisions in Phase C block Phases D and E.
