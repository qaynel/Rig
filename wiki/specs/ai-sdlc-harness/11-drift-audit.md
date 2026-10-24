---
status: current
checked: 2026-10-23
owner: rig-product-design
---

# Scope-drift and context audit

Independent reconciliation of this session's work against the owner's original
instructions and the settled record, as required by §5 of the directive.
Verified repository facts are marked ✓; trace-sourced claims are marked ◦.

## A. Requirements overlooked, narrowed or misinterpreted

| # | Requirement as stated | What actually happened | Assessment |
|---|---|---|---|
| A-1 | §9: "Distinguish attempted, running, completed, failed and interrupted states" | Implemented `running / completed / failed / interrupted`. There is no stored `attempted` state — an attempt is `running` from the moment it is persisted, before the spawn. | **Narrowed, deliberately.** A separate `attempted` state would be a row that exists for microseconds and can never be observed, since the marker is written before the risky operation. The guarantee behind the requirement (no attempt is unaccounted for) is met. Flagged for the owner to reject if they want the literal five. |
| A-2 | §11: ten capabilities listed as "incremental" | None were implemented. §9 and §10 were completed instead. | **Correct per the directive**, which called §11 incremental and §9/§10 approved. All ten are now specified in [03-capabilities.md](03-capabilities.md). |
| A-3 | §9: "reviewer JSON, transcripts, findings or acceptance criteria… the agent must actually inspect and reconcile" | `--ingest` handles reviewer JSON and transcripts. It does **not** ingest externally supplied *acceptance criteria*. | **Gap, intentional.** Acceptance criteria can only enter through the owner's signature (S-04, S-06). An ingest path for criteria would be a second authority. Stated here so the omission is visible rather than silent. |
| A-4 | Owner, msg 3: "It automatically tells me before we proceed any further…" | Not implemented, and **absent from the owner's own §2 capability list** in this directive. | **Would have been lost.** Recovered as C12 and specified. This is the clearest case of the directive's own list being non-exhaustive. |
| A-5 | Owner, msg 1: FIDO key and fingerprint for the lock | Rig signs with `ssh-keygen -Y sign`. ✓ `sk-*` hardware key types appear in the signing instructions and two test files, but there is ✓ **no tested end-to-end hardware-key path**. | **Narrowed in implementation, never flagged.** Now [D-02](09-decision-register.md). |
| A-6 | Owner, msg 1: "Our actually addressable market is everyone who does not know anything about coding" | The architecture serves this user, but **no onboarding path produces the initial `preferences` from a non-coder's answers**. | Specified as part of C3's change set. Would otherwise have been assumed. |
| A-7 | Owner, msg 3: "Once it has built up a preference thing, we do a rig transfer" | Designed (C2) and not built. | Correctly deferred; it depends on C1. |
| A-8 | §2 of this directive: "Do not reduce the overall product vision to a memory ledger, review wrapper or minimal workflow" | The earlier `design.md` did exactly that — three parts, all memory. | **Corrected here.** This package covers 22 capabilities; the active view is one layer, not the product. |

## B. Potentially contradictory architectural decisions

| # | Tension | Resolution |
|---|---|---|
| B-1 | Owner's pipeline puts the lock before technical design and scope of work; the router lists technical design first | Workflow-order drift only. The actual signed message excludes the technical design; its presence and traceability are checked separately. Corrected [D-01](09-decision-register.md) needs no new owner decision. |
| B-2 | "Amalgamate everything from open source" vs "one authoritative implementation per capability" | Not actually contradictory: amalgamate *capabilities*, never *implementations*. Enforced by C18 (install-time overlap detection) and R-06. |
| B-3 | North star 3 retires markdown-only and wants a sync engine; the owner now forbids "another large documentation system" | Compatible: ship mechanisms (scripts, checks), not documents. Each new skill must own one deterministic check (R-06). |
| B-4 | Recursive self-improvement vs "never allow the system to change its own acceptance criteria or weaken security" | Resolved architecturally: the improver has no write path to `gate1/`, `trust/`, or its own rules, while safe unprotected checks may land automatically after replay. [05-recursive-improvement.md](05-recursive-improvement.md). |
| B-5 | The three-minute trace cadence (`CLAUDE.md`) vs the owner's dislike of trace sprawl ◦ (7 progress traces on 2026-10-21) | [D-07](09-decision-register.md): the cadence is a workaround for having no resume point; retain it and compact old traces automatically with fidelity checks. |
| B-6 | Owner waived the config-only objection; the first SOW did not use the waiver | [D-03](09-decision-register.md). The owner removed this constraint; host execution remains the default integration point. |
| B-7 | Ledger must be always-written, but evidence must bind exact bytes ✓ (NFR-6) | [D-05](09-decision-register.md): exclude the ledger from the implementation digest, as receipts already are ✓. |

## C. Did the wiki cleanup make authoritative context inaccessible?

**No — verified, with one exception to report.**

- ✓ `wiki/index/reasoning.md` retains **382 entries**, including the **224**
  marked historical. Nothing was deleted; only `wiki/status.md` (the always-read
  summary) shrank, from the full set to 58 current traces across 68 lines.
- ✓ `node scripts/wiki-maintenance.js lint` → clean.
- ✓ `node scripts/check-advanced-spec.js` → "Oracle verified: 16 files, 95
  acceptance cases"; all ticket-to-test citations resolve.
- ✓ Apart from seven inserted `<!-- needs-human-review: status -->` lines, every
  change under `wiki/reasoning/` is a frontmatter field; **no trace body bytes
  were altered or removed.**
- **Exception:** those seven lines mean the sweep was not strictly
  frontmatter-only, contrary to how it was reported earlier in this session.
  File list and recommendation in [10-current-state.md](10-current-state.md) §2.
  Left in place, unmodified, per the preserve-everything instruction.

Reclassifying a trace to `historical` does not remove it from the index, from
search (`scripts/wiki-query.js`), or from any hub that cites it. The risk the
directive was probing for — unresolved work becoming unreachable — did not
materialise.

## D. Verified facts versus assumptions and historical claims

| Claim | Status |
|---|---|
| "`AT-HD-7` is red (7 pass, 1 fail), pre-existing" | ✓ **FALSE on this branch.** 8 pass / 0 fail; the named case passes; the file is unmodified since `59afb8aa`. This was carried forward from earlier in the session and is now corrected. |
| "`scripts/review-receipt.js` is not in the Gate 1 frozen manifest" | ✓ verified against the manifest |
| "The full gate has never been run on this work" | ✓ was true; now run, exit 0 |
| "148 traces flipped, 198 → 58 current" | ✓ verified on disk |
| "Acceptance binds a unit seam (68/68 `require(module)[fn]`)" — an August claim | ◦ **stale.** Re-verified earlier this session as 70 real-entrypoint cases vs 24 direct. A pitfall learning was filed so it is not cited again. |
| "`CLAUDE.md` North star 2 cites a deleted trace" — a subagent report | ✓ **FALSE.** Both cited traces exist on this branch. Not propagated. |
| "All thirteen named repositories exist and are maintained" | ✓ verified via the GitHub API, after I wrongly doubted several of them |
| "Harness² can report a fabricated pass", "forwards the environment to agents", etc. | ◦ read from its source during the survey, not re-verified today; cited by file and line in the survey trace |
| "Three provider-outage attempts consumed capped authorisations" | ◦ from the trace record |
| "Seven near-duplicate progress traces on 2026-10-21" | ◦ from the trace record |

## E. Implementation performed without a sufficiently complete specification

| What | Specification it had | Assessment |
|---|---|---|
| RIG-124.2 finding-class history | None. Designed and built inside the research session. | **Yes — under-specified when built.** It is now specified retroactively as C9/C13, has 49 passing tests and a green gate, and the directive explicitly says not to discard it. Its one design decision worth re-examining is the finding key (`category|evidence`): it is only as stable as the reviewer's quoting, and a reviewer that paraphrases will key differently. Noted as a known limit, not a defect. |
| RIG-124.3 state machine | §9 of the owner's directive, which was detailed and approved. | Adequately specified. |
| `--ingest` | One sentence of §9. | **Thinly specified.** The read-only, never-authoritative shape is a defensible reading, but the owner may have meant something larger. Flagged. |
| The wiki sweep | An instruction to "compact and delete the older traces so that there's not a lot of bloat". | **Interpreted conservatively** as reclassify-not-delete, which is the safer reading of a destructive instruction, and the summaries were kept. The seven marker lines were not part of any instruction. |

## F. Owner-directive reconciliation (2026-10-24)

The earlier open-decision list is superseded by the [owner's product-first directive](../../reasoning/2026-10-23-ai-sdlc-product-first-owner-directive.md). The [decision register](09-decision-register.md) now records D-01 through D-07 as settled. The important corrections are: active memory has an 8 KB view plus richer retrievable history; requirements and acceptance lock together before editable design; safe learning and bounded unprotected checks may promote automatically; the three-minute trace cadence stays; and the config-only objection is waived. Hardware-backed signing must be proven through the existing single key path. None of these rulings alters the already signed Gate 1 files or claims the expansion is implemented.

The earlier reuse plan rejected semantic memory frameworks wholesale and labelled analogous native algorithms as reuse. The [source-level matrix](12-reuse-plan.md) now distinguishes pinned narrow ports, standards conformance, adapter patterns and excluded runtimes. The package still needs future implementation and port-specific proof.

## G. Process notes on this session, for the record

Two corrections I made to my own work, recorded because the harness being
designed exists to prevent their recurrence:

- I doubted that several of the thirteen named repositories existed, against my
  own knowledge cutoff, before checking. All thirteen existed. The lesson is in
  the directive's own §1: evaluate the repository, do not pre-reject it.
- I reported the wiki sweep as frontmatter-only. Seven files had a body line
  added. Found by mechanical diff while writing this audit, not by recollection
  — which is the argument for the audit being mechanical rather than narrative.
