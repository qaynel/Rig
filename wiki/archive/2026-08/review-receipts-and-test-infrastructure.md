---
date: 2026-08-31
source: agent
topics: review-receipts, agent-working-conventions, testing-strategy, onboarding-flow, enforcement-and-git-dispatch-wiring, host-and-ci-coverage, distribution-and-release, rig-135-subprocess-cleanup
status: historical
summary: Archived August 2026 reasoning on the review-receipt cap, the dead-citation audit, the stale-checkout review, and the router-hygiene and fresh-checkout test fixes — 14 traces compacted.
---

# Review receipts and test infrastructure

Compacted on 2026-10-17 from 14 August 2026 reasoning traces. Bodies live in
git history; every decision, rejection, trap and verbatim owner ruling the
sources carried is reproduced below.

## What this theme settled

`RIG-124` capped automatic re-reviews at one per author-context, added
`--interim` (same review, never writes the binding receipt) and
`--force-rereview` as a visible override, and defined the lightweight
task-weight carve-out. It also established the inference that wrapper-level
retry/model policy sits outside the frozen oracle, by checking the manifest's
exact five-file membership.

`RIG-124.1` then found a real **lost-update race**: the failure counter is only
persisted *after* the reviewer subprocess returns, so a killed or timed-out
attempt is never counted — the cap silently fails open in exactly the case it
exists to bound. The follow-up investigation into *why* a subprocess took the
full 30 minutes eliminated three hypotheses with direct measurement, then — on
the user's correct pushback that a 30-minute subprocess is itself suspicious —
found a genuine leaked, orphaned, still-running process. The mechanism:
multi-line shell scripts fork real children, and killing the wrapper does not
touch them. The revised recommendation paired the cap bug with making a kill
terminate the whole process group, because the real problem was never that 30
minutes is too short — it is that a kill does not reliably stop everything a
review started.

The RIG-125/130/132/133 audit found **nine cited analysis documents that do not
exist in the repository** — committed as dangling citations because the
analysis sessions ran in an uncommitted workspace and the trace files were lost
before anyone ran `git add`. The follow-up pass then re-evaluated all four
tickets from committed evidence only, corroborating three of them independently
and narrowing RIG-130's evidence from seven review rounds to the six that match
committed receipts. It also found an arithmetic error in RIG-132 independent of
any missing source.

A separate review round recorded its own wrong first pass: it reproduced 26
failures against a **local checkout 11 commits behind the remote**, concluded
real defects, and had to retract — the owner's original report was accurate
throughout.

`RIG-135`'s scope was expanded by owner instruction from two mandatory
subprocess sites to all nineteen classified `debt` sites, excluding the three
already tracked as their own tickets. The routing-hygiene bundle
(RIG-151/152/124.2) then landed as prose-only edits to four installed-payload
sites, and `RIG-154` fixed fresh-checkout `npm test` with a `pretest` bootstrap
guard locked by a non-frozen structural test.

## Source traces

### 2026-08-25-rig124-implementation.md
- **Summary:** RIG-124 landed straight from its own draft acceptance with the inferences declared — the re-review cap, --interim, --force-rereview, and the task-weight carve-out.
- **Decisions:** RIG-124
- **Status:** historical
- **What it recorded:** Why no further grilling round ran (the ticket's problem statement and draft acceptance were already derived from a prior investigation against three real transcripts, and the user explicitly delegated). The inference that `AT-GATE-3` does not require re-signing, checked against the manifest's exact five-file membership and verified by the frozen test still passing unmodified. The cap design: failures tracked per `--author-context` in a sibling `<out>.attempts.json`, a fail incrementing and a pass clearing, a refusal above `MAX_RE_REVIEWS` (1), and `--interim` never writing the binding receipt. The inferred task-weight carve-out definition. The six changed files.
- **Verbatim rulings / rejections / traps:** The user's delegation, quoted: "not much context from my side... just try to resolve it on your own". The inference declaration: "Declaring the inferences made along the way, since no separate sign-off conversation happened". The re-sign conclusion: "So the re-review cap, `--interim`, and `--force-rereview` are wrapper-level policy outside the frozen oracle; no re-sign needed." The carve-out, verbatim: "a one-line fix, a factual question, or a single-file edit with no cross-file coordination and no wiki-truth change (no new decision/spec/status/rejected approach)." Design guarantee: "only a non-interim run produces AT-GATE-3 evidence, so a cheap interim pass can never be mistaken for the release receipt. Default (no new flags) behavior is byte-identical to before."

### 2026-08-26-rig124-cap-lost-update.md
- **Summary:** RIG-124.1 — a genuine lost-update race: a killed or timed-out reviewer attempt is never counted, so the cap silently fails open in the one case it exists to bound.
- **Decisions:** none
- **Status:** (no status field)
- **What it recorded:** The checkout sanity check done first, explicitly because the same stale-checkout mistake had happened earlier that day — confirming the code under test was identical to what the red report tested. Two reproduction attempts, both passing, so the failure does not reproduce in isolation or as a single file. The duration clue (1,800,952 ms against `TIMEOUT_MS = 30 * 60 * 1000`). The cap implementation read line by line, identifying that the incremented count is written only after the spawn returns, while `fail()` exits the process first. A deterministic repro simulating the same observable effect with a hanging fake reviewer, with the full three-call output transcript.
- **Verbatim rulings / rejections / traps:** The conclusion: "This is a genuine lost-update race in the cap's persisted state, not a test flake and not stale bytes. The mechanism: **a killed or timed-out reviewer attempt is not counted as a failure**, because the failure counter is only persisted after the subprocess call returns cleanly." The irony named: "a reviewer subprocess timing out (exactly the kind of stuck/expensive call RIG-124 exists to bound) is the one case where the cap silently fails open and grants an extra, uncounted attempt instead of counting toward the limit." On the cap state's shape: "Cap state lives in one file… not partitioned per author-context; it is a single mutable slot whose one JSON blob happens to carry an `authorContext` field." Release impact: "RIG-120's ceremony should not proceed until this is fixed or the owner explicitly accepts the residual risk." Not a regression: "the cap logic has been shaped this way since RIG-124 landed; today's red gate is the first time it was exercised under conditions to trigger it."

### 2026-08-26-rig124-timeout-duration-investigation.md
- **Summary:** Why the reviewer subprocess took 30 minutes — three hypotheses eliminated by measurement, then a real leaked orphaned process found on the user's pushback.
- **Decisions:** none
- **Status:** (no status field)
- **What it recorded:** Four ranked hypotheses and their elimination: only one test file drives the script and every call routes through a local stub; the prompt is handed to the subprocess as direct input, the standard non-deadlocking way; heavy OS contention tested directly (584 ms baseline with a realistic ~305 KB prompt, 230 ms under synthetic load pushing the load average to ~2.3x core count); and no sleep event in the window with an active caffeinate assertion. The superseded conclusion. Then the addendum: a live orphaned process still running, reparented to PID 1, alive since the earlier investigation, with a working directory that no longer exists. The root mechanism confirmed with a controlled test. The revised recommendation.
- **Verbatim rulings / rejections / traps:** The user's pushback, quoted: "a subprocess taking 30 minutes is itself suspicious — is there an actual defective/stuck process, not just noise?" And the acknowledgement: "That's a fair challenge to the conclusion above, and checking for it directly (rather than reasoning about plausibility) turned up a genuine defect." Root mechanism: "the stand-in script has more than one line, so the shell interpreting it must fork a real child process for each step rather than replacing itself. When the wrapping process is killed… only that direct shell is terminated. Any child *it* had already forked partway through the script is not touched by that kill and is never reaped; it is orphaned and keeps running indefinitely." Why it matters beyond one process: "the real reviewer program… is a full agent that plausibly spawns its own child processes internally while it works. If that combination — kill the wrapper on timeout — doesn't reliably tear down everything underneath it, a review that the tool believes it cancelled can keep running in the background: still doing work, still consuming budget, indefinitely, invisible to anything watching the wrapper. That is a more serious version of the problem than 'the retry count is wrong' — it means 'killed' reviews may not actually stop." Rejected throughout: "raising the timeout was never on the table and still isn't — this addendum confirms why: the problem was never that 30 minutes is too short, it's that a kill doesn't reliably stop everything a review started." Fix pairing: "the standard fix is spawning it in its own process group and signaling the group, not just the one tracked process."

### 2026-08-26-rig125-130-132-133-reinvestigation.md
- **Summary:** Status refresh against current code — the four tickets' cited reasoning traces do not exist in the repository, and RIG-125's and RIG-132's pre-v5 work has already landed.
- **Decisions:** none
- **Status:** (no status field)
- **What it recorded:** Finding A: eight cited 2026-08-25 reasoning documents do not exist under `wiki/reasoning/` on disk, were never added by a real commit on any ref, and were checked against thirteen named branches with zero matches everywhere — the citations were dangling at the moment they were committed. Finding B: RIG-125's three named tests and its uninstall-authority collapse are all done in the current tree, apparently as a side effect of closing RIG-126/127/128, with 26 tests passing across the four files. Finding C: RIG-132's pre-v5 ratchet slice is fully implemented and green (`rig/raw-registry-access.json` with `expected_count: 1`, the checker printing "raw registry debt: 1", 5/5 allowlist tests). Finding D: RIG-130 and RIG-133 remain fully unimplemented, confirmed by grep. Net effect on sequencing.
- **Verbatim rulings / rejections / traps:** Why the files are missing: "the only commits that touch these paths are Conductor session-checkpoint commits from 2026-08-25 (worktree snapshots of a session that had them as uncommitted files)… the underlying analysis sessions ran in a different, uncommitted workspace and the trace files were lost before anyone ran `git add` on them." Defect classification: "This is a live violation of `wiki/reasoning/README.md` ('a trace is written once ... never edited' — implying it is committed) and of `CLAUDE.md`'s 'a wiki that has drifted from the branch is a defect, not stale documentation.'" The owner decision it raises: "**This is an owner decision, not one this pass makes silently:** either the original session transcripts are recoverable and the eight traces get filed verbatim (as the convention requires — traces are never reconstructed from memory, only filed as originally written), or the tickets' `[[...]]` citations to these eight names are struck and replaced with a note that the analysis was lost pre-commit." Sequencing observation: "The recorded order was not followed literally, but the two items it called prerequisites for RIG-125… turn out not to have been strict blockers in practice… What they cannot yet do is get signed, which still needs RIG-133."

### 2026-08-26-rig125-130-132-133-committed-evidence-reevaluation.md
- **Summary:** Re-evaluating the four tickets from committed evidence only — three corroborated independently, RIG-130 narrowed to six verified rounds, and an arithmetic error found in RIG-132.
- **Decisions:** none
- **Status:** (no status field)
- **What it recorded:** Finding A: the dead-citation surface is bigger than the wiki-links — RIG-132 also cites two `sources/reference/*.raw.md` files by ordinary markdown link, neither of which exists, and they were the verbatim source material behind its most speculative part. The dead-citation set spans RIG-126..134, `Tickets.md` and `status.md`. Finding B: a surviving committed document (the prev5 gate runbook) plus the closed RIG-134 ticket independently corroborate three of the four tickets, with RIG-134 carrying a committed grep transcript. Finding C: RIG-130's seven-round table verified row by row against committed receipt JSON — six match exactly, the seventh and worst-looking has no committed source. Finding D: RIG-132's "~124 addressable claim anchors (79 + 37 + 68 + 19)" does not add up. Net effect per ticket with explicit confidence levels.
- **Verbatim rulings / rejections / traps:** Method stated up front: "for every checkable factual claim in the four ticket bodies, find independent committed evidence (code, real test runs, other surviving reasoning docs, real data files) rather than trusting the ticket's own prose or the dead citations." RIG-133's standing: "**RIG-133's central claim (a byte-pinned oracle case spends coverage budget on dead code while the real shipping path, `contractFor`, carries no signed case) stands independently of the missing 'escaping the quadratic' analysis.**" RIG-130's narrowing: "**RIG-130's problem statement and its non-dependence on the missing 7th data point both hold; cite the six verified rounds, not seven, until the round-3 receipt is recovered.**" RIG-132's arithmetic: "`79 + 37 + 68 + 19 = 203`, not 124. And `C(124,2) = 7,626`… while `C(203,2) = 20,503`, not ~7,600… This is a defect in the ticket's own arithmetic, checkable with no reference to any missing document. It does not overturn the ticket's qualitative point… but the specific numbers quoted should not be repeated as verified until re-derived from the current spec." RIG-132's net standing: "The ticket's *shipped* work is solid; its *unshipped* architectural framing should not be treated as verified until the source material is recovered or the numbers are redone."

### 2026-08-26-review-round-code-level-findings.md
- **Summary:** Review re-run after the gate-red finding — the first pass was wrong against a checkout 11 commits behind; the second pass verified the real current state, with three items still unowned.
- **Decisions:** none
- **Status:** (no status field)
- **What it recorded:** The first pass reproducing the same 26 failures and finding real-looking defects, then the owner's "I pulled in the resolution of 6 tickets" prompting the check that revealed the stale checkout. How it was fixed without discarding work (`git stash push -u` with a named entry preserved pending owner review, then a clean fast-forward). The second pass with the full gate green at 474/474 root. What the merge confirmed fixed, re-checked by hand rather than inferred from a green suite. Four items still open in the real current code: RIG-127.11 (uninstall can hard-crash on a corrupted legacy global config, with no test feeding one in), RIG-127.12 (legacy pre-RIG-104 managed-block records over-strip via a wildcard regex), an unowned `rig/mcp-runtime/` duplicate whose copy of the shared instruction bundle has already diverged by 57 lines, and 127.10's unasserted adjacent gap.
- **Verbatim rulings / rejections / traps:** The retraction, verbatim: "This was wrong… Every failing test in both the 2026-08-25 and this session's first-pass report was therefore a stale-checkout artifact, not a real defect in the merged work — **the owner's original claim was correct.**" Why the re-review was done by hand: "re-run by hand against the real, current code (not re-delegated, to avoid re-spending the same investigation) — specifically checking whether the defects found in the first pass still exist in the merged version, since a green suite does not by itself prove a defect was fixed; it only proves the tests that exist pass." Bottom line: "Three items remain unowned or uncovered by any current test… None of the three shows up as a red test today, which is exactly why they were still there after six tickets went green." Why it was recorded at all: "recording both because the first one was wrong for a reason worth keeping on record."

### 2026-08-26-rig135-scope-expansion.md
- **Summary:** Owner instruction expands RIG-135 to cover all 19 classified debt subprocess sites, excluding the three already deferred to their own tickets.
- **Decisions:** none
- **Status:** (no status field)
- **What it recorded:** The prior scope (two mandatory sites plus the reference implementation, with every other `debt` site opportunistic and tracked by a build-time ratchet) and what the instruction changes. The three `separate-follow-up` sites excluded by name and why, and the 18 `allowlisted` sites left unaffected. That no new technical uncertainty is introduced. What was applied in the same change.
- **Verbatim rulings / rejections / traps:** Owner instruction, verbatim: "expand the ticket to include the new sites too except the 3 which we deferred to other tickets." On the exclusions: "they're already tracked as their own tickets (RIG-135.1 #78, RIG-135.2 #79, RIG-135.3 #80) pending a browse-skill-owned decision on Bun-native group-kill, which this ticket has no standing to make." On the allowlisted sites: "they were individually verified safe outside the helper indefinitely, not deferred." Scope-not-investigation note: "This is a scope ruling, not a new investigation — it changes which already-classified sites are mandatory-before-close versus opportunistic, and it does not touch the frozen recursive-cleanup contract, the test oracle, or the API-shape question already flagged as outstanding."

### 2026-08-31-routing-hygiene-oracle.md
- **Summary:** Grilling oracle for RIG-151/RIG-152/RIG-124.2 — acceptance as observable cases plus tests/installed-router-hygiene.test.js (3 tests, currently red). Also the first instance of the mechanical breakage-count lint RIG-153 specifies. Remaining gate input: the reframed wording for the three routing.md sites (rig-product-design).
- **Decisions:** none
- **Status:** historical
- **What it recorded:** The problem (three passages of Rig-internal dev doctrine that read as false or dangling in a stranger repo) and the outcome. Explicit in-scope and out-of-scope lists. Four observable acceptance cases. The testing infrastructure, asserting on the source files directly because they equal the installed copies, with negative assertions on the defect shapes plus a positive pincer so bare deletion does not pass. The open decision blocking the freeze.
- **Verbatim rulings / rejections / traps:** The positive pincer's purpose: "Negative assertions on the defect shapes plus a positive pincer (cadence guidance and `rig/tier-1/` paths must still be present, just reframed) so bare deletion does not pass." Red state: "Currently **red**: 3/3 fail against the unmodified router." Out of scope: "any `payload.js` transform or two-file split (rejected, option B); the `(RIG-124)` test-title convention in `tests/release-blockers.test.js` (dev-only, never installed); the D24 mechanical-detection question (untouched)." Lint seed: "This is also the seed of the mechanical breakage-count lint [[RIG-153]] calls for — a grep-level check for the RIG-149…152 defect classes with no model call."

### 2026-08-31-routing-hygiene-design.md
- **Summary:** Technical design for RIG-151/RIG-152/RIG-124.2 — the exact reframed wording for four installed-payload sites (three in routing.md, one in tdd/SKILL.md x3 copies), the seams touched, the slice order and verification, and the one gate-mechanics point to confirm before implementation (approve-gate1.js is the MVP oracle ceremony, not re-armed per POLISH ticket).
- **Decisions:** none
- **Status:** historical
- **What it recorded:** The current-state trace (plain `{"op":"copy"}` with no templating; byte-identity proven by the bootstrap test; four `(RIG-124)` occurrences in installed payload; the three tests that read `routing.md` and must stay green). The exact FROM/TO wording for all four sites plus a coherence follow-on site 3b. Oracle regex conformance traced rather than assumed. Data/safety boundaries, slices and verification. Rejected alternatives. The gate-mechanics note and the owner's sign-off.
- **Verbatim rulings / rejections / traps:** Rejected alternatives, verbatim: "**`payload.js` transform** — rejected in the option-B decision; puts adaptation in Rig's installer code, the opposite of the forward-deployed model." / "**Bare deletion of the phantom lines** — rejected; loses the contributor guidance and the onboarding signal for barely-lower cost than the reframe." / "**Leaving Site 3b (the '3-minute status.md cadence' mention) untouched** — rejected; it becomes an orphan phantom the moment Site 2 lands, and the fix is one clause." / "**Adding `tests/installed-router-hygiene.test.js` to `wiki/gate1/testing-infrastructure.manifest`** — rejected. That manifest is the MVP D24/D28 oracle; `check-advanced-spec.js` asserts every manifested test title maps to a Gate 1 acceptance ID. A hygiene lint has no such ID." Gate-mechanics note: "For this bundle the 'one signature' the grilling gate calls for is the intent owner's **informed approval of the drafted wording above plus the red `tests/installed-router-hygiene.test.js`** — recorded here and on the tickets — taken before implementation, not the `approve-gate1.js` run. If the owner wants the SSHSIG ceremony extended to cover this test, that is a larger change (a new Gate 1 acceptance ID) and should be its own decision." Sign-off: "**Owner approved 2026-08-31.**… the owner declined to extend the ceremony to this test."

### 2026-08-31-routing-hygiene-implementation.md
- **Summary:** Implementation trace for RIG-151/RIG-152/RIG-124.2 — the frozen four-site reframe was applied to rig/tier-1/routing.md (4 paragraphs) and the (RIG-124) suffix deleted identically from the three tdd/SKILL.md copies. Hygiene oracle 3/3 green, full npm test gate green. Superseded by the close-out trace.
- **Decisions:** none
- **Status:** superseded (by 2026-08-31-routing-hygiene-close-out)
- **What it recorded:** Slice A's four paragraph edits with their before/after. Slice B's identical deletion across the three tdd copies, with the post-edit git blob hash identical across all three (`0853a079`). Verification including the regex bars re-checked directly. A four-pass report-only code review with no findings. The full gate, which initially failed one pre-existing unrelated test, confirmed pre-existing by stashing all branch changes and re-running on a clean tree.
- **Verbatim rulings / rejections / traps:** Scope discipline: "No edits to the numbered pipeline steps or the skill-index table." Review finding: "**No findings.**… reframe reduces coupling (the installed router no longer asserts Rig-internal cadence onto stranger repos)." Pre-existing failure root cause: "the bundled `rig-mcp` runtime deps were never installed in this workspace."

### 2026-08-31-routing-hygiene-close-out.md
- **Summary:** RIG-151/RIG-152/RIG-124.2 closed — the frozen four-site reframe landed in routing.md and the three tdd/SKILL.md copies; tests/installed-router-hygiene.test.js is 3/3 green and the full npm test gate passed.
- **Decisions:** none
- **Status:** historical
- **What it recorded:** What shipped in each file, the verification (3/3 hygiene plus the full gate at node suite 553/553), and the three tickets closed.
- **Verbatim rulings / rejections / traps:** "No installer-code transform; source == installed (option B)."

### 2026-08-31-routing-hygiene-traceability-fix.md
- **Summary:** CI traceability failure on RIG-151/RIG-152 — Acceptance bullets lacked evidence references; rewritten with test titles and one manual spot-check; check-ticket-traceability.js and full npm test gate green.
- **Decisions:** none
- **Status:** historical
- **What it recorded:** The two CI errors, the root cause (the checker requires every bullet in a Done ticket's `## Acceptance` section to end with either `→ tests/<file>::<title>` or `→ manual: <reason>`, and both tickets had prose only), the fix per ticket, and the verification with the manual-evidence count moving 14 → 15.
- **Verbatim rulings / rejections / traps:** The precise diagnosis: "The hygiene oracle tests were green; the ticket docs did not satisfy the RIG-131 traceability gate." And: "No change to `tests/installed-router-hygiene.test.js` — the failure was in oracle docs, not test code."

### 2026-08-31-rig-154-fresh-checkout-npm-test-design.md
- **Summary:** Technical design for RIG-154 — fresh-checkout `npm test` fails because AT-HOME-1's fake npm copies a rig-mcp/node_modules tree nothing in the root run creates. Fix is a canonical bootstrap guard appended to the existing `pretest` (D1), locked by a structural non-frozen test asserting the guard is present and CI carries no masking `npm ci --prefix rig-mcp` step (D2). Both changes force a Gate-1 re-sign because `wiki/gate1/package-scripts.json` is in the signed manifest.
- **Decisions:** none
- **Status:** superseded (by 2026-08-31-rig-154-close-out)
- **What it recorded:** The oracle carried verbatim from the grilling handoff as an unsigned draft, with outcome, in-scope, out-of-scope/non-goals and four observable acceptance bullets. The current-state trace of what `npm test`, `pretest` and `test:code` actually do and in what order. The frozen surface confirmed against the branch. D1's bootstrap mechanism and D2's regression lock. Ordered slices, data/safety/failure boundaries, and risks.
- **Verbatim rulings / rejections / traps:** Non-goals, verbatim: "No edit to `tests/advanced-oracle.test.js`." / "Do not commit `rig-mcp/node_modules`; `rig-mcp/package.json` + `package-lock.json` stay source of truth." / "No npm-workspaces re-architecture of rig-mcp." / "Real-npm clean-environment E2E is a separate follow-up (RIG-155), not this one." On the precedent reused: the existing `pretest` is "a guard/fallback that materialises the Python venv only when it is missing."

### 2026-08-31-rig-154-close-out.md
- **Summary:** RIG-154 closed — the root `pretest` rig-mcp bootstrap guard (D1), the non-frozen structural lock `tests/rig-mcp-bootstrap.test.js` (D2), and the CI-step deletion all landed in PR #140 / a15d4267, which also carried the Gate-1 re-sign (gate1.sig + allowed-signers + manifest + package-scripts.json). Fresh-checkout `npm test` proof recorded below: exit 0, AT-HOME-1 green, oracle verified 5 files / 73 cases.
- **Decisions:** none
- **Status:** historical
- **What it recorded:** What shipped: the brace-grouped `pretest` mirroring the venv guard's check-or-build precedent; the two-assertion non-frozen structural test; the CI parity change deleting the standalone install step; and the Gate-1 re-sign done in the same PR by the human key holder, moving `gate1.allowed-signers` to an `ssh-ed25519` key. The fresh-checkout proof procedure and the `npm test` transcript with exit 0, AT-HOME-1 green at 27.7 s, and the oracle verified at 5 files / 73 cases. Three notes on the evidence. The RIG-155 follow-up. Ticket bookkeeping.
- **Verbatim rulings / rejections / traps:** Re-sign warning: "No further re-sign is owed — the `--confirm-digest-delta 1408f38…` step in the original close-out handoff described the pre-merge draft state and must not be re-run." Evidence note on AT-HOME-1: "Its 27.7 s runtime is the real MCP client connecting to the installed server and calling `rig_instructions`, so the bootstrapped tree is genuinely functional, not a stub." Non-regression note: root `package-lock.json` "is written by the `npm install` bootstrap step (this repo does not commit a root lockfile) and is not produced by `npm test` or the `pretest` guard. Not a RIG-154 regression." Follow-up scoping: "[[RIG-155]] — real-`npm`, clean-container E2E of the customer install path… Explicitly a non-goal of RIG-154 (which keeps AT-HOME-1's fake-`npm` fixture); filed so the customer-path guarantee is tracked rather than assumed."
