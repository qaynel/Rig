---
date: 2026-08-21
source: intent owner
topics: authored-service-gate, specification-gate
decisions: D23
status: historical
---

Raised by the intent owner while planning the specification-gate implementation:
`AT-SHAPE-6`'s own filler-content check runs across all 115 catalogue leaves,
but only one leaf (`development.code-quality.lint-format`) is meant to ship
this release. Nothing in the frozen text scoped that check to the shipping
leaf, so — transcribed literally into the specification gate that runs first
in `npm test` — the other 114 leaves would keep the suite red permanently,
even though D21 already ruled those 114 don't block this release. `npm test`
is the gate this project treats as the thing that unblocks deployment, so a
permanently-red suite defeats its purpose regardless of what D21 says about
the release boundary elsewhere.

The intent owner first asked whether filling the 114 leaves' `TODO(Slice 10)`
placeholders with dummy content would clear the gate. Traced against the
frozen text: it does not. `AT-SHAPE-6` fails a leaf on `TODO`, `TBD`, known
generic filler ("concrete convention"), or repeated normalized fragments —
not just literal `TODO`. Seven leaves already carry generic filler instead of
`TODO` and are already failing for exactly that reason, independent of the
108 leaves still saying `TODO` outright. Mechanical presence and the
fresh-context semantic review are both explicitly designed to catch exactly
this shortcut — the project's own history is that 432 placeholder files once
passed a shallower check, which is why the two-layer gate (mechanical +
semantic) exists at all. Bulk-filling 114 leaves at once also collides with
the standing rule that catalogue authoring is one leaf at a time in a single
context, never templated or parallel. So "fill in TODOs" was rejected as a
path to green, whether the fill is literal `TODO`, generic boilerplate, or
hand-varied plausible-sounding text — all three fail the same case, just at
different layers.

The real gap is that `AT-SHAPE-6` was never narrowed to match D21's release
boundary. The fix is to scope the check, not to manufacture content.

Asked the intent owner one question: for the 114 non-shipping leaves, should
the gate skip their content entirely this pass (matching what D21/AD-24
already promise — they only owe their own future support, not this release),
or should they carry an explicit "deferred" marker so the catalogue itself
discloses the deferral? Recommended skip-entirely, since the deferral is
already disclosed elsewhere (`status.md`).

The intent owner's ruling, verbatim in substance: skip entirely, but **only
for this pass** — not a standing rule. They intend to make a further, separate
change later so that only what's actually being shipped is evaluated, on an
ongoing basis; that general mechanism is explicitly out of scope here. For now,
this is a one-time exception, and it must be recorded unambiguously as an
exception rather than folded into `AT-SHAPE-6` as if it were the rule.

That ruling is D23: `AT-SHAPE-6` is evaluated against
`development.code-quality.lint-format` alone for this release; the other 114
leaves are excluded from this one pass, unchanged, with no new marker required
of them; the acceptance ID set stays at 68; and absent a further amendment,
`AT-SHAPE-6` reverts to covering all 115 leaves for the next release. Landed in
`gate1/business-spec.md` and `gate1/acceptance.md` as a dated revision note
plus an inline exception clause on `AT-SHAPE-6` itself, in the same two-file
pattern D19–D22 used. Not yet retraced into Gate 2 (`AD-24`, §12.3/§17.2, the
`AT-SHAPE-6` row in §13) — that is `rig-product-design`'s job next, and Gate 2's
existing release-boundary language already says the right thing about *release*
blocking; what it's missing is the same narrowing applied to the specification
gate's own `AT-SHAPE-6` check.
