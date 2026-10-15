# Reviewer handoff — "close everything" plan

**Historical review brief.** Review is complete, all six owner choices are
settled, and amendments are applied. The current delivery entrypoints are the
[specification sheet](specification-sheet.md) and [SOW](statement-of-work.md).
The original review instructions below preserve what was handed to the reviewer.

You are being handed a plan to review, and a short list of open points to
settle with the owner. This file is self-contained: read it top to bottom,
then follow its links only as far as your review needs.

**Repo:** Rig (the `rig-v0.1` checkout). **Branch:**
`vaibhav-kodiyan/universal-issues-closure`. **Target:** `qa-prod`, then
`prod`. **Plan written:** 2026-10-13. Nothing in it is implemented yet.

---

## 1. Your job

1. **Review the plan** for gaps, contradictions, wrong ordering, unverifiable
   acceptance, and anything that conflicts with the settled decisions in §3.
   Verify claims against the code. Don't trust the plan's own word.
2. **Discuss the open points (§5) with the owner**, one decision per question,
   and record each answer.
3. **Hand back** an amended plan and a short review record (§7).

You are **not** implementing anything. Do not edit code, tests, or anything
under `wiki/gate1/`.

## 2. What the owner wants (in one paragraph)

Close every open, buggy, or half-built item so they can start a redesign from a
clean slate, and ship a coherent, usable product to QA and then prod. Two
axes: **horizontal** (every item gets a proven disposition, and both trackers
match reality) and **depth** (end-product finish: a fix plus a proving test, a
real clean install end to end, matching docs, security and code review, and a
permanent coherence check). Close bar: "code is cheap". Fix everything.
"Replaced" needs a really good written reason, never "too hard". Work that was
never started is deferred to the redesign. One branch, one PR, one batched
signature at the end.

## 3. Settled — do not re-open

The owner has had to repeat these several times. Raising any of them again is
the most damaging thing a reviewer can do.

1. **Rig is one central corpus.** Skills, rules, all 115 catalogue services, and
   standards live once in the corpus. The **user's own coding agent unpacks
   it**, following clear onboarding instructions that ship inside the corpus.
   Known hosts get a deterministic projector, and unknown hosts get an
   agent-written projection. **Never scope, test, document, or ask about
   support per host, or count hosts.** (The 19-host registry in the code is
   legacy.)
2. Onboarding is agent-driven and adaptive. Rig code doesn't infer; the host
   agent grafts the smallest useful set onto what the repo already has.
3. The markdown-only rule is retired. Scripts, markdown, and MCP may ship.
4. The human-signed frozen tests are the gate. Agents never edit them. The
   owner re-signs once, in a batch.
5. Scope decisions from grilling:
   - corpus built on this branch
   - all 115 services finished to product quality and shipped from the corpus
   - catalogue contract frozen as built
   - lint-format replacement keeps old config through the undo record, with
     the drafted tool lists approved
   - heavy upkeep
   - AI development standards enforced here and shipped in the corpus
   - never-started items closed on GitHub with a `redesign` label and listed
     on a backlog page

Sources, if you need them: the "North star" block at the top of `CLAUDE.md`,
and the owner's verbatim answers in
`wiki/reasoning/2026-10-13-close-everything-owner-answers-round{1..5}.md`.

## 4. The plan

- **Master:** `wiki/specs/close-everything/00-master-plan.md`. It holds the item
  ledger, the order, the signing strategy, cross-cutting risks, the author's
  own self-review, and the open points.
- **Subplans** (same folder):

| # | File | Covers |
|---|---|---|
| 01 | `01-tracker-sync.md` | Make GitHub, the board, and ticket files match reality; redesign backlog |
| 02 | `02-bug-fixes.md` | Eight concrete bugs, each test-first |
| 03 | `03-central-corpus.md` | The corpus, projector, onboarding instructions, v5 migration (the spine) |
| 04 | `04-catalogue-services.md` | 115 finished services from the corpus |
| 05 | `05-lint-format-setup.md` | The lint/format replacement rule |
| 06 | `06-clean-install-e2e.md` | Real-download clean install, end to end |
| 07 | `07-ai-sdlc-standards.md` | Standards: enforced here, shipped to users |
| 08 | `08-coherence-and-upkeep.md` | Coherence sweep and check; weekly health; dependency drift; release rules |
| 09 | `09-docs-and-vision.md` | README, install guide, troubleshooting, one-page vision |
| 10 | `10-review-sign-ship.md` | Security review, code review, the one signature, PR, QA→prod |

- **Evidence behind the plan:** the reality audit
  (`wiki/reasoning/2026-10-13-close-everything-reality-audit.md`) and the
  corpus design with its two feasibility tests
  (`wiki/reasoning/2026-09-08-*`).

## 5. Open points to settle with the owner

Each comes with the plan's recommendation. Confirm or change it with the owner;
don't decide alone.

1. **Third-party skills Rig vendors** (17 skills, about 7 MB, under upstream
   licenses): keep a pinned copy inside the corpus, or fetch from upstream at
   unpack time? *Recommendation:* keep the pinned copy now (works offline,
   bytes are pinned) and leave fetching to the redesign.
2. **Where the corpus lives:** a new single root folder, or re-label today's
   source folders? *Recommendation:* a new single root, since the batched
   re-sign absorbs the churn either way.
3. **The word "tier" and the `--tier` install flag:** the owner floated
   dropping tiers. *Recommendation:* drop the word from user docs now, and keep
   the flag as a harmless alias for one release.
4. **Services whose checks need outside tools** (scanners, cloud CLIs):
   *Recommendation:* use the tool only if the repo already has it. Otherwise
   report a named gap with install guidance, never a silent pass.
5. **Duplicate services:** may two services that turn out to be the same
   practice merge, with a written reason, even though that drops the count
   below 115? *Recommendation:* yes.
6. **What must be true on QA before promoting to prod?** *Recommendation:* a
   green weekly health run plus one real install on a repo outside this
   project.

Add any new open point your review uncovers, framed the same way.

## 6. Where the plan is most likely wrong (start here)

The author's own weakest spots:

- **Frozen-test coupling (master §6).** 10 of the 16 signed files reference
  the current file layout. Check whether "keep the installed layout
  byte-identical" really keeps most of them green, and whether the
  "expected-red list" approach is acceptable under the gate rules in
  `rig/tier-1/skills/grilling/SKILL.md`.
- **Scale of 04.** Finishing 115 services is the biggest block of work.
  Pressure-test the definition of "finished" and the batching.
- **03's v5 migration.** Is the upgrade path from existing installs complete
  and reversible?
- **One PR.** Is "one commit per slice, review per subplan" enough to avoid a
  repeat of the 74-commit PR?
- **Ledger completeness.** Re-run the audit: list open GitHub issues
  (`gh issue list --state all`) and compare them with the master ledger.

## 7. How to talk to the owner

The owner is a product manager. For every message:

- Lead with the problem in plain language, in one or two sentences.
- Give two or three real options with their business cost, then **one
  recommendation**.
- **One decision per question.**
- No file paths, ticket IDs, test-case codes, or section numbers in the first
  pass. Describe the thing by what it does. Give references only if asked.
- Never ask about anything in §3.

## 8. What to hand back

1. **Edits to the plan files** (or a diff), keeping the master/subplan
   structure.
2. **A review record** filed as
   `wiki/reasoning/<date>-close-everything-plan-review.md`, with frontmatter
   matching the other traces in that folder (date, source, topics, status,
   tags, and a one-line summary). It contains:
   - each finding with its evidence and the change made
   - the owner's answers to §5, verbatim
   - anything still open
3. Then run `node scripts/build-wiki-index.js`, followed by
   `node --test tests/wiki-budget.test.js`. Both must be clean.
