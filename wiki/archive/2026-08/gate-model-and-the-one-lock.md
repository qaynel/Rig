---
date: 2026-08-31
source: agent
topics: the-two-gates, authored-service-gate, specification-gate, catalogue-contract, delivery-plan, distribution-and-release, gate1-signing, policy-signer-recovery, review-receipts, services-and-reports, sanitation-and-remediation, host-and-ci-coverage, the-catalogue, testing-strategy, graft-mechanics, what-rig-is, onboarding-flow
status: historical
summary: Archived August 2026 reasoning on the gate model, the single lock, and the Gate 2 candidate retraces — 10 traces compacted.
---

# The gate model, the one lock, and the Gate 2 candidate retraces

Compacted on 2026-10-17 from 10 August 2026 reasoning traces. Bodies live in
git history; every decision, rejection, trap and verbatim owner ruling the
sources carried is reproduced below.

## What this theme settled

The threat model is narrow and was stated by the owner in one line: "We are
protecting the human from the agent, but not the human from the human." What
Rig guards against is an agent moving the goalpost nearer to hit a target. It
is not Rig's job to police what the developer does with their own intent,
because at the end the developer owns the code — and that ownership is why one
gate is enough.

There is exactly **one lock** (`D26`), and it locks the tests and the
acceptance criteria together. Business intent is highly recommended and
surfaced through every host, but **optional** (`D25`): the gate requires
acceptance plus tests and a *present* technical spec. Nothing is locked until
all three are in place and sound (`D27`), and "not yet frozen" is the normal,
correct default for anything still being designed — not a pending action. Only
the key holder can change a locked artifact, and when they do it is a quick
re-sign, not a fresh grilling cycle (Option A). An agent may *propose* that a
locked test looks wrong; it can never change one, because the signature over
the digest makes an agent edit stale and fails the gate.

Two defaults were adopted alongside: Rig flags which acceptance criteria it
*inferred* from existing documentation versus which the user gave it, so the
sign-off is never blind; and Rig checks the existing record — wiki, then
README / reasoning traces / `CLAUDE.md` / other markdown — before spending the
developer's time on a question.

`D23` carved a one-release exception scoping `AT-SHAPE-6` to the shipping leaf
alone, explicitly recorded *as an exception* rather than folded into the rule.
`D24` then ruled the MVP would be built in one pass at the agent's discretion,
superseding the one-leaf-at-a-time rule for that release, and `AD-24`/`AD-31`
staged the catalogue so placeholder content blocks only its own leaf. The Gate 2
candidate moved v0.6 → v0.12 across four correction rounds, and the project's
recurring mistake — reading an in-progress *state* as an outstanding *action*
and manufacturing a freeze/no-freeze decision from it — was named as the
RIG-112 root cause and fixed by phrasing in-progress state as state.

## Source traces

### 2026-08-21-one-gate-streamlining-intent.md
- **Summary:** Product spirit and intent behind the one-gate streamlining — the threat model restated, what the gate locks, and optimizing for least developer work.
- **Decisions:** none
- **Status:** historical
- **What it recorded:** The gate checks four artifacts are in place before freezing (business intent, technical specification, acceptance criteria, testing infrastructure that deterministically checks them), with the asymmetry that intent and tests are what the signature *locks* while the technical spec is only checked for presence. Rig produces boilerplate for all four, checks existing knowledge first, and declares outright anything it assumed or inferred. The cost being optimized is how much of the developer's time is spent answering queries. The trace itself is an instance of the behavior it describes.
- **Verbatim rulings / rejections / traps:** "We are protecting the human from the agent, but not the human from the human." On ownership: "Rig is a harness that lets anyone be their own product manager with a team of interns and junior developers. At the end, **the developer owns the code.** That ownership is the reason one gate is enough." On the lock: "One key. One freeze. The gate **locks the intent and the testing infrastructure**, and the yet-to-be-written code must adapt to that shell." On inference disclosure: the disclaimer form is *"I saw this is how you usually test / this is your acceptance criteria, so I added this here — feel free to say no or remove it."* Self-demonstrating instruction: Rig should "instinctively note it in the wiki" and then tell the user — "I noted this down because I found it useful; say the word and I'll remove it."

### 2026-08-21-one-gate-escape-hatch-resolved.md
- **Summary:** The open point on correcting a locked test mid-implementation is resolved as Option A — key-holder amends, instant re-sign.
- **Decisions:** none
- **Status:** historical
- **What it recorded:** Only the key holder can change a locked intent/test artifact, and doing so is a quick re-sign rather than a fresh grilling cycle. Plus the two adopted defaults (flag inferred vs given acceptance criteria; check the existing record before spending the developer's time).
- **Verbatim rulings / rejections / traps:** "**Chosen: key-holder amends, instant re-sign (Option A).**" On enforcement: "The agent may *propose* \"this locked test looks wrong because X\" but can never change it. The signature over the digest is what enforces this: an agent edit makes the signature stale and the gate fails." Rejection: "Rejected Option B (a wrong locked test forces a full return to grilling) because it rebuilds the gate friction this branch exists to remove."

### 2026-08-24-process-doctrine-and-one-lock.md
- **Summary:** Owner ruling on the canonical pipeline, the single lock, and why the freeze question keeps mis-firing — D25, D26, D27.
- **Decisions:** D25, D26, D27
- **Status:** historical
- **What it recorded:** The canonical pipeline: a task enters either as a new feature (business specs first) or an identified problem (bug report → root cause → proposed solution); then explore the codebase and existing documentation; then technical specs that are *genuinely open questions only*; then acceptance criteria; then testing infrastructure derived from them. Business intent is optional (`D25`). There is exactly one lock, over tests and acceptance together (`D26`). Nothing is locked until solution, acceptance and tests are all in place and sound (`D27`). RIG-112's mis-raised freeze question is traced to one descriptive line in a "What is still open" section being read as an action.
- **Verbatim rulings / rejections / traps:** The owner said this is the third or fourth time the process has had to be re-explained, "so it is etched here and in the gate hub so it stops recurring." On technical specs: "The technical spec is *not* a restatement of the business intent. It is exactly the questions that **cannot be inferred** from the existing codebase or existing documentation… If a technical 'question' is answerable from the code or the docs, it does not belong in the technical spec." On the lock: "**One lock. It locks the tests and the acceptance criteria together.**… The lock exists for one reason: to stop the agent moving its own goalpost — changing the acceptance so its own code passes. That is reward-hacking: you would never let an agent writing a test rewrite the question so the test passes." On the key: "The only way to change a locked expectation is the **user**, through the hardware key — that is exactly why the key exists… An agent may *propose* a change to a locked test; it can never *make* one." On simplicity: "The system must be **simple**: one lock, one key, one re-sign to change. Not a web of separate freezes." On freeze timing: "'Not yet frozen' is the **normal, correct default** for anything still being designed — it is **not** a pending action or an open decision." Trap and fix: "The ticket-burndown pass read that *state* as an outstanding *action* and manufactured a freeze/no-freeze decision from it… The fix is to phrase in-progress state as state, never as a latent 'freeze now?' prompt, so the question does not regenerate from the wiki."

### 2026-08-21-at-shape-6-one-release-exception.md
- **Summary:** D23 — `AT-SHAPE-6` is evaluated against the lint-format leaf alone for this release; the other 114 are excluded from this one pass, as an explicit exception.
- **Decisions:** D23
- **Status:** historical
- **What it recorded:** `AT-SHAPE-6`'s filler-content check ran across all 115 leaves while only one was meant to ship, so transcribing it literally into the specification gate would keep `npm test` permanently red. The owner first asked whether filling the 114 leaves' placeholders with dummy content would clear the gate; traced against the frozen text, it does not. The real gap was that `AT-SHAPE-6` was never narrowed to match D21's release boundary. Landed in `gate1/business-spec.md` and `gate1/acceptance.md` as a dated revision note plus an inline exception clause, in the same two-file pattern D19–D22 used.
- **Verbatim rulings / rejections / traps:** Rejection of bulk filling: "So 'fill in TODOs' was rejected as a path to green, whether the fill is literal `TODO`, generic boilerplate, or hand-varied plausible-sounding text — all three fail the same case, just at different layers." Trap recalled: "the project's own history is that 432 placeholder files once passed a shallower check, which is why the two-layer gate (mechanical + semantic) exists at all." Owner ruling: "skip entirely, but **only for this pass** — not a standing rule… For now, this is a one-time exception, and it must be recorded unambiguously as an exception rather than folded into `AT-SHAPE-6` as if it were the rule." Fix principle: "The fix is to scope the check, not to manufacture content."

### 2026-08-21-gate2-v0.9-at-shape-6-retrace.md
- **Summary:** D23 carried into Gate 2 as checkable acceptance criteria — §5.6, §12.3 item 3, §17.2 item 3, AD-24 and the §13 `AT-SHAPE-6` row.
- **Decisions:** D23
- **Status:** (no status field)
- **What it recorded:** The owner flagged that the business-intent fix existed but the design document still pointed at the unscoped "review all 115 leaves" version, and asked for the narrowing to be carried in as checkable criteria rather than prose. Every place Gate 2 transcribes `AT-SHAPE-6` was traced; §12.3 item 3 was the load-bearing bug because item 4 already narrowed to lint-format but item 3 did not. D22's `AT-CI-3` narrowing was confirmed already consistent in both gates. Candidate bumped to v0.9, Gate 1 digests re-pinned, six other open round-5 findings left untouched.
- **Verbatim rulings / rejections / traps:** The owner's reasoning, as recorded: "a prose mention that isn't wired into a traceability row or a release-gate condition doesn't actually change what a future implementer builds." Scope note: "Did not mark Gate 2 `FROZEN` and did not edit any Gate 1 file."

### 2026-08-21-gate2-v0.7-round4-corrections.md
- **Summary:** Gate 2 v0.7 — the two accepted round-4 corrections: the grade short-circuit must fire on failure not on a clean pass, and repository-CI applicability becomes grade-aware.
- **Decisions:** AD-32
- **Status:** historical
- **What it recorded:** Finding 1 (blocker): §5.7's "returns at the lowest level that yields a definitive verdict" read literally stops evaluation after any clean Policy pass, which `AT-LF-8`/`AT-LF-9` exist to forbid. Corrected so a failure may short-circuit, a clean lower-grade result continues through the selected grade, and the reported assurance is the highest grade actually completed. Finding 2 (major): §8.9's generic runner and §11.3's lint-format contract never reconciled on whether a Policy-grade leaf runs in a pre-existing Rig CI job; resolved by making repository-CI applicability grade-aware and saying so identically in both places. Minor (three senses of "verified") carried into the eventual claim-string test rather than churned.
- **Verbatim rulings / rejections / traps:** The three named failures: "over-claim (report a Policy result as Evidence), over-run (silently run above the selected grade), and the newly-explicit under-run (stop short of the selected grade on a clean lower-grade pass)." Non-change: "Neither Gate 1 file: both digests recompute to their pre-existing values (`5175be10…`, `ffd49303…`)… Gate 2 remains a **candidate**; freeze still requires a clean fresh round-5 receipt bound to `cdd07515…` and the intent owner's Gate 1 signature."

### 2026-08-21-gate2-v0.10-round6-corrections.md
- **Summary:** Round 6 failed v0.9 with three findings — unauthored-leaf redness, the freeze-checklist pointer, and `AT-PRESENCE-2`'s unprovable claim.
- **Decisions:** AD-24, AD-30, AD-31
- **Status:** historical
- **What it recorded:** (1) Slice 2's "keep all unauthored leaves red" would only move D23's deadlock from the spec gate to the code gate; corrected so red is a catalogue status and future-support blocker, not a lint-format release failure. (2) Freeze now points to §17.1 and Slice 15 is release evidence only — freeze happens once, before implementation. (3) `AT-PRESENCE-2`'s automated-fixture claim narrowed to what automation can prove, per D19. Gate 2 moved to v0.10 at digest `69c38149...`; the round-6 receipt is void for the new bytes.
- **Verbatim rulings / rejections / traps:** "Per D19, the signature artifact cannot prove the key class or the user's hardware touch." Residual: "a fresh review is still required."

### 2026-08-21-gate2-v0.11-carried-review-corrections.md
- **Summary:** Gate 2 v0.11 — four carried round-5 mechanism corrections: Evidence/CI separation, remediation rollback journal semantics, fail-closed recovery registration, and abnormal results in the report schema.
- **Decisions:** AD-8, AD-30, AD-32
- **Status:** historical
- **What it recorded:** Gate 2 had made the CI graft a constituent check of Evidence, making Evidence logically unreachable before a separate approval; v0.11 made the local Evidence verdict depend on locally captured rerunnable evidence and treats CI as an independent enforcement surface. Install failure retains applied writes for resume while remediation failure rolls back, so one append-only journal now names the transaction kind. Recovery registration refuses with `user_verification_unavailable` when authenticator user verification cannot be requested. All six abnormal outcomes were added to the closed report enum.
- **Verbatim rulings / rejections / traps:** "CI absence remains visible; it does not downgrade a completed local result." On crash reconciliation: "crash reconciliation accepts only the exact expected output or exact preimage and blocks every third state." Carried open finding: "The separate round-5 finding that most traceability rows name no executable target remains open. It belongs to the complete testing-infrastructure pass and must be resolved before the oracle is signed."

### 2026-08-21-d24-owner-approval.md
- **Summary:** Owner approval of D24 and the MIT distribution plan.
- **Decisions:** D24
- **Status:** historical
- **What it recorded:** The one-line approval that converted the D24 proposal and the MIT distribution approach into a ruling.
- **Verbatim rulings / rejections / traps:** "> Looks good, go ahead"

### 2026-08-22-gate2-v0.12-d24-retrace.md
- **Summary:** Gate 2 v0.12 retraces the approved D24 one-gate oracle — one v2 signed message, Gate 2 present but never frozen, and 55 (not 56) vendored skills.
- **Decisions:** AD-13, AD-18, AD-24, AD-28, AD-31
- **Status:** historical
- **What it recorded:** The working design signs business intent, acceptance, and a stable testing-infrastructure manifest under one v2 message; Gate 2 is present but never frozen. D24 restores the authored-service check to all 115 leaves at declared Policy grade, activates only detected or explicitly selected host trees, requires every physically vendored skill in distribution, and makes the named-tag `5.0.0` path part of the complete release. The repository audit found 55 `SKILL.md` packages, not the 56 the original D24 trace stated.
- **Verbatim rulings / rejections / traps:** "The working design uses the observable intent — every vendored skill — and records 55 as the inventory-backed count. No nonexistent extra skill is invented to satisfy a stale number." On the verifier's limits: "The oracle verifier owns integrity and target coverage, not a pre-implementation false green… The manifested product targets may then fail for named missing behavior until implementation clears them without changing their bytes."
