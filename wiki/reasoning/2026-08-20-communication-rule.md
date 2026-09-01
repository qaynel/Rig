---
date: 2026-08-20
source: intent owner
topics:
decisions:
status: historical
---

Observation from the intent owner: agents kept quoting wiki paths and
subsection numbers in chat — `wiki/reasoning/…`, `Gate 1 §6.6`, decision IDs.
That's deterministic and traceable, which is good, but it forces the user to
context-switch off the decision they're being asked to make and go read the
citation. The user's role in chat is closer to a product manager: they need to
see the problem, the options, the business cost of each, and a recommendation.
Details on demand. Not a walkthrough of the paper trail.

The existing policy already said most of this. It lived in two places:
`CLAUDE.md`'s "Talking to the user" paragraph, and `rig/tier-1/routing.md`'s
"Communication Policy" section. The wording was close, but soft — no negative
examples, no explicit rule against wiki citations in chat, and nothing agents
had to invoke the way they invoke the implementation rule.

## The fork

Three ways to enforce it.

- **A. Sharpen the existing text.** Add Do/Don't examples to the two current
  paragraphs. Lightest change, but a lazy agent can still drift; the fix is
  in-chat correction only.
- **B. Dedicated rule file.** Same pattern as `rig/tier-1/rules/rig.md`: a
  standalone file, installed by bootstrap, referenced from `routing.md` as
  always-active. Every agent hits the router; the router names the rule; the
  rule owns the wording. Concrete negative examples land there without
  duplicating them across skills.
- **C. Output hook.** Regex the outgoing chat for wiki-path patterns and
  warn/block. Real enforcement; noisy on legitimate "read X" moments; fights
  the model instead of teaching it.

Intent owner picked B. A alone is the same soft policy that already drifted;
C is a hammer to keep in reserve. B gives the wording a single home and reuses
the router's existing entrypoint pressure.

## What shipped

- `rig/tier-1/rules/communication.md` — the rule. PM framing, "least viable
  information with the overall picture intact," concrete Do/Don't examples,
  explicit ban on wiki paths / section numbers / decision IDs in the
  first-pass reply, follow-ups on request.
- `rig/tier-1/routing.md` — opening line now applies both `rig.md` and
  `communication.md`; the Communication Policy section is a short pointer to
  the rule instead of a restatement.
- `CLAUDE.md` — "Talking to the user" points at the rule and repeats the
  headline in one paragraph.
- `rig/bootstrap.sh` + `rig/manifest.json` — install the rule to
  `.rig/rules/communication.md`. The bootstrap test already asserts that every
  `` `.rig/…` `` path cited in installed files exists, so a missing copy op
  fails the suite; no new test was written.

## What was deliberately not done

- Not adding a per-skill reference line. The rig.md rule is not referenced from
  each SKILL.md either; the routing.md opening carries it. Same shape for
  communication. If drift continues after this ships, per-skill references are
  the next escalation.
- Not consolidating routing.md's "Decision Questions" section into the rule
  yet. It overlaps with the rule and is a drift risk, but the diff for this
  change stays smaller if it lives one more cycle. Fold it in if a review
  flags the duplication.
- Not adding a script/hook enforcement. Option C stays on the shelf; revisit
  only if agents keep citing wiki paths in chat after this rule lands.
