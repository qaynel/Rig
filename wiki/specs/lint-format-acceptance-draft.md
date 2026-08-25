---
status: historical
checked: 2026-08-21
owner: rig-grilling
phase: acceptance-authoring
---

# Lint-format acceptance — Stage A draft (approved and landed in Gate 1)

> **HISTORICAL SNAPSHOT.** This draft did its job: its content is now the
> live text in [`gate1/acceptance.md`](../gate1/acceptance.md) §7, under the
> owner's signature. Read that file for the current, authoritative wording;
> read this one only for how the cases were originally reasoned out.

Independently authored observable acceptance for the first production leaf,
`development.code-quality.lint-format`. This was the reversible Stage A
artifact of the [grilling handoff](lint-format-grilling-handoff.md). **The
intent owner approved this set on 2026-08-21**, and the Stage B amendment has
landed it into
[`../gate1/acceptance.md`](../gate1/acceptance.md) §7H and
[`../index/acceptance-cases.md`](../index/acceptance-cases.md) as `D21`,
expanding the frozen set from 49 to 68 and staling the Gate 1 signature. This
draft is kept as the authoring record; the frozen files above are now
authoritative.

Every case below is an **independently authored** observable case, not a
transcription of the implementation-authored npm tests (`GA-13` /
`AT-GATE-3` — Gate 1 owns the verdict, Gate 2 owns the executable form). Each
**must fail against the current prototype** — which authored lint-format only as
a probe and implements none of drift, scope, CI, redaction, the abnormal-ending
taxonomy, or partial coverage — and pass only when this intent is met. Intent
synthesis and `GA-` traces: [`lint-format-intent.md`](lint-format-intent.md).

Proposed count: **19** cases, `AT-LF-1` … `AT-LF-19`.

---

## Fixtures

- **`SPINE`** — a git repo with one JS component: eslint + prettier configured,
  a **changed** file carrying one lint violation and one format violation, one
  already-clean file, and an ignore rule excluding a generated/vendored path.
- **`POLY`** — the `SPINE` JS component plus one **nested non-JS component** in
  an ecosystem for which Rig cannot build even the Policy level. Used only where
  whole-repository discovery or partial-coverage exclusion must be observable.

Fixture bytes are Gate 2's to build; the shape each case needs is named inline.

---

## The vertical flow (observable examples)

The flow the spine walks: **inspect → recommend → user scope/tool choice → plan
→ approve → apply → Policy → Context → Evidence → report → drift → reinstall →
remove**, with the edge cases attached at the step each belongs to.

---

### AT-LF-1 — whole-repository, open-ecosystem discovery  ·  `GA-19`, `GA-20`

- *Given* `POLY`, *when* Rig inspects, *then* it discovers **both** the JS
  component and the nested non-JS component, derives each component's lint/format
  ecosystem from the repository itself (not from a fixed roster), and presents
  every discovered component in the reviewable plan.
- **Pass/fail:** the plan enumerates both components with a repository-derived
  ecosystem for each; a run that finds only the root component, or that matches
  against a hard-coded language list, fails.
- **Fixture:** `POLY`.

### AT-LF-2 — hybrid-plus: preserve existing tools, user decides  ·  `GA-16`, `GA-17`

- *Given* `SPINE` with eslint + prettier already configured, *when* Rig
  recommends lint-format, *then* the existing toolchain is preserved by default;
  Rig may offer supported setup or a better alternative but changes nothing until
  the user opts in, and never silently replaces the existing config.
- **Pass/fail:** the existing eslint/prettier config is byte-identical after
  recommendation unless the user explicitly adopts a change; a silent
  replacement or forced migration fails.
- **Fixture:** `SPINE`.

### AT-LF-3 — semantic command discovery; ambiguity returns to the user  ·  `GA-21`

- *Given* a component whose lint/format commands live in its manifests / tool
  config / declared tasks under non-standard names, *when* Rig binds commands,
  *then* it discovers them semantically and preserves the declared workflow; an
  ambiguous match is surfaced for the user to choose, not guessed.
- **Pass/fail:** a non-standard-named but declared task is bound; an ambiguous
  case halts for user choice. Reliance on fixed script names (e.g. only
  `npm run lint`) or a silent guess fails.
- **Fixture:** `SPINE` variant with renamed/ambiguous tasks.

### AT-LF-4 — user scope + component choice win over the recommendation  ·  `GA-20`, `GA-28`, `AT-P5`

- *Given* the plan from `AT-LF-1`, *when* the user deselects a component and/or
  requests a scope other than the diff default, *then* the applied plan matches
  the user's choice, not the recommendation.
- **Pass/fail:** deselected components are absent from the plan and the requested
  scope is honored; a plan that reasserts the recommendation over the user's
  edit fails.
- **Fixture:** `POLY`.

### AT-LF-5 — selection authorizes nothing; only the approved plan runs  ·  `GA-25`, `GA-26`

- *Given* lint-format selected but **not** yet plan-approved, *then* no
  repository code executes. *When* the user approves the concrete plan, *then*
  exactly its listed read-only commands, working directories, and components run
  — and the plan discloses that repository tasks are untrusted code run under
  Rig's controls, without presenting `shell: false` as a safety guarantee.
- **Pass/fail:** zero command execution before approval; only listed commands
  after; the untrusted-code boundary is disclosed. Any pre-approval execution,
  any unlisted command, or a `shell: false` safety claim fails.
- **Fixture:** `SPINE`.

### AT-LF-6 — apply grafts and records; partial coverage is explicit  ·  `GA-24`, `GA-34`, `AT-SHAPE-1`, `AT-INSTALL-1`

- *Given* the approved plan on `POLY`, *when* Rig applies, *then* every write is
  recorded in the install manifest at the time it is made, the uncoverable
  non-JS component is excluded **only** with the user's approval and reported as
  a visible unprotected gap, and the covered JS component installs.
- **Pass/fail:** manifest records each write; excluded component is named
  unprotected; an unrecorded write, or an exclusion applied without approval,
  fails.
- **Fixture:** `POLY`.

### AT-LF-7 — Policy level governs the change (Level 1)  ·  `GA-22`

- *Given* the covered component at grade **Policy**, *when* the check runs,
  *then* it governs the change at the lowest level capable of a definitive
  answer, and reports a Policy-level result.
- **Pass/fail:** a real Policy-level verdict on the changed files; a placeholder
  or a check that silently runs a higher level fails.
- **Fixture:** `SPINE`.

### AT-LF-8 — Context level is a cumulative superset (Level 2)  ·  `GA-22`

- *Given* the same component at grade **Context**, *then* the checks are a strict
  superset of Policy's — Policy's governance plus understanding the change.
- **Pass/fail:** every Policy check still runs, plus Context's; a Context grade
  that drops or merely replaces a Policy check fails.
- **Fixture:** `SPINE`.

### AT-LF-9 — Evidence level proves with verifiable evidence (Level 3)  ·  `GA-22`

- *Given* the same component at grade **Evidence**, *then* the checks are a
  strict superset of Context's and the Level-3 verdict rests on verifiable
  evidence, not an agent opinion.
- **Pass/fail:** a real, verifiable Evidence result superseding Context's set; an
  Evidence pass backed only by an unverifiable agent assertion fails.
- **Fixture:** `SPINE`.

### AT-LF-10 — diff-scoped by default; ignore rules and working dir honored  ·  `GA-28`

- *Given* the covered component under the default scope, *when* the check runs,
  *then* it inspects only the changed files, respects the component's ignore
  rules (generated/vendored/build paths), and runs inside the component's
  working directory — never silently widening scope.
- **Pass/fail:** the clean and ignored files are untouched by the check and only
  changed files are inspected; inspecting the whole repo by default, ignoring
  the ignore rules, or running from the wrong directory fails.
- **Fixture:** `SPINE`.

### AT-LF-11 — a read-only check that mutates is a failure  ·  `GA-27`

- *Given* an approved read-only check whose tool mutates the working tree, *when*
  Rig detects the mutation, *then* it stops before any further planned command
  runs, fails the check, and reports the exact changed paths with before/after
  evidence — **without** auto-restoring the tree and without continuing.
- **Pass/fail:** mutation detected, execution halted, changed paths reported with
  before/after, tree left as-is. An auto-restore, a continuation, or a pass fails.
- **Fixture:** `SPINE` variant whose configured check writes to the tree.

### AT-LF-12 — autofix is a separate, separately approved mutating action  ·  `GA-29`

- *Given* a completed read-only check, *then* no source is rewritten. *When* the
  user explicitly invokes a specific fix command under its own approval, *then*
  Rig applies format and/or safe lint fixes, re-verifies by re-running the
  check, and leaves the result as uncommitted working-tree edits the user owns —
  never committed, never bundled into the check.
- **Pass/fail:** no mutation from the check itself; fixes only under the separate
  approval; a re-run verification; uncommitted user-owned edits. Autofix folded
  into the check, auto-committed, or run without its own approval fails.
- **Fixture:** `SPINE`.

### AT-LF-13 — CI (Evidence) is additive / proposed / preserving  ·  `GA-30`

- *Given* the Evidence level, *then*: with **verified existing CI**, Rig adds its
  whole-scope gate additively without touching unrelated jobs; with **absent or
  unsupported CI**, Rig writes nothing until the user chooses a provider and
  approves a separate plan; with a **pipeline Rig does not understand**, the
  pipeline is preserved and reported, never silently edited or replaced.
- **Pass/fail:** each of the three inputs produces its stated behavior; a silent
  edit of an unknown pipeline, an auto-created CI on selection alone, or a
  clobbered unrelated job fails.
- **Fixture:** `SPINE` with three CI variants (verified / absent / unknown).

### AT-LF-14 — command drift stops execution  ·  `GA-31`

- *Given* a plan-approved task that has since changed (different tool, new
  target, or an edit after approval), *when* execution reaches it, *then* Rig
  stops before running, does not execute the changed command, discloses the
  exact drift, and requires a freshly rediscovered plan the user approves before
  resuming.
- **Pass/fail:** the changed command never runs under the old approval and the
  drift is disclosed; silently running the changed task, or running the stale
  approved text, fails.
- **Fixture:** `SPINE` where the bound task is mutated after approval.

### AT-LF-15 — report is failure-centric, local, redacted, actionable  ·  `GA-32`

- *Given* a check that produces findings (including one containing secret/PII-
  shaped content), *when* it reports, *then* the report stays on the producing
  host, keeps failures/vacuous/gap state and omits routine passes, redacts
  secrets/PII/host-rooted data on the producing host before anything leaves it,
  and explains each finding as an actionable item; in CI only verdict, counts,
  and rule identities are emitted; secret-matched content reaches the agent only
  on explicit opt-in.
- **Pass/fail:** no report/artifact leaves the host, CI carries only
  verdict/counts/rule-identities, matched secret content is absent from agent
  context by default, and findings are actionable not raw. Any leaked detail,
  uploaded artifact, or default secret exposure fails.
- **Fixture:** `SPINE` with a planted secret-shaped finding.

### AT-LF-16 — every abnormal ending is its own non-passing state  ·  `GA-33`

- *Given* checks that end abnormally — timeout, user cancellation,
  missing-dependency, signalled/killed, partial-output, command-not-found —
  *then* each resolves to its own distinct, reported, non-passing state naming
  exactly why.
- **Pass/fail:** all six endings produce six distinct named non-passing results;
  collapsing any into "pass," into a generic "failed," or treating an
  inconclusive end as non-blocking fails.
- **Fixture:** `SPINE` with six induced abnormal endings.

### AT-LF-17 — reinstall is an idempotent resume  ·  `GA-34`

- *Given* an interrupted or repeated install, *when* the user re-runs it, *then*
  it resumes from the manifest, claims no protection until complete, and produces
  no duplicated or accumulating entries.
- **Pass/fail:** a resumed install with no duplicates and no premature protection
  claim; a from-scratch rewrite, a duplicate entry, or a mid-install "protected"
  claim fails.
- **Fixture:** `SPINE`.

### AT-LF-18 — removal reverses exactly the manifest; user fixes survive  ·  `GA-34`

- *Given* lint-format installed (generated CI, config, managed blocks) and a
  source fix the user applied via autofix, *when* the user uninstalls, *then* Rig
  reverses exactly what its manifest recorded it created and nothing else, and
  the user's autofix source edits survive.
- **Pass/fail:** manifest-recorded artifacts removed, everything else (including
  the user's fixes and any artifact Rig cannot prove it created) untouched;
  reverting user fixes or deleting an unrecorded artifact fails.
- **Fixture:** `SPINE`.

### AT-LF-19 — support is claimed per component, only on real evidence  ·  `GA-35`, `GA-24`

- *Given* `POLY` after apply, *then* the covered JS component is claimed
  supported **only** because Rig built ≥ Policy, bound its commands, and produced
  a real (non-placeholder) result under plan-bound consent; the excluded non-JS
  component is not claimed; and the **whole-repository** claim is suppressed
  because a discovered component was excluded — while the covered component stays
  truthfully supported.
- **Pass/fail:** per-component support tracks real evidence and the
  whole-repository claim is withheld under any exclusion; claiming
  whole-repository support from install success, or from per-run results without
  a built level, fails.
- **Fixture:** `POLY`.

---

## Decision → case coverage

Every closed lint-format decision maps to at least one case; `POLY` is used only
where a single component cannot exhibit the behavior.

| Decision | Case(s) |
|---|---|
| `GA-15` release boundary/contents | context for all; no standalone case (settled by questions 1–3) |
| `GA-16`, `GA-17` hybrid-plus | `AT-LF-2` |
| `GA-19` open ecosystem | `AT-LF-1` |
| `GA-20` whole-repository discovery | `AT-LF-1`, `AT-LF-4` |
| `GA-21` semantic discovery | `AT-LF-3` |
| `GA-22` Policy→Context→Evidence | `AT-LF-7`, `AT-LF-8`, `AT-LF-9` |
| `GA-23` universal-but-vertical | scope guard (out of scope), no case |
| `GA-24` partial coverage | `AT-LF-6`, `AT-LF-19` |
| `GA-25` plan-bound consent | `AT-LF-5` |
| `GA-26` untrusted tasks | `AT-LF-5` |
| `GA-27` read-only guarantee | `AT-LF-11` |
| `GA-28` check scope | `AT-LF-4`, `AT-LF-10` |
| `GA-29` autofix | `AT-LF-12` |
| `GA-30` CI behavior | `AT-LF-13` |
| `GA-31` command drift | `AT-LF-14` |
| `GA-32` output privacy | `AT-LF-15` |
| `GA-33` failure semantics | `AT-LF-16` |
| `GA-34` lifecycle | `AT-LF-6`, `AT-LF-17`, `AT-LF-18` |
| `GA-35` support claim | `AT-LF-19` |

---

## What Stage B did with this (done 2026-08-21)

These 19 cases are now written into
[`../gate1/acceptance.md`](../gate1/acceptance.md) §7H and
[`../index/acceptance-cases.md`](../index/acceptance-cases.md); the count moved
from 49 to **68**, the "how the set has moved" table gained a 2026-08-21 row,
and the Gate 1 signature is marked stale. That amendment **breaks the
set-equality gate** until `rig-product-design` re-traces the `AT-LF-*` set into
Gate 2 §13 — which is Gate 2's job, not this phase's. What remains is the
intent owner's signature on the re-freeze (Stage B step 6) — a physical act,
not something this amendment can perform.
