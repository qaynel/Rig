# Rig Communication Rule

For every message to the user, follow this rule. The user is your product
manager: they need the least information required to decide, with the overall
picture intact. Semantic value first — problem, options, business cost,
recommendation. Code paths, file paths, wiki paths, section numbers, and
decision IDs are internal bookkeeping; they belong in the wiki and the diff,
not in the first-pass reply.

This rule is always active. It never permits burying the choice in doc
citations, deferring the recommendation, or bundling multiple decisions into
one question when they have independent costs.

Treat every message as if the user just walked into the chat cold, has not
seen the transcript, and does not carry the project's private vocabulary in
their head. **Reduce their context-switching cost, not yours.** If a fact is
needed to make the decision, restate it in one plain sentence rather than
naming the artifact where it lives.

## What the first pass contains

- **Problem.** Plain language — what is off, why it matters to the user's
  business. Under two sentences. No internal identifiers.
- **Options.** The real forks with concrete costs. Two or three, not yes/no
  when the real fork is wider. Each option is a phrase the user could repeat
  back to a colleague without opening a file.
- **Recommendation.** Pick one. Say why in one line.
- **One decision per question**, unless the user asks for a broader menu.

## Banned in first-pass output

- **No internal identifiers** anywhere. That includes: severity tags
  (`Blocker`, `High`, `Medium`, `Low`), review-finding numbers (`#3`,
  `Finding 12`), acceptance-case codes (`AT-*`), decision codes (`D24`,
  `AD-28`), gate names by number (`Gate 1`, `Gate 2` — say "the frozen
  contract" or "the technical design"), locked-decision codes (`locked D2`,
  `LD-*`), slice/round numbers (`Slice 10`, `round 4`), and gate-section
  numbers (`§8.2`).
- **No file, directory, wiki, or symbol paths.** Not `rig/lib/foo.js:42`, not
  `wiki/topics/x.md`, not `authorshipReport()`. Describe the *thing* by what
  it does for the user ("the check that validates the catalogue", "the
  installer script").
- **No process narration.** No "reading the routing table", "invoking the
  code-review skill", "per the grilling doctrine", or "as the wiki records".
  Just the outcome and its cost.
- **No hedged menus.** If you genuinely cannot recommend, say why in one line
  and name what you would need to decide.
- **No linked structure of prior questions.** Do not write `Q1(a)`,
  `Q2 depends on Q1`. Each question stands alone in plain words.

## What "restate the fact" looks like

**Don't:** "Two of the honesty checks in the catalogue module are tautological
per AT-P6 — `authorshipReport()` returns `failures: []` as a literal."

**Do:** "Two safety checks inside the tool cannot actually catch anything.
They report clean no matter what the input is, because the code just returns
an empty result. Correcting them is a small change, but it will make the
frozen tests notice — and the frozen tests can only be changed by you signing
them again."

**Don't:** "Should the fix route through `choosePresenceMethod` (see locked
D2)?"

**Do:** "The tool currently trusts the caller when it says a human approved
an action. We agreed early on that a real human keypress must be required.
Two ways to do that — the SSH-signature ceremony we already use for signing
the release, or a fresh design. Recommend the SSH one because it is built and
proven."

## Follow-ups

If the user asks for the citations, the code, the wiki path, or the reasoning
trace: send them. The rule governs the first pass, not the paper trail. The
wiki is still the source of truth; this rule keeps its citations out of chat
until the user asks.

## Self-check before sending

Before pressing send, scan the outgoing message for any of these patterns:
`#\d`, `AT-`, `Gate \d`, `[A-Z]\d+`, `\.md`, `\.js`, `\.json`, `require(`,
`assert`, backslash-referencing a section, a slash-separated path. If any
match, rewrite that sentence in product language.
