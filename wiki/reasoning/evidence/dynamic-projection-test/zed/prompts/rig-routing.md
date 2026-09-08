# Rig Router

Before acting, read `.rig/routing.md` and route this task through its skill table.

## Task Weight

A **single-step task** — a one-line fix, a factual question, or one small edit
confined to a single file — takes the lightweight path: skim the skill table,
read only the relevant section, and skip the wiki-read-before-grepping step.
If the task turns out to need coordination across files, span multiple turns,
or move what's true in the wiki, switch to the full cadence.

Everything else uses the full cadence: read this file, read the wiki or
whatever standing record the repo keeps, read each chosen skill completely,
and keep a running reasoning trace.

## Pipeline

Grilling → Business Specifications → Acceptance Criteria → Tests → Technical Specifications → LOCK → Test-Driven Development → Verification

1. Grill the intent — `rig-grilling`
2. Design the approach — `rig-product-design`
3. Sign the key — `node scripts/approve-gate1.js`
4. Drive code test-first — `rig-tdd`
5. Implement to the smallest correct diff — `rig-implementation`
6. Coordinate independent work + verify evidence — `rig-execution` (only when parallel work)
7. Independent review — `rig-code-review`
8. Run the full gate — `npm test` green before push
9. Name the branch — `<ticket-id>-<slug>`
10. Open the PR — `gh pr create --base prod`

## Skill Index

| Skill | Read when |
|---|---|
| `rig-grilling` | Requirements are new, ambiguous, risky, need acceptance tests. |
| `rig-product-design` | A technical specification, tradeoff decision, or implementation approach is needed. |
| `rig-tdd` | Implementing behavior or fixing a defect through a red-green-refactor loop. |
| `rig-implementation` | Any code will be written, changed, refactored, or removed. |
| `rig-execution` | Independent work is parallelized and needs coordination and verification. |
| `rig-debugging` | Investigating a failure, flaky behavior, performance regression, or unknown root cause. |
| `rig-code-review` | Reviewing a diff, PR, branch, or proposed change. Report only. |
| `rig-onboarding` | Rig is installed but not yet adapted to this repository. |

## Between Steps

On the full-cadence path, pause between every step and ask the user to choose:

(A) I'll do it myself — agent stops; user executes the step
(B) Give me the handoff context — agent produces a paste-ready brief and stops
(C) Proceed with this session — agent continues

Override contract: "go ahead" waives all remaining A/B/C prompts except step 3
(sign the key), which always requires human action.

## Communication Policy

Every message to the user follows `.rig/rules/communication.md`: PM framing,
least viable information with the overall picture intact, options with real
costs, one recommendation, one decision per question.
