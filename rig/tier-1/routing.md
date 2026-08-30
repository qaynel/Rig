# Rig Router

Read this file before acting. Apply `.rig/rules/rig.md` to every coding task
and `.rig/rules/communication.md` to every message you send the user, then
choose the smallest set of skills whose trigger matches the work. In this
source checkout, use `rig/tier-1/rules/rig.md` and
`rig/tier-1/rules/communication.md` instead. Read each chosen skill completely
before proceeding, except on the lightweight path below.

## Task weight

A **single-step task** — a one-line fix, a factual question, or one small edit
confined to a single file, with no cross-file coordination and no change to
what's true in the wiki (no new decision, spec, status, or rejected approach)
— takes the lightweight path: skim this table for the matching skill instead
of re-reading this whole file on every resume, skim only the skill's relevant
section instead of reading it end to end, and skip the wiki-read-before-
grepping step and the 3-minute `status.md` cadence. If the task turns out to
need coordination across files, span multiple turns, or move what's true in
the wiki, switch to the full cadence below for the rest of it.

Everything else uses the full cadence: read this file, read the wiki, read
each chosen skill completely, and file a dated reasoning trace then regenerate
`wiki/status.md` at least every three minutes of active work, per `CLAUDE.md`.
`(RIG-124)`

Native skill hosts discover the names below automatically. On instruction-only
hosts, `rig-<name>` maps to `.rig/skills/<name>/SKILL.md`;
`rig-implementation` maps to `.rig/skills/implementation/SKILL.md`. In this
source checkout, those sources live at `rig/tier-1/skills/<name>/SKILL.md` and
`skills/rig/SKILL.md`.

## Communication Policy

Every message to the user follows `.rig/rules/communication.md`: PM framing,
least viable information with the overall picture intact, options with real
costs, one recommendation, one decision per question. Wiki paths, section
numbers, and decision IDs stay out of the first-pass reply; they belong in the
wiki and the diff, and are reproduced on request.

## Pipeline

For a new feature or behavioral change, use these steps in order:

Spec-driven requests route through `rig-grilling` and then `rig-product-design`.

1. Grill the intent — `rig-grilling`
2. Design the approach — `rig-product-design`
3. Sign the key — `node scripts/approve-gate1.js` ([Gate 1 signing](../../wiki/topics/gate1-signing.md))
4. Drive code test-first — `rig-tdd`
5. Implement to the smallest correct diff — `rig-implementation`
6. Coordinate independent work + verify evidence — `rig-execution` (only when parallel work)
7. Independent review — `rig-code-review`
8. Run the full gate — `npm test` green before push
9. Name the branch — `<ticket-id>-<slug>` (e.g. `RIG-150-routing-sop`); rename if needed
10. Open the PR — `gh pr create --base prod`; CI green check must appear on the PR

## Between steps

On the full-cadence path, pause between every step and ask the user to choose:

(A) I'll do it myself — agent stops; user executes the step
(B) Give me the handoff context — agent produces a paste-ready brief and stops
(C) Proceed with this session — agent continues

Override contract: "go ahead" waives all remaining A/B/C prompts except step 3 (sign the key), which always requires human action. The user may also scope with
"until step N" or "from step N" and may interrupt at any time to hand off. This
between-step protocol does not apply to single-step lightweight tasks; the
`## Task weight` section defines those.

## Decision Questions

When asking the user to choose, give concrete options plus a recommendation.
Keep one decision per question unless the user asks for a broader menu. Do not
hide a meaningful fork behind a yes/no question when the real choice has more
than two viable paths.

## Skill Index

| Skill | Read when |
|---|---|
| `rig-grilling` | Requirements are new, ambiguous, risky, need acceptance tests, or ask for a specification-driven/executable-spec flow. |
| `rig-product-design` | The oracle is being established and a technical specification, tradeoff decision, or implementation approach is needed. The spec is checked for presence at the gate, not frozen. |
| `rig-tdd` | Implementing behavior or fixing a defect through a red-green-refactor loop. |
| `rig-implementation` | Any code will be written, changed, refactored, or removed. Always active for implementation. |
| `rig-execution` | Independent work is parallelized and its evidence needs coordination and verification. |
| `rig-debugging` | Investigating a failure, flaky behavior, performance regression, or unknown root cause. |
| `rig-code-review` | Reviewing a diff, PR, branch, or proposed change. Report only. |

Do not substitute a nearby skill for the named owner. Debugging discovers why;
TDD drives a known behavior change; review judges an existing diff.

## Fallback to the router

If a request does not match any Tier 1 skill above and the user has not named a
specific vendored skill, invoke the vendored `rig` router (the `/rig`
switchboard shipped from the swallowed suite) before answering ad-hoc. The
router either dispatches to the right vendored skill or hands the turn back for
a direct answer; either way the routing is recorded. Never answer a
skill-shaped request without at least consulting the router.
