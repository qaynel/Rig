---
date: 2026-08-31
source: agent
topics: agent-working-conventions, what-rig-is, the-two-gates, delivery-plan, gate1-signing, testing-strategy, trust-and-failure-boundaries
status: historical
summary: Archived August 2026 reasoning on the wiki design, the communication rule, checkpointing, token burn, the generated summary and the routing SOP — 8 traces compacted.
---

# The wiki and the agent working conventions

Compacted on 2026-10-17 from 8 August 2026 reasoning traces. Bodies live in
git history; every decision, rejection, trap and verbatim owner ruling the
sources carried is reproduced below.

## What this theme settled

The wiki's governing split was fixed on day one: **the trace is the record and
is immutable; the hub is the synthesis and is rewritten freely.** A trace lands
at `wiki/reasoning/YYYY-MM-DD-<slug>.md` verbatim, never edited, with
frontmatter naming the date, source, hubs touched and decision IDs; the hubs
and the decision index are then updated to cite it. Every hub has six fixed
parts and never restates frozen text. The owner approved the design verbatim:
"Yup looks good."

Communication was escalated from soft policy to a **dedicated rule file** —
option B of three, chosen over sharpening existing text (which had already
drifted) and over an output hook (kept in reserve). The rule bans wiki paths,
section numbers and decision IDs from the first-pass reply and frames the user
as a product manager who needs the problem, the options, the business cost and
a recommendation.

Checkpointing was tightened by the owner from a 15-30 minute interval to **every
three minutes of active work**, explicitly including progress made *between*
steps, because that in-between work is what gets lost and re-paid for. No
wall-clock enforcement hook was added; the enforcement ladder is sharpen the
words → dedicated rule → output hook.

The token-burn investigation then found the opposite failure: the per-turn
cadence tax is correct for long multi-step work but is a flat tax on small
tasks, and the real multipliers were a nested reviewer-model retry loop, using
the full gate as the inner loop, and a transcript re-ingestion meta-loop.
Context engineering was named the wrong lever — no trace hit a context wall;
they hit the account rate limit.

The 2026-08-30 office-hours handoff then diagnosed three root problems (a
never-frozen oracle so the target kept moving; the wiki becoming a second
codebase with `status.md` rewritten in ~93% of commits; and additive-only,
reuse-blind code generation) and discovered that most of the mechanism already
existed — so the work was doctrine, wiring and one generator script. The
generated-summary design then rejected every adoptable tool and chose a small
Node script, with a check that fails when either generated file differs.

## Source traces

### 2026-08-19-wiki-design.md
- **Summary:** The wiki design — where it lives, the tree, what a hub contains, how traces are filed, and the owner's verbatim approval.
- **Decisions:** none
- **Status:** historical
- **What it recorded:** `wiki/` at the repo root with `project-dev-docs/` ceasing to exist, every file moved with `git mv` so history follows, and the three digest-pinned files verified byte-identical after the move. The full tree: `Home.md`, `status.md`, `glossary.md`, 26 topic hubs, five indexes, the gate directories, specs, sources and `reasoning/`. The six fixed parts of a hub. How traces are filed. The eleven references the move breaks, including the `AGENTS.md` catch (its body is mirrored into six host copies with byte-equality enforced). A survey finding that Gate 1 defined four acceptance cases Gate 2's traceability table did not cover. The build order.
- **Verbatim rulings / rejections / traps:** The governing split: "The split matters: the trace is the record and is immutable, the hub is the synthesis and is rewritten freely. That's what stops a wiki rotting into contradictions with its own history." On hubs: "Every factual claim carries its citation inline, so any line can be checked against the source in one click. Hubs never restate frozen text; they point at it." Survey finding flagged not fixed: "Gate 1 currently defines four acceptance cases that Gate 2's traceability table doesn't cover: `AT-CLAIM-2`, `AT-CLAIM-3`, `AT-HOST-3`, `AT-HOST-4`… I'm flagging it, not fixing it — that's Gate 2 work and it isn't mine to touch. But it's a good sign the wiki is worth building." And: "the '52 cases' figure in the handoff is from 2026-07-28 and is now stale." Dogfooding note: "this design document is itself a reasoning trace. I'd rather file it as `wiki/reasoning/2026-08-19-wiki-design.md` — the first entry, dogfooding the convention." Owner approval, verbatim: "Intent owner, verbatim: \"Yup looks good\""

### 2026-08-20-communication-rule.md
- **Summary:** The communication rule escalated to a dedicated rule file (option B of three) — agents kept quoting wiki paths and section numbers in chat.
- **Decisions:** none
- **Status:** historical
- **What it recorded:** The owner's observation that quoting paths, section numbers and decision IDs is deterministic and traceable but forces the user to context-switch off the decision they are being asked to make. The three enforcement options with their costs. What shipped: `rig/tier-1/rules/communication.md`, the `routing.md` opening line applying both rules, the `CLAUDE.md` pointer, and the bootstrap/manifest install (with no new test needed because the bootstrap test already asserts every cited `.rig/…` path exists). What was deliberately not done.
- **Verbatim rulings / rejections / traps:** The user's role, as framed: "The user's role in chat is closer to a product manager: they need to see the problem, the options, the business cost of each, and a recommendation. Details on demand. Not a walkthrough of the paper trail." Why A alone was rejected: "A alone is the same soft policy that already drifted; C is a hammer to keep in reserve. B gives the wording a single home and reuses the router's existing entrypoint pressure." Deliberately not done: "Not adding a per-skill reference line… If drift continues after this ships, per-skill references are the next escalation." / "Not consolidating routing.md's 'Decision Questions' section into the rule yet… the diff for this change stays smaller if it lives one more cycle." / "Not adding a script/hook enforcement. Option C stays on the shelf."

### 2026-08-24-long-task-checkpointing.md
- **Summary:** Owner rejects a 15-30 minute checkpoint interval as too loose and requires every three minutes of active work, including progress made between steps.
- **Decisions:** none
- **Status:** historical
- **What it recorded:** The problem raised by the owner (an agent that writes only at a finished step loses everything since the last write if the session is cut off, including the tokens already spent). The proposal and the owner's rejection of the interval. The decision and where it landed identically — `CLAUDE.md`'s "Working from the wiki" section and the compact "Working Rules" list shared byte-for-byte across `AGENTS.md` and its six host copies, verified by `scripts/check-rule-copies.js`. What was deliberately not done.
- **Verbatim rulings / rejections / traps:** The rejection and the requirement: "The intent owner rejected the interval as too loose and asked for **every three minutes of active work**, explicitly including progress made *between* steps, not only at step or task completion — because that in-between work is exactly what gets lost and re-paid for if nothing is written until a boundary is reached." The resume bar: "A session picking up cold should be able to resume from what is written, not from re-deriving it or reading a lost conversation." Deliberately not done: "No wall-clock enforcement hook. This is a discipline the agent applies itself… If checkpoints keep being skipped in practice, that is the next escalation, matching the same enforcement ladder the communication rule already went through (sharpen the words → dedicated rule → output hook)." And: "No new file or mechanism for the in-flight checkpoint. It reuses `wiki/status.md`."

### 2026-08-25-token-burn-investigation.md
- **Summary:** Token-burn investigation across three real transcripts — the burn is tool-call volume plus nested model spawns, not context-window pressure.
- **Decisions:** none
- **Status:** historical
- **What it recorded:** What the three traces actually show, with per-session tool counts: the release-ceremony session (2 user turns but 86 Bash + 26 Edit in effectively one assistant turn), the RIG-104 refactor (71 Bash + 30 Read + 27 Edit + 4 Write, hit the session limit), and a fresh session that pasted the prior log and hit the weekly limit. The three ranked multipliers. The contributing per-turn tax. Four fix directions.
- **Verbatim rulings / rejections / traps:** The diagnostic correction: "So the tasks are substantial, not trivial. But the burn is still disproportionate, and it is **tool-call volume + nested model spawns**, not context-window pressure. No trace hit a context wall; they hit the account rate/weekly limit. Context engineering is the wrong lever." Multiplier 1: "One 'release' task silently forks 3+ complete model reviews of the whole diff." Multiplier 2: "CLAUDE.md documents `npm run test:rig` as the fast subset; the agents ignored it and ran the full gate every cycle." Multiplier 3: "Pasting the log does not restore model state; it re-injects raw text the new model must re-parse and re-verify." The tax: "These are correct for long multi-step work but are a flat tax on small tasks, and they compound with (3) on every resume." Fix directions: "a `fail` verdict is real signal — stop and surface it, do not auto-re-review; cap re-reviews at 1; use a cheap reviewer model for interim passes and reserve the expensive model for the final receipt; it is a release-only gate, never a mid-development loop." / "Resume from `wiki/status.md` (the designed hand-off), not from pasting the log; trust it instead of re-verifying everything."

### 2026-08-27-wiki-code-sync-at-lf-24.md
- **Summary:** Wiki brought up to date with the code after AT-LF-20..24 landed across four merged PRs — every claim verified directly rather than trusted from prior prose.
- **Decisions:** none
- **Status:** (no status field)
- **What it recorded:** Each verification run directly rather than taken from prior wiki prose: the focused `AT-LF-24` test passing; the full gate green at root 490/491; `check-advanced-spec.js` printing "Gate 1 protected" with `verifyCoverage` asserting 73 accepted cases despite the script's own log line hardcoding "68 acceptance cases"; the acceptance file already containing all five cases; the §9.4 trace table already correct while its prose narrative and header metadata were not; Gate 1 hash pins not matching the real on-disk digests; false claims in the decisions index about D28; a wrong decision-ID citation (D25 instead of D28); `acceptance-cases.md` §H never extended past `AT-LF-19` at all; three ticket files describing closed work as pending; and five files still quoting "68" as the live count. Then the explicit list of what was deliberately left untouched and why.
- **Verbatim rulings / rejections / traps:** Found trap: a "stale literal in `scripts/check-advanced-spec.js:166`, not fixed here — it's a code cosmetic bug, not a wiki fact, and out of scope for a wiki-only pass; flagged to the user." Deliberately untouched, with reasons: "`wiki/gate1/business-spec.md` and `wiki/gate1/acceptance.md` (frozen, signed oracle bytes — an implementing agent must not edit either, and their own internal '68-case set' prose refers to a fixed historical revision note, not the live count); every closed ticket's own '68-case oracle' evidence line… — accurate as of when each was written, and immutable historical record like a reasoning trace; `wiki/index/timeline.md` and reasoning traces (dated history, never rewritten)."

### 2026-08-30-development-process-handoff.md
- **Summary:** Implementation handoff for the 2026-08-30 office-hours development-process changes — four work packages, with the discovery that most of the mechanism already exists.
- **Decisions:** none
- **Status:** historical
- **What it recorded:** The three root problems diagnosed. Four hard constraints applying to every package. WP1 (append-only traces plus a generated summary), blocked on a build-vs-adopt research question, with frontmatter extensions, a deterministic generator, the `status.md` shrink, and a sync-check. WP2 (an unfreeze-request gate and a human-fillable evidence template), with a detailed list of what already exists and must not be rebuilt. WP3 (the delete-first solution ladder and a definition-of-done line). WP4 as a deliberate no-op guard. The suggested sequence and the cross-package definition of done.
- **Verbatim rulings / rejections / traps:** Key discovery: "**much of the mechanism already exists.** The signed test-freeze is fully built. The implementation ladder is fully built. So most of this work is doctrine, wiring, and one generator script — not new subsystems. Do not rebuild what is listed as 'already exists.'" Constraint 1: "**Tier 1 stays markdown-only in installed repos.** Any generator script runs at *authoring time in this source repo only*; its output must be plain markdown. Never install a runtime, DB, or service into a target repo." Constraint 4: "A drifted wiki is a defect." WP2's first-class human path: "The template must be fillable by a human as fast as by an agent — this is the out-of-tokens / outage path, and it is first-class, not a fallback." And: "The evidence is necessary; the human signature is authoritative." On `unlock`: "`unlock` is intentionally unsupported (an armed gate cannot be silently disarmed)." WP3's ladder: "Delete → Reuse unchanged → Modify existing code locally → Generalise existing behaviour → Add new code… Delete becomes rung 0." WP3's generalisation trap: "generalisation must justify its own existence — prefer direct reuse or a small local modification before extracting a new abstraction. Generalise only when two+ concrete callers actually exist and the shared semantics are real, not anticipated. This stops 'duplicate code' from being replaced by 'speculative frameworks.'" WP3's DoD line, verbatim: "> The change uses the least new mechanism necessary, reuses existing semantic authorities where possible, and removes superseded paths rather than leaving parallel implementations behind." WP3's explicit rejection: "**Explicitly NOT in scope:** a delete-ratio CI gate. The user rejected this. A delete-ratio number, if ever added, is a *thermometer* (reporting-only, detects drift) — never an enforcement gate. Do not build it as a blocker." WP4: "The user approved keeping the timeline and the release ceremony. **No work.** Do not remove or 'simplify' these while doing WP1… Listed only so a later cleanup pass doesn't treat them as churn."

### 2026-08-30-generated-wiki-summary-design.md
- **Summary:** The current-state page and reasoning-trace index are generated from immutable trace frontmatter; update a trace and run the generator instead of hand-editing either summary.
- **Decisions:** none
- **Status:** historical
- **What it recorded:** That external research found useful adjacent patterns but no adoptable tool — ADR practice supplies immutable records with explicit supersession, Dataview needs an Obsidian runtime, and MkDocs generates a site rather than checked-in Markdown. The chosen seam: a small Node script parsing only the frontmatter needed, deterministically writing the compact current-state page and a complete trace index, with a matching check that fails when either differs. How supersession reads.
- **Verbatim rulings / rejections / traps:** Rejections: "Adding either would violate the source-repository-only, markdown-only constraint." Supersession rule: "A trace marked `superseded` remains indexed but is excluded from current state; its `supersedes` field tells readers what it replaced." Division of labour: "Existing narrative indexes stay as historical synthesis; the generated trace index is the always-current entry point for new work."

### 2026-08-30-routing-sop.md
- **Summary:** The router now has a tested ten-step human-in-the-loop delivery SOP with a mandatory human key-signing exception.
- **Decisions:** none
- **Status:** historical
- **What it recorded:** The old six-phase pipeline replaced by the ten-step delivery SOP; the key-signing command kept as an explicit human action while other steps can be handed off or continued per the between-step protocol; the lightweight single-step path kept outside that protocol. A focused regression test covering step order, known skill and command references, handoff choices, the override contract, the lightweight-path guard, and discovery through the repository's npm test glob.
- **Verbatim rulings / rejections / traps:** "The signed oracle and its manifest were left unchanged."
