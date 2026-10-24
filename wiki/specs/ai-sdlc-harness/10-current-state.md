---
status: current
checked: 2026-10-23
owner: rig-product-design
---

# Current-state preservation report

Verified against the working tree on 2026-10-23. **Nothing has been committed,
pushed, reverted or deleted.** Every number below is from a command run on this
branch, not from the trace record.

Branch: `vaibhav-kodiyan/gstack-pasted-text` · HEAD `0256c663` (merge of PR #153).

## 1. Uncommitted work — implementation

| File | Change | State |
|---|---|---|
| `scripts/review-receipt.js` | +341 lines net | **complete, tested** |
| `tests/release-blockers.test.js` | +309 lines net | **complete, tested** |

Total `610 insertions, 40 deletions` across the two files.

**What it is.** The owner-approved §9 positive-evidence redesign plus the
RIG-124.2 finding-class history. Specifically:

- finding-class history per author-context, keyed on
  `category|normalised(evidence ‖ anchor ‖ detail)` with line numbers omitted;
- prior rounds injected into the next reviewer's prompt, with an explicit
  not-a-quota instruction;
- classes at two rounds reported as due to graduate;
- an authorisation spent only on positive evidence (exit 0 + parseable JSON +
  `pass`/`fail` verdict + `verdicts` array);
- a persisted per-attempt state machine: states `running / completed / failed /
  interrupted`, an in-flight nonce written before the spawn, exactly-once
  interruption recovery, `INFRA_STREAK_LIMIT = 3` with an explicit blocker;
- all ten vendor-specific error regexes deleted;
- `--ingest` for externally supplied reviewer JSON or transcripts: read-only,
  reconciles against recorded history, never authoritative, never overwrites.

**Test results, exact.**

```
node --test tests/release-blockers.test.js   →  49 pass, 0 fail
npm test (full CI gate)                      →  exit 0
    secrets suite        15 pass, 0 fail
    main suite        1,347 pass, 0 fail, 5 skipped  (1,352 cases, 18 suites)
    pi-extension         15 pass, 0 fail
    rig-mcp               6 pass, 0 fail
```

The 5 skipped cases are platform-gated (Linux-only, e.g. Xvfb process-group
handling reading `/proc`); they are skipped on macOS by design, not failing.

**Three pre-existing tests changed meaning** and were rewritten, not deleted,
because §9 reverses what they asserted:

| Old title | Now |
|---|---|
| `review-receipt counts a killed/timed-out reviewer spawn toward the re-review cap (RIG-124.1)` | `a killed/timed-out reviewer spawn is recorded but spends no authorization (RIG-124.3)` |
| `review-receipt keeps the retry cap when a pass report fails receipt validation` | `a pass report that fails receipt validation is an execution failure, not a spent authorization (RIG-124.3)` |
| `review-receipt still counts a launch failure that is not a provider limit (RIG-124.2)` | `classification uses process and output evidence, never vendor error text (RIG-124.3)` |

Four cases are new: interrupted-attempt recovery exactly once, the previously
untested `--interim` path, `--ingest` reconciliation, and the bounded
infrastructure-streak blocker.

The RIG-124.1 guarantee those tests protected — *an attempt is never silently
dropped* — is still asserted, now directly against the persisted record.
`wiki/tickets/RIG-124.md` and `wiki/Tickets.md` were updated to mark the
original cap-charging criterion **superseded** rather than rewritten, with the
reason and a pointer to the new trace.

**Neither file is in the Gate 1 frozen manifest** (16 files; verified).

## 2. Uncommitted work — wiki

| Group | Count | Nature |
|---|---|---|
| `wiki/reasoning/*` modified | 148 | `status: current` → `status: historical`, frontmatter only |
| `wiki/reasoning/*` modified | 7 | **also received a body marker line** — see below |
| New traces (untracked) | 5 | the vision, frustration, diagnosis, survey and state-machine traces |
| New planning package (untracked) | `wiki/specs/ai-sdlc-harness/` | this directory |
| Generated | `wiki/status.md`, `wiki/index/reasoning.md` | rebuilt by `scripts/build-wiki-index.js` |
| Tickets | `wiki/Tickets.md`, `wiki/tickets/RIG-124.md` | superseded-criterion citations |

**152 wiki files modified in total.** The live `status: current` set went from
198 to 58; `wiki/status.md` is 68 lines; `wiki/index/reasoning.md` retains all
382 entries including the 224 historical ones, so **nothing was made
unreachable** — only the always-read summary shrank.

**Finding, reported rather than fixed.** Seven traces received an inserted line
`<!-- needs-human-review: status -->` immediately after their frontmatter block.
That is outside the frontmatter, so the sweep was **not** strictly
frontmatter-only, contrary to how it was reported earlier in the session. The
files:

```
wiki/reasoning/2026-09-04-finished-product-design.md
wiki/reasoning/2026-09-05-overhaul-scope-measurements.md
wiki/reasoning/2026-10-13-standards-shipped-checks.md
wiki/reasoning/2026-10-14-closure-review-findings-resolved.md
wiki/reasoning/2026-10-22-legacy-pointer-resume-guard.md
wiki/reasoning/2026-10-23-ci-red-linux-runner-diagnosis.md
wiki/reasoning/2026-10-23-pr153-testplan-e2e-and-eligibility-fixes.md
```

No existing content was removed from any of them — one line was added.
Nothing in `scripts/` or `rig/` writes or reads that marker, so it is inert.
**Recommendation:** either drop the seven lines (restoring strict body
immutability) or move the signal into frontmatter as a `review:` field. Left
untouched pending the owner, per the preserve-everything instruction.

Mechanically verified: **apart from those seven lines, every change under
`wiki/reasoning/` is a frontmatter field.** No trace body bytes were altered or
removed anywhere.

Five new traces were given `date:`, `source:` and `summary:` frontmatter today
because the wiki budget gate requires a one-line summary on every trace; that
fix is what took the full gate from one failing case to green.

## 3. Research workspace — outside the repository, never committed

`~/rig-harness-research/clones/` holds shallow clones of harness2,
meta-harness, dspy, mem0, claude-mem, open-code-review and deepseek-harness
(~683 MB). `~/rig-harness-research/notes/SAFETY.md` records the rules that were
followed: **nothing from any clone was executed, installed, or given network
access.** No paid API call was made. No fork was pushed. No private code was
published.

## 4. Release blockers and open items

| Item | State, verified today |
|---|---|
| `AT-HD-7` | **GREEN.** `node --test --test-name-pattern "AT-HD-7" tests/onboarding-hardening.test.js` → 1 pass, 0 fail; the whole file is 8 pass / 0 fail. The earlier claim of "7 pass, 1 fail" does **not** reproduce on this branch, and the file is unmodified since its freeze commit `59afb8aa`. The directive's instruction to track it separately is satisfied by this verification; nothing is red. |
| Full local gate | **GREEN**, exit 0, numbers above |
| GitHub CI | **RED as of 2026-10-23** for three Linux-runner causes unrelated to this work: shallow checkout hides the v5 commit, `CI=true` switches Rig to CI-projected output the tests do not expect, and `bwrap`'s loopback returns `ECONNREFUSED` rather than `ENETUNREACH`. Diagnosed in `wiki/reasoning/2026-10-23-ci-red-linux-runner-diagnosis.md`; not addressed in this session. |
| v6.0.0 public artifacts | The README install flow still cannot complete because the public v6.0.0 archive URL returns 404 and the public git tag does not exist. Owner-controlled publication step. |
| Binding release review | The last authorised Codex review failed with 4 blockers and 14 major findings; no receipt was issued. Separate from this session's work. |
| 6.0.0 closeout | Untouched by this session and by this planning package. |

## 5. What is implemented vs proposed, stated plainly

| | Items |
|---|---|
| **Implemented and green** | the review state machine (C9), finding-class history and graduation *reporting* (C13 detection half), exactly-once interruption recovery for the review phase (C15 partial), `--ingest` |
| **Partially implemented** | C4, C8, C11, C13, C15, C16, C18 — a real mechanism exists with a named gap ([07-capability-inventory.md](07-capability-inventory.md)) |
| **Proposed only, no code** | C1 ledger, C2 profile, C6 scope-of-work, C12 pre-flight, C14 recursive improvement |
| **Demonstrated** | nothing beyond the review state machine. No measurement baseline has been taken; the M-series in [08-acceptance-matrix.md](08-acceptance-matrix.md) is a plan, not a result. |

## 6. Authorisation state

- Commits: **prepared, not made.** Two separate commits are the recommendation
  ([R-07](09-decision-register.md)): the review system with its tests, and the
  wiki changes.
- Pushes, deploys, external reviews, paid API calls: **none made, none
  authorised.**
