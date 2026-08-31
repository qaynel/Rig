---
date: 2026-08-31
source: intent owner
topics: onboarding-flow, what-rig-is
decisions:
status: current
supersedes:
tags: interdependency
summary: Path B follow-up locks — grafts into repo-owned files are permitted inside explicit begin/end Rig-managed sections; the flat vendored skill shelf is reorganised into family → tool/capability → skill by capability, not by vendor origin; the catalogue's existing family → group → service → grade is untouched, and unification is deferred until product evidence justifies it. Grilling agenda in [2026-08-31-path-b-adapt-scope](./2026-08-31-path-b-adapt-scope.md) and product direction in [2026-08-31-path-b-product-direction](./2026-08-31-path-b-product-direction.md) are now fully resolved.
---

Filed 2026-08-31 from the intent owner, closing the last two Path B design
questions (graft mechanics into repo-owned files; skill-shelf reorganisation)
left open after [2026-08-31-path-b-product-direction](./2026-08-31-path-b-product-direction.md).
This session also confirmed the operator-facing shape decided in the same
exchange: one install command (`install rig [--host <host>]`); `rig-onboarding`
delivered as a Rig skill and/or a rig-mcp tool the host agent invokes
explicitly; no auto-trigger. The follow-up document body is the owner's
verbatim.

# Final Path B Follow-Up Decisions

The remaining two design questions are now locked.

## 1. Grafting into existing repo-owned context files

Rig **may edit existing repository-owned files** when onboarding requires it.

However, Rig must never take implicit ownership of the entire file.

Any Rig-added behaviour must live inside a **clearly delimited Rig-managed section** so that:

* the existing repository content remains authoritative outside that section,
* Rig can safely update only the content it owns,
* Rig can remove its graft cleanly without disturbing surrounding repo content,
* the ownership boundary is obvious in source control.

Use explicit begin/end markers, e.g.:

```markdown
<!-- rig:graft capability="tdd" begin -->

Rig-managed content here.

<!-- rig:graft end -->
```

The exact marker syntax can be standardised during implementation, but the invariant is:

> Every graft into a repo-owned file must have an explicit, machine-detectable ownership boundary.

The onboarding agent should first understand the existing capability, calculate the delta against Rig's capability, and graft only the missing or useful Rig guarantees into that managed section.

Do not replace working repo infrastructure merely because Rig has an equivalent skill.

---

## 2. Reorganise the flat vendored skill shelf

The current vendored Rig skill shelf should no longer remain a flat list.

Organise the skills into a coherent hierarchy such as:

```text
family
  → tool / capability
      → skill
```

The purpose is to make the Rig capability surface easier for the onboarding agent to understand and dynamically unpack.

A large portion of the current shelf appears to have been inherited from external systems such as GStack and similar skill collections. Their current prefixes or origins should not determine Rig's organisational model.

Instead, group them according to the capability they provide.

Possible families include areas such as:

* requirements / grilling,
* specifications,
* testing,
* implementation,
* code review,
* debugging,
* security,
* documentation,
* deployment.

The precise taxonomy should be derived from the actual skill inventory rather than forcing every skill into these example names.

The important rule is:

> Organise skills around the capability they provide to the onboarding agent, not around which external collection they originally came from.

Within a family, related tools/capabilities can group the individual skills beneath them.

---

## Existing service catalogue

Do **not** restructure the existing catalogue taxonomy as part of this work.

Keep the current:

```text
family → group → service → grade
```

structure for the existing governed-service catalogue.

For now, the new family/tool/skill organisation applies to the **vendored skill shelf only**.

The two taxonomies can remain parallel unless real onboarding behaviour later demonstrates that unifying them provides a meaningful benefit.

Do not rewrite frozen Gate-1/catalogue architecture merely for taxonomy consistency.

---

# Final Direction

Proceed on the basis that:

1. Rig can graft into repo-owned files.
2. Every graft must live inside an explicit Rig-managed, cleanly removable section.
3. The onboarding agent should calculate the delta between existing repo behaviour and Rig behaviour before grafting.
4. Preserve and extend existing infrastructure before adding parallel infrastructure.
5. Reorganise the flat vendored skill shelf into coherent capability families.
6. Within families, organise related tools/capabilities and their underlying skills.
7. Skill origin or vendor prefix should not define the taxonomy.
8. Leave the existing `family → group → service → grade` service catalogue unchanged.
9. Do not attempt taxonomy unification until actual product evidence justifies it.

These decisions should now be treated as locked for the current Path B buildout.

---

## Session-confirmed operator shape (grilling exchange, not part of the owner document body)

The same exchange also confirmed:

- **One installation command:** `install rig [--host <host>]`. `--host` (optional
  and repeatable) scopes the payload to a specific host (e.g. Claude Code, Cursor).
  No install tiers.
- **`rig-onboarding` delivered as a Rig skill and/or a rig-mcp tool** the host
  agent invokes explicitly after install. No auto-trigger; installation
  documentation must direct the user to initiate onboarding from their host
  agent as an explicit next step.
- **Critical-decision escalation is prose-judged by the agent**, scoped to
  product-level / AI-SDLC-changing decisions; the agent prompts the host to
  inform the user of any such change before proceeding.
- **Onboarding acceptance = user approves the summary + mechanical post-checks
  pass** (no duplicate writes; grafted capabilities resolve; `.rig/` state
  complete). Bytes/files budget is warning-only per Decision 5 of the product
  direction; hard failures are reserved for correctness regressions.
