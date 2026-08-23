# Rig Router

Read this file before acting. Apply `.rig/rules/rig.md` to every coding task
and `.rig/rules/communication.md` to every message you send the user, then
choose the smallest set of skills whose trigger matches the work. In this
source checkout, use `rig/tier-1/rules/rig.md` and
`rig/tier-1/rules/communication.md` instead. Read each chosen skill completely
before proceeding.

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

For a new feature or behavioral change, use the phases in order. There is **one
freeze** — the gate — not two:

1. `rig-grilling` establishes the oracle: business intent, acceptance criteria,
   and the testing infrastructure that deterministically checks them. It derives
   as much as possible from the existing record before spending the developer's
   time, and declares anything it inferred so the sign-off is never blind.
2. `rig-product-design` produces the technical specification the code will adapt
   to.
3. **The gate — one freeze.** It verifies all four artifacts are present
   (business intent, technical specification, acceptance criteria, testing
   infrastructure) and the intent owner signs the oracle — intent, acceptance,
   and tests — with one key. The technical specification is checked for
   presence, never locked; the code adapts to it.
4. `rig-implementation` writes the smallest correct diff that fits inside the
   frozen shell. The implementer MUST NOT edit the frozen oracle.
5. `rig-execution` coordinates independent work and verifies evidence before any
   completion claim.
6. `rig-code-review` reviews from fresh context and reports only.

The gate protects exactly one property: **an agent cannot move its own
goalpost.** That is what Rig guards — the human from the agent, not the human
from the human; the developer owns the code. The property is enforced by the
human signature taken before any code exists plus the immutability of the signed
oracle after. A locked test that turns out wrong is corrected only by the key
holder, as a quick re-sign; an agent may propose the change but can never make
it. The technical approach, by contrast, may change freely during implementation
as long as the frozen tests stay green. Prose cannot physically prevent an edit:
this Tier 1 markdown-only guard is best-effort on both supported hosts, backed by
the signature over the artifact digest.

## Decision Questions

When asking the user to choose, give concrete options plus a recommendation.
Keep one decision per question unless the user asks for a broader menu. Do not
hide a meaningful fork behind a yes/no question when the real choice has more
than two viable paths.

## Skill Index

| Skill | Read when |
|---|---|
| `rig-grilling` | Requirements are new, ambiguous, risky, or need acceptance tests. |
| `rig-product-design` | The oracle is being established and a technical specification, tradeoff decision, or implementation approach is needed. The spec is checked for presence at the gate, not frozen. |
| `rig-implementation` | Any code will be written, changed, refactored, or removed. Always active for implementation. |
| `rig-execution` | A plan has multiple independent tasks, parallel work is requested, or completion needs verification. |
| `rig-tdd` | Implementing behavior or fixing a defect through a red-green-refactor loop. |
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
