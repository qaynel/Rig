# Tier 2 Advanced — Grilling (decision history; Gate 1 RE-FROZEN 2026-07-25)

Grilling **decision history** for **Tier 2 Advanced** — the `GA-#` record of *how* the intent was
reached. Started 2026-07-21 from the grilling session that follows shipped Tier 2 Basic.

> **Gate 1 FROZEN 2026-07-24 (user sign-off) — the frozen deliverable has been transferred to
> [`business-spec.md`](../../current/spec/business-spec.md) + [`acceptance.md`](../../current/acceptance.md)** (clean business intent + the 16 acceptance tests; the
> artifact Gate 2 designs against). **This file is retained as the grilling decision history /
> rationale** — the source of truth for *why* each `GA-#` was decided. **Gate contract:** the design
> / implementation agent must not author or edit the frozen Gate-1 intent; a wrong Gate-1 decision
> changes only by returning here and having the intent owner revise it.

> **Re-grill 2026-07-25 (GA-10).** The user reopened Gate 1 after the frozen
> Gate 2, later SOW/task rulings, placeholder catalogue, and green-but-incomplete
> tests proved mutually inconsistent. The revised authority is
> [`business-spec.md`](../../current/spec/business-spec.md) +
> [`acceptance.md`](../../current/acceptance.md), both re-frozen 2026-07-25.
> GA-10 below supersedes earlier mandatory/non-declinable-baseline wording and
> reopens Gate 2 for a specification-first redesign.

> **Naming note (2026-07-23) — GA-9g:** "Tier 2 Advanced" / "Basic" / "mid" are **deprecated
> tier naming**. The shipped shape is the single **à-la-carte catalogue** (families → services →
> per-service grades); there is **no installable "Advanced."** This doc keeps its legacy title
> as grilling history. **Follow-up DONE 2026-07-24:** deprecated tier docs archived under
> `../deprecated-tier-taxonomy/`; public README + agent project-context vocabulary
> refactored to baseline + catalogue.

- Product source of truth: `../foundational/rig-foundational-design.md`
- Active delivery docs: [`README.md`](../../README.md) in this folder; Gate 1
  [`business-spec.md`](../../current/spec/business-spec.md) + [`acceptance.md`](../../current/acceptance.md)
- Archived packaging taxonomy: `../deprecated-tier-taxonomy/`
- Foundational decisions log: `grill-decisions.md` (G4, G11, **G11a** —
  G11a superseded; B1 locked by GA-2)
- Historical MCP configurator design (archived): `../deprecated-tier-taxonomy/basic/basic-design.md`

**Current status:** **default-on, fully user-controlled agent-tech-safety
baseline + complete 115-service à-la-carte catalogue** (GA-10). The four-family
catalogue and per-service grade model from GA-9 remain. The user may explicitly
configure or disable any safety control, while Rig reports disabled/unrun work
truthfully. Brain fork **B1** (GA-2) still holds (no Rig runtime or model key).
The prior Gate 2 is reopened and cannot govern implementation until amended,
versioned, specification-reviewed, and re-frozen.

**Resume point:** Gate 1 is re-frozen. Return through `rig-product-design` to
replace the contradictory Gate 2 with one canonical technical specification and
an executable specification gate before resuming implementation.

**Status (revamp, GA-9, 2026-07-21):** the **fixed tier stack itself is being dissolved** into a
**two-axis à-la-carte delivery model** — *which capabilities* × *what grade of each*, driven by a
repo-scan recommendation lens. See **"Delivery model (GA-9)"** below. This supersedes the
Basic→mid→Advanced *packaging* (GA-4a/4b); the *capability content* (B security, C/D testing ladder)
survives unchanged, re-cast as à-la-carte capabilities with per-capability grade dials. B1 (GA-2)
still holds. Open sub-question: cross-capability dependencies (do à-la-carte picks stay coherent).

**Decision-ID convention:** Advanced Gate-1 decisions are `GA-#` (Grill-Advanced), to keep the
namespace clean vs. foundational `G#` and Basic `BSC/SC/PD#`.

**Gate contract (routing.md):** the implementation agent must not author or edit this file.
A wrong Gate-1 decision changes only by returning here and having the intent owner revise it.

---

## Inherited context (frozen — NOT re-decided here)

From G11 (`grill-decisions.md`) and the archived
`../deprecated-tier-taxonomy/tier-2-design.md` §2/§5 (historical):

- Tier 2 split into **Basic** (shipped: credentialed multi-host MCP configurator) and
  **Advanced** (this doc).
- Inherited G11 framing was **"agents/loops + repo-scoped memory store"** (Rig's gstack-gbrain
  analog). **⚠ This framing was RESET during grilling (GA-1) — see below.**
- **#11 (foundational):** the agent IS the generator; Rig emits config, not a runtime. Basic
  and Tier 1 both honor this (no process runs in the installed repo). **Preserved in Advanced
  (GA-2).**
- **Secrets (#7, non-negotiable):** any creds use the gitignored `.env` + generated
  `.env.example`, same as Basic.

## Raw intent input (2026-07-21) — narrowed by GA-1

First intent pass (Q1 answer). The user described Advanced as a **bundle**, then narrowed it
(Q2 answer → GA-1). Capabilities as named:

- **Cap A — Local-model agent-loop runtime** (heard "Lang Granville" → **LangGraph**; confirm at
  Tier-3 grilling), for sensitive/private work. → **Deferred to Tier 3 (GA-1).**
- **Cap B — Harness security vetting:** inspect `skills.md` / `rules.md` (the harness payload)
  **before adoption**, to guard against **malicious harnesses** installed in the repo
  (supply-chain / prompt-injection defense). *Net-new; absent from prior docs.* → **In Advanced.**
- **Cap C — Standardized, repeatable testing pipeline** the agent can call for any code
  ("standardized code testing protocols the agent can call time and time again"). → **In Advanced.**
- **Cap D — Hardwired spec→test→code enforcement:** spec doc → design tests around the spec →
  write code → test against it, "hardwired into the agents" (= #13 two-gate + TDD, systems-level).
  → **In Advanced.**
- **Cross-cutting — "highly customizable"** (grilled at GA-6).

**Identity (confirmed, GA-1):** Advanced = *harden agentic execution for sensitive / local-model
repos* — **security-vetting (B) + standardized testing (C) + spec-enforced rigor (D)**,
host-agnostic, all customizable. The user judged **B/C/D tractable and effective for all hosts**
and the runtime (A) heavier → Tier 3.

**Parked observations — RESOLVED:**
1. Repo-scoped **memory store** → **out of Advanced**; relocated to Tier 3 with the runtime (GA-1).
2. Local-models + LangGraph → **Tier 3**, so **B1 holds** for Tier 2 Advanced (GA-2).

## Locked scope (2026-07-21)

- **GA-1 — Scope / identity → LOCKED.** Tier 2 Advanced ships **B + C + D together**,
  host-agnostic, **+ per-host install documentation** ("proper documentation for proper
  installation for each host" — the Basic PD8 `.rig/mcp-setup.md` runbook analog). The stated
  bar is **effective for all hosts** (enforcement-tiering reality tracked at GA-7). **Deferred to
  Tier 3:** Cap A (local-model / LangGraph runtime), the repo-scoped memory store, and the B2
  runtime question. *Identity reset away from the inherited "gbrain memory store" framing.*
- **GA-2 — Brain / runtime fork (old G11a) → LOCKED: B1 (config / host-brain), by entailment.**
  With the runtime (A) at Tier 3, Tier 2 Advanced runs **no Rig process and no model key** —
  Rig authors config (skills / rules / hooks) the host agent executes. **#11 survives**, exactly
  as Tier 1 and Basic. B2 (Rig-runtime + own model key) relocates to **Tier 3**.

## Capability B (GA-3) — grilling detail

**Reference (user-supplied 2026-07-21):** the *Agent Harness Security Playbook* v1.0 — preserved
at `../../current/reference/agent-harness-security-playbook.raw.md` (raw paste; the playbook body appears
twice and is preceded by a real security audit of *this* repo's README / host drift). It is the
**authoritative detection semantics** for B: threat model (§3), a 22-item detection catalogue
(§4, `AH-*`), hard blockers (§5), a defensive lifecycle (§6), a security-agent operating
procedure (§7), a ready-to-paste review-agent instruction block (§9), and a JSON verdict schema
(§10), aligned to OWASP Agentic Top-10 / NIST AI RMF / MITRE ATLAS / OpenSSF.

- **Threat model → LOCKED: all of (a) agent injection, (b) dangerous-action directives, (c)
  disable-Rig's-own-guardrails.** Maps onto the playbook: (a) = AH-CTX-01; (b) = AH-ACT-02 /
  AH-SUP-03; (c) = AH-OBS-01 + AH-MEM-01 + AH-PER-01 + AH-CAP-01.
- **Vetter → LOCKED: layered** (deterministic static floor + host-agent judgment, GA-3).

**⚠ Pending (GA-3b) — the scope boundary against the playbook.** The playbook is *full-lifecycle*
and roughly half **runtime-behavioral**, which **requires the runtime deferred to Tier 3 (GA-2)**.
Tier 2 B is config-only / no-runtime, so it can only deliver the **static, files-at-rest** subset.
Proposed split (awaiting confirmation):

| In Tier 2 B — static inspection of harness payload at rest | → Tier 3 — needs runtime |
|---|---|
| AH-CTX-01 prompt-carrier prose; AH-CAP-01/02 privilege + descriptor poisoning; AH-ACT-02 text-to-exec directives; AH-MEM-01 policy-file poisoning; AH-PER-01 persistence directives; AH-OBS-01 guardrail-disabling directives; AH-SUP-01/02/03 pin / impersonation / lifecycle-hook; AH-UPD-01 version diff; AH-DOC-01/02/03 + AH-HOST-01 doc/host drift (Rig already partly does via `check-rule-copies.js` / `check-versions.js`) | AH-GOAL-01 goal drift; AH-ACT-01 dangerous tool-chain sequences; AH-NET-01 egress; AH-DATA-01 runtime data access; AH-ID-01 credential inheritance; AH-COM-01 inter-agent spoofing; AH-RES-01 budgets; plus §6 sandbox / DLP / JIT-creds / immutable-telemetry / kill-switch |

**Concrete shape B would take (for confirmation):** a **`rig-security-review` skill** (host-agent
judgment, adapted from playbook §9 + §4 + §5) + a **deterministic static-scan floor** (Rig script
over skills / rules / hooks / manifest / docs) + the **ALLOW / ALLOW_WITH_RESTRICTIONS /
QUARANTINE / BLOCK** verdict model (§1/§9) emitting the **§10 JSON schema**, run **before a
harness / skill is adopted**. Trigger + hit-response still to grill.

**⚠ Correction (user challenge, 2026-07-21): the two-column split above is TOO COARSE.**
Host-native **hooks are Tier-2-capable runtime enforcement** — B1, Rig authors / the host runs,
**precedent: Basic's SC6 `pre-commit` secret guard already runs at commit time, and G6a already
blesses real PreToolUse hooks on hook-capable hosts.** So runtime enforcement is **not wholly
Tier 3.** Re-scoping to a **three-way** split (Q6):

| Tier | Layer | Hosts | Needs |
|---|---|---|---|
| **T2** | (i) **Static inspection** (files at rest) | **all** | nothing (pure read) |
| **T2** | (ii) **Hook-based runtime enforcement** — PreToolUse / pre-commit *pattern* denies (egress command, `curl\|sh`, `.env` read, guardrail-disable) | **hook-capable only** (Claude/Codex/Copilot/OpenCode/pi); advisory prose elsewhere (G6a/SUP) | Rig-authored hooks; host runs them |
| **T3** | (iii) **Semantic-brain runtime judgment** (AH-GOAL-01 goal-drift, AH-ACT-01 in-context tool-chain intent) **+ isolation infra** (sandbox, egress proxy, DLP, JIT-cred broker, immutable telemetry) | — | a **brain (B2)** and/or OS/platform infra Rig can wire but not *be* |

**The only hard Tier-3 residual:** things needing an **LLM reasoning in the loop** (a hook
pattern-matches; it cannot judge "did the goal drift") or **actual isolation infrastructure**
(markdown+hooks is not a sandbox). Pulling (iii) into T2 would **reopen GA-2** (it needs the brain
sent to Tier 3).

**GA-3b → LOCKED (user, 2026-07-21):** Tier 2 B = **(i) static inspection [all hosts] + (ii)
hook-based runtime enforcement [hook-capable hosts; advisory prose elsewhere].** **(iii)
semantic-brain judgment + isolation infra → Tier 3.** GA-2 not reopened. Remaining B sub-parts:
**trigger + hit-response (GA-3c).**

**GA-3c — trigger + hit-response.** Trigger: static runs at **adopt/install time + on-demand
`rig-security-review` + pre-commit on changed harness files**; hooks run **continuous PreToolUse**
(hook-capable hosts). Hit-response (**reversible default — user deferred the detail, 2026-07-21,
"continue"**): deterministic floor **BLOCKs** unambiguous hits; judgment tier **QUARANTINEs**
uncertain / high-risk for human review (not auto-block); **fail-closed on unverifiable →
QUARANTINE**; clean **ALLOW** / bounded **ALLOW_WITH_RESTRICTIONS**; emitted as the playbook §10
JSON verdict. Revisit if the user later wants strict default-deny.

## Capability C + D (behavior-testing rigor) — grilling detail

**C and D have fused (user, 2026-07-21).** The "capability C" answer described C *and* D as one
flow: **extract the codebase's intended behavior → author tests that pin down that behavior and
prove no *other* behavior is possible → unexpected exceptions are noted and handled with grace,
nothing swallowed, maximum visibility → run it all through a standardized fail-fast pipeline.**

**Governing philosophy (user intent):** *"We are testing **behavior**, not code correctness. The
code can be correct but the behavior may be wrong."* Tests assert the intended behavior is the
**only** behavior possible; unexpected exceptions surface loudly (nothing swallowed).

**Reference (user-supplied 2026-07-21):** a concrete production testing-pipeline vision —
preserved at `../../current/reference/testing-pipeline-vision.raw.md` (mapped to the user's Ruby/Rails
lane-rate/JAS domain). The **fail-fast tier ladder**:

1. **Contract tests** (Pact) — external API boundary behaves as assumed.
2. **Property-based tests** (Rantly/Hypothesis) — "verify no other behavior is possible" across
   the input space, not 3 hand-picked cases.
3. **Mutation testing** (mutant) — proves the suite *actually pins behavior* (kills mutants), not
   just line coverage. The user calls this the piece that matters most.
4. **Behavior specs** (Cucumber/Gherkin) — the intended-behavior doc and the test are the same
   artifact (no translation drift); the "graceful, visible, nothing swallowed" requirement.
5. **Fault injection** (Toxiproxy) — "when it breaks, does it break loud and safe."
6. **E2E** (Playwright) — gated behind cheaper tiers, seeded ephemeral env.

Wired as a fail-fast bash script; each tier strictly more expensive and gated on the previous.
Slots next to the user's existing `pr-context.sh` (fail-fast, worktree-isolated, CI-ring).

**Language/host-agnosticism fork → RESOLVED (user, 2026-07-21): Option 1 — Rig ships the general
method/convention, not a fixed stack.** Rig ships a **standard testing convention** (a staple of
systems design) as **instructions + a fill-in template the agent copies and expands** against the
actual codebase, in that repo's own language/tools. **Rationale (user):** AI agents lack defined
conventions and users are too lazy to define them; shipping the convention means the agent inherits
rigor instead of inventing one per repo. The concrete Ruby stack in the reference is an *example
instantiation*, not the shipped artifact (it can become a named profile — foundational #10).

**Advanced-C content (user):** the rigorous end of the ladder — red-green (TDD) + property +
mutation + contract + chaos + E2E — wired into one fail-fast pipeline, **with failure reporting
(what broke, what didn't, why) exported to a `reports/` directory**, all **configurable**.

**⚠ Pending (GA-4a) — rigor progression + a Tier-2-Basic catch.** The user framed a
"basic→advanced" progression ("Tier 2 Basic = unit tests, Tier 2 Advanced = the full pipeline").
**Catch:** Tier 2 Basic is *shipped/locked* and its identity (BSC1) is the MCP configurator —
testing is not in it, and the red-green/unit *discipline as markdown* already ships in **Tier 1's
`rig-tdd`**. So the progression most likely = a **configurable rigor dial inside Tier 2 Advanced**
(minimal unit → full red-green+property → rigorous mutation+contract+chaos+E2E+reports), layered on
Tier-1 `rig-tdd` — *not* a change to shipped Basic. Awaiting the user's call.

**Update (user, 2026-07-21) — re-tiering proposal + catch.** User proposes: **Tier 2 Basic
(expanded) = MCP config + security (B) + minimal/unit tests**; **Tier 2 Advanced = the rigorous
pipeline** (full red-green + property + mutation + contract + chaos + E2E + reports). **⚠ Catch
raised:** this **reopens shipped/locked Tier 2 Basic** and dissolves its deliberately single
identity (BSC1 = the MCP configurator; BSC3 dropped even a verify loop to stay that tight).
Security + testing are agent-*discipline* (skills/hooks/scripts), categorically unlike config
emission; Tier 1 can't host security either (markdown-only; the scan floor is a script — Tier 2).
**Fork put to user:** (a) keep Basic clean, make **Advanced graduated** (entry security+unit → full
red-green+property → rigorous +mutation/contract/chaos/E2E) — nothing reopened; vs (b) **reopen
Basic** deliberately to "wired baseline = MCP + security + unit," worth it only if *security must be
baseline/table-stakes* is the priority.

**→ RESOLVED (user, 2026-07-21): a NEW mid-tier, Basic left untouched.** Rather than reopen shipped
Basic, Tier 2 gains a **third sub-level** between Basic and Advanced: **Basic** stays as-is (MCP
configurator); a **new mid-tier** (name TBD, "Basic-expanded") = **security (B) + minimal/unit
tests**; **Advanced** = the **rigorous pipeline**. No Basic re-grill; the mid-tier needs its own
Gate-1 grilling (the B / GA-3 work + minimal-testing feed it). *(The earlier same-turn "reopen
Basic" framing is withdrawn.)*

**Pipeline spine (user, 2026-07-21): a PURE CUMULATIVE DETERMINISM LADDER.** The rungs (unit →
property → mutation → contract → chaos → E2E) are **not** "applicable/N/A per repo" — they are a
monotonic ladder where **each rung shrinks the space of possible *unintended* behavior**, walked
**fail-fast** (each gated on the previous). This *dissolves* the adaptivity question:
- A repo lacking a surface (no external API → contract; no UI → E2E) does **not** "skip" a rung as
  N/A — the rung is **vacuously green with a logged reason** (nothing to pin); the ladder stays
  universal and `reports/` shows determinism coverage rung-by-rung. *(pending user confirm)*
- **Honest sharpenings:** (1) the rungs are different test *types* ordered by determinism
  contribution, not literally "bigger versions" of one test; **mutation is a meta-rung that
  *audits* whether the lower rungs actually pinned behavior** (kills mutants), not "more tests".
  (2) At the outer rungs the externals are inherently nondeterministic, so "determinism" there =
  **the code's behavior is pinned in the face of that** (deterministic, loud, nothing swallowed —
  the user's "breaks loud and safe"), not eliminating the externals' nondeterminism.

## Delivery model (GA-9, 2026-07-21) — à-la-carte capability × grade (supersedes the fixed tier stack)

**User revamp (2026-07-21), adopted — pending the dependency check below.** Rather than a fixed
Basic→mid→Advanced ladder that every repo climbs, Rig ships a **two-axis à-la-carte menu**:

1. **Axis 1 — which capabilities** (security, behavior-testing, MCP-config, docs, …). Not everything
   is installed; the user checks boxes. Avoids installing unwanted machinery/dependencies and keeps
   the user in control of what enters their repo.
2. **Axis 2 — what grade of each capability** — an ordered **minimal / mid / maximal** dial of
   **increasing granularity + determinism** (see grade semantics). Each capability defines what its
   own three grades *mean*; the unifying axis is "how deterministic / autonomous / rigorous."

**The linchpin — a repo-scan recommendation lens.** Every host ships with one baseline job: **scope
the current repository through a lens, then hand the user a menu of the capabilities (and suggested
grade) that actually fit this repo** — e.g. a repo already rich in MCPs → *minimal* MCP capability;
an unsure user who wants "just a taste" → *minimal* of all suggested capabilities; or *minimal* of
some and *maximal* of others, freely mixed. The scan **recommends** `(capability, grade)` pairs; the
user **overrides freely**. (Symmetry: this is capability C's "scope the codebase for intended
behavior" pointed at Rig's *own* install decision.)

**Grade semantics (per-capability ordered determinism dial), from the user's examples:**

| Capability | minimal | → | maximal |
|---|---|---|---|
| **Behavior-testing (C/D)** | unit tests only | → | the full determinism ladder + E2E + the whole testing framework/philosophy |
| **Skills / instructions** | ask the user a lot of questions (defer to human) | → | extremely deterministic: check race conditions, exceptions, read the architecture / code structure, and interrogate how *this* structure typically fails |
| **MCP-config** | a lean set of MCPs | → | broad wiring |

Increasing complexity + granularity + determinism as you climb minimal → mid → maximal. **Capabilities
are à-la-carte, and so is each capability's intensity.** User's framing: *"an overarching design
policy of delivery and serviceability."*

**How this reconciles with the earlier "cumulative" lock (GA-4b):** "cumulative" survives **within a
single capability's grade ladder** (testing rungs still stack: mutation audits property audits unit,
E2E gated behind the cheaper tiers). It is **dropped *across* capabilities** — you no longer must
take security to get testing. So GA-4b is re-read as *cumulative grades within a capability*, not
cumulative tiers across the product.

**Parked design-philosophy sidenote (NOT grilled — recorded per user "keep it as a sidenote"):**
when installing capabilities, **graft onto whatever agent-tech framework / `AGENTS.md` the repo
already has — never overwrite or insert our own over theirs.** Goal: minimal transition friction.
(Consistent with foundational graft-not-replace posture; formalize at product-design.)

**GA-9a — cross-capability dependency coherence → RESOLVED (user, 2026-07-21): auto-pull,
razor-scoped, after selection.** Capabilities are **not** all independent; each carries a
**dependency list**. Resolution order:

1. Take the user's per-capability grade selections (minimal/mid/maximal) and **lock them in** —
   the user's overall intent is the input.
2. **Then** check the selected set for **missing dependencies**.
3. **Auto-pull** each missing dependency — never warn-and-stop, never silently downgrade or "cut
   down" the dependent capability to dodge the gap, never make the user do dependency bookkeeping.

The auto-pulled piece is **razor-scoped to the dependent's specific requirement**, not a
general-purpose install. *Example (user's):* maximal-**security** selected + user chose only
minimal-**MCP**; maximal security needs MCP coverage → Rig adds **security-purpose MCP coverage**,
curated to fulfil exactly that dependency — **without** touching the user's minimal *general* MCP
grade, and **without** dragging in random general-purpose MCPs. So a capability's effective install
= the user's chosen grade (its general-purpose footprint) **+** any purpose-scoped satellite slices
other selected capabilities require.

**Principle (user):** never leave a selected capability *partially supported*; the user supplies
**overall intent**, and Rig translates it into a coherent install by fitting/​supercharging their
host — *"that's the entire point of Rig."* Auto-pull honours "user has say" (it *implements* their
maximal-X choice, which entails X's prerequisites), rather than overriding it.

**GA-9b — the scan lens → RESOLVED (user, 2026-07-21): a codebase profile matched against Rig's
capability catalogue for maximal fit.** The scan **profiles the codebase**, reading (host-brain,
per GA-2 B1 — no Rig runtime):

- **Purpose / type** — is it a **product**, an **integration**, …? What is the codebase *for*; what
  is the overall intention behind it?
- **Outbound calls** — are there any, and what are they?
- **Data manipulation** — what data is manipulated, why is it required, and its business-context
  relevance *where needed*.
- **Existing agent infrastructure** — are there already MCPs, an `AGENTS.md`, skills, rules?
  *"Where are we"* on agent tooling.

Then Rig matches that profile against its **pre-existing capability catalogue** and decides where to
**retrofit** its capabilities so the result is the **maximal contribution Rig can make** to this
codebase (the ceiling it *offers*; the user still dials each capability's grade — GA-9 axis 2).

**Host-first flow (user).** Before scoping, Rig **explains the pipeline/flow it will run and asks
the user which host is convenient**; the user hands over that host's access (API key / Claude Code /
etc. — Rig already carries these integrations). *Then* Rig scopes and profiles on that host.

**Core value this crystallises — automate the "transition" (elevates the parked graft sidenote to
central).** From user experience: installing any skill/rule today forces the user to first hand the
agent a manual *transition* — adapting the generic skill/rule so it actually fits this codebase
instead of landing raw. **Rig takes that transition off the user's shoulders** and performs the
per-codebase, per-host adaptation itself, so the install is seamless. The `AGENTS.md`-graft sidenote
is the mechanism of this transition, so it is **core**, not peripheral.

**GA-9c — security-bootstrap ordering → RESOLVED (user, 2026-07-21): sanitation FIRST; distrust
before profile.** Before Rig handles/builds anything, it **sanitises the existing agent framework**
(capability B over `AGENTS.md`/skills/rules/MCPs/hooks) — Rig will not build on top of a malicious
harness. Sequence:

1. **Get the host** the user provides.
2. **Sanitise** the existing agent framework (B's static floor first per GA-3's layering, then
   judgment; verdict/hit-response per GA-3c).
3. **Surface findings to the user with maximal context** — *"these are the malicious things / the
   sanitation fixes needed."* The user acts through their host (delete the file, make changes) —
   **or opts in** to let Rig perform the remediation **through the host itself** (host-brain write,
   B1, user-authorised — remove/modify the malicious pieces).
4. **Once sanitised**, proceed to profile the now-trusted **good** harness (what's to-spec, what's
   benign/inert) **+ the codebase** (GA-9b) and build the capability menu.

**Scope:** sanitation covers the **agent framework / harness**, not the whole codebase. It inherits
GA-3's layered vetter and GA-3c's verdict model; it **adds opt-in, user-authorised Rig-assisted
remediation** (a write action — so consent-gated, consistent with B1/no-silent-mutation). Net: the
literal first act on any new repo is *distrust*, not profiling.

**GA-9d — lifecycle → RESOLVED (user, 2026-07-21): an installed always-on drift-prevention rule,
not a stateful memory store.** Onboarding installs (among the retrofitted capabilities) an
**always-on rule**: **after every change, update the global context so tool contexts do not drift**
(no context drift across the different agent tools/hosts). Drift is minimised by:

- **Inline references to other documents** → push toward **fewer, central sources of truth** (DRY
  for context); reference rather than copy.
- Where content is **genuinely critical to have inline/in-memory**, duplicate it **but annotate with
  a "always keep this in sync with the repository" note.**

**Why this stays Tier 2 (does NOT reopen the Tier-3 memory deferral):** the state lives in the
**repo's own docs** (the source of truth), not in a persistent cross-session Rig memory store. This
realises "grows with the repo" **statelessly** — the repo *is* the memory; an always-on rule keeps
every tool's context coherent as the repo evolves. Pure B1 (a rule the host executes; no Rig
runtime). **Precedent in Rig's own repo:** `check-rule-copies.js` / `check-versions.js` already
enforce that duplicated payloads stay identical — the same "keep in sync" discipline, as a check.

**GA-9e — drift enforcement → RESOLVED (user, 2026-07-21): layered — deterministic exact-copy check
+ semantic drift guard.** Two complementary layers, mirroring GA-3's floor+judgment:

- **Deterministic floor** — an **exact-duplicate one-to-one sync check** for the identical copies
  kept to hold multiple agents/hosts in sync (byte-identical). Fails commit/CI on drift. Precedent:
  `check-rule-copies.js`.
- **Semantic guard** — an **agent-based** (host-brain, B1) check for content that isn't identical
  but must stay *semantically on the same page*. Catches the case the copy-check can't: one context
  is **stale / on a deprecated branch** while another is current. Uses the agent for what it's best
  at (semantic judgment), not byte-matching.

Deterministic where a literal 1:1 copy relationship exists; semantic where alignment is about
meaning, not bytes. Both run in combination.

**GA-7 / context-sync → RESOLVED (user, 2026-07-21): run it on BOTH layers — never-too-safe.**
Context-sync is **just a script**, so its cost is negligible; therefore run it **everywhere it can
run**, not weighted primary/secondary as a cost tradeoff:

- **Host always-on rule (dev-time) — indispensable.** It is the *only* layer live *while you work*,
  and **during development you cannot count on git/CI** (that only bites at share/push). **Trigger
  (agent judgment):** run the sync/update-context script when **the conversation has grown extremely
  long** and refreshing the overall context would help, or when **new product insights have been
  found** worth capturing.
- **git/CI floor — also included** (cheap, so no reason to omit it): the exact-copy sync check also
  runs on the git/CI floor and can **piggyback on the repo's existing testing infrastructure**.

**Stated security policy (user, cross-cutting): "you can never be too safe."** Where a guard is a
cheap deterministic script, **default to running it in every place it can run** (dev-time rule *and*
git/CI floor) rather than picking one. *(Contrast with the earlier primary/secondary framing, which
the user overrode — cost is not the constraint here.)*

**GA-9f — install taxonomy → RESOLVED (user, 2026-07-21): FAMILY → SERVICE → GRADE (refines the
GA-9 two-axis model into three levels).** The install guide is organised as:

- **Families of services** (categories): **Security**, **Infrastructure**, **Development/​
  Engineering** (testing, etc.), **Context**, … — the top-level menu grouping.
- **Services (members)** within a family: e.g. Testing family → contract, property, mutation, chaos,
  E2E as **separate services on their own**; Security family → static-scan, sanitation, hooks; etc.
- **Grade per service** (minimal / mid / maximal) = **degree of thoroughness of that service's
  implementation** — minimal = the bare-minimum implementation for the feature; maximal = the most
  thorough (e.g. most thorough E2E). Grade is **per service**, not one dial for a whole family.

**Applicability + override:** the scan marks each service **applicable / not-recommended** for the
codebase, **but the user may still install non-recommended services** — *"open-source software and
high configurability"* (configurability over paternalism). Recommendation is advisory, not a gate.

**Reconciliation with earlier decisions:**
- The GA-9 "capabilities" B / C-D **are families** (B = Security; C/D = Development/Testing). The
  finer family→service→grade granularity **supersedes** "grade per capability."
- The **cumulative determinism ladder** (unit→property→mutation→contract→chaos→E2E) is **not** lost —
  it is expressed as **inter-service dependencies (GA-9a auto-pull):** installing `mutation` pulls in
  the `unit`/`property` it audits. The ladder is the dependency graph; **grade is an orthogonal
  thoroughness dial** on each service.

**GA-4 no-surface / upward-override → RESOLVED by GA-9f:** a user **may** install a service the scan
marked not-applicable (e.g. E2E on a surfaceless pure library) — **not clamped, not refused**
(configurability wins). A service installed with no surface to bite **runs vacuously and logs that
there is nothing to pin** in `reports/` — consistent with capability C's *"nothing swallowed,
maximum visibility."* The scan simply won't *recommend* it; it won't *forbid* it.

## À-la-carte catalogue — Development family contents (GA-9k, 2026-07-23)

User-supplied service catalogue for the **Development** family (answering "what lives in Development
now that Testing is a distinct family, GA-9j"). The cross-family boundary notes are the user's own
and reinforce GA-9i (product security separate) + the Infrastructure split.

**Development family — service groups (user's numbering; category 3 Testing is the separate family):**

1. **Code creation & modification** — feature implementation from spec/ticket · refactoring
   (mechanical or structural) · codegen/scaffolding (boilerplate, new modules, framework migrations) ·
   API/SDK client generation from schemas (OpenAPI/GraphQL/protobuf).
2. **Code quality gates** — linting/formatting enforcement · type-checking rigor · static analysis for
   correctness/complexity *(NOT security scanning — that's Security/Infra)* · code review (style,
   correctness, architectural fit).
3. *(**Testing** — the distinct Testing family, GA-9j; contents below.)*
4. **Debugging & diagnosis** — structured debugging (reproduce → isolate → fix) · log/trace analysis
   *(app-level, not infra observability)* · root-cause analysis from stack traces.
5. **Dependency management (dev-facing only)** — dependency upgrades incl. breaking-change migration ·
   deprecation/compatibility triage. *(vulnerability scanning + license compliance → Security.)*
6. **Documentation** — API/reference doc generation · ADRs · inline comment/docstring maintenance ·
   onboarding/dev-setup docs.
7. **Architecture & design** — system/component design proposals · tech-debt identification/
   prioritization · design review against functional constraints.
8. **Data & schema (application-level)** — DB migration authoring · schema evolution/backward-compat
   checks.
9. **Performance (code-level)** — profiling & bottleneck identification. *(perf/load **test authoring**
   → Testing g9, merged 2026-07-24 for MECE; runtime/infra scaling → Infrastructure.)*
10. **Repo/project hygiene** — issue/PR triage & labeling · stale branch/PR cleanup · standup/status
    update generation from commits.

**Testing family (GA-9j), enriched by the user's category 3:** test generation
(unit/integration/e2e) · test strategy/coverage planning · flaky-test detection & quarantine ·
property-based/fuzz authoring — layered on the determinism ladder
(unit→property→mutation→contract→chaos→E2E).

**Cross-family boundaries reaffirmed (user):** security scanning · vulnerability scanning · license
compliance → **Security** (product security, GA-9i). Infra observability · runtime/infra scaling →
**Infrastructure**.

**GA-9k(1) — taxonomy granularity → RESOLVED (user, 2026-07-24): option (c), a formal GROUP tier.**
The 10 numbered categories become a real **group** level and each bullet becomes an individually
selectable **service**, so the install taxonomy gains a fourth level: **family → group → service →
grade** — refining/superseding GA-9f's three-level family → service → grade. **Grade stays
per-service** (the leaf), exactly as GA-9f fixed; the group is a formal taxonomy tier, not just a
display heading. Whether a group is itself bulk-selectable (install a whole group in one action) vs.
navigation-only is a Gate-2 *mechanism* detail (with GA-6). So Development = one family → its 10
groups → each group's bullet-services → per-service grade.

**GA-9k(a) — taxonomy uniformity → RESOLVED (user, 2026-07-24): UNIFORM.** The group tier applies to
*all* families — the user answered by supplying the **Testing** family in the identical
`family → group → service` shape (see **GA-9l** below). So the whole catalogue is uniformly
**family → group → service → grade**; no flat-vs-grouped special-casing. GA-9a dependency edges ride
on the services regardless of grouping.

**GA-9k(c) — taxonomy-depth note (reversible default, 2026-07-24).** The user's mutation and
product-security taxonomies each enumerate *numbered tools → sub-capabilities*. Mapped onto
`family → group → service → grade`: because **Product-Security is rooted at a family**, its 4 tools =
**groups**, sub-capabilities = **services**, internal dials = **grade**; because **mutation is rooted
at a group** (inside Testing), its 10 tools = **services**, sub-capabilities = **grade**. Both stay
within the locked 4 levels — no 5th selectable tier. *Reversible default:* if the user intends
sub-capabilities to be **individually selectable** (a 5th tier), re-open; recorded this way for now.

**GA-9k(b) — v1 scope → RESOLVED (user, 2026-07-24): (a) the WHOLE catalogue ships in v1.** Rationale
(user): *"once we've nailed down the specs it's just a matter of tokens how big we ship — services
will just ship the entire thing through on v1."* Coherent under the locked **GA-4 model**: Rig ships
each service as an **agent-facing convention / fill-in template (markdown/config), not the underlying
engine** — so catalogue breadth is an **authoring-volume** question, not an architectural one (no
runtime is built per service; the host agent wires the repo's own tooling). **Nuance (recorded):**
"just tokens" holds for the *convention* services; a **minority are deterministic floors/scripts +
hooks** (static-scan, context-sync check, pre-commit secret scanner, CI gates) that carry real logic
+ their own tests — cheap, but not literally markdown-only. The always-on agent-tech-safety baseline
ships regardless of selection.

**⚠ STILL OPEN — the binding constraint is no longer scope but Gate-1 acceptance (GA-8).** With the
whole catalogue in v1, Gate 1 owes **observable acceptance criteria per shipped service**. Since the
user's own framing is *"once specs are nailed it's just instances,"* the live fork is the acceptance
**approach**: archetype/pattern-level (prove the common service shape once + enumerate instances) vs
per-service bespoke — plus the thin GA-4 residual (per-change vs whole-repo run scope; `reports/`
contents).

## À-la-carte catalogue — Testing family contents (GA-9l, 2026-07-24)

User-supplied service catalogue for the **Testing** family, in the uniform group → service shape —
confirming **GA-9k(a)** (the group tier generalises beyond Development). Supersedes the earlier
one-line "Testing family (GA-9j), enriched" sketch above.

**Testing family — groups (user's numbering) → services:**

1. **Unit testing** — test-case generation from function/method signatures · edge-case &
   boundary-value identification · mocking/stubbing strategy for isolated units.
2. **Integration testing** — cross-module interaction tests · DB/external-service integration
   scaffolding · **contract testing** between internal services.
3. **End-to-end testing** — user-flow/journey authoring · browser/UI automation scripting ·
   cross-environment E2E consistency checks.
4. **Test strategy & planning** — coverage-gap analysis · test-pyramid balancing (unit/integration/
   e2e ratio) · risk-based prioritization (what to test first/deepest).
5. **Regression testing** — regression-suite curation from past bug fixes · change-impact analysis
   (which tests to rerun for a diff) · snapshot/golden-file maintenance.
6. **Property-based & fuzz testing** — property/invariant identification from spec · fuzz-input
   generation · shrinking/minimal-failing-case extraction.
7. **Test data management** — fixture/factory generation · synthetic test-data creation · test-data
   anonymization strategy *(dev-facing, not compliance)*.
8. **Flaky & reliability testing** — flaky-test detection & quarantine · root-cause of intermittent
   failures · retry/determinism hardening (fixing race conditions *in tests*).
9. **Performance & load testing (dev-facing)** — load/stress script authoring · benchmark creation
   for critical paths · performance-regression detection in CI. *(sole home for perf/load **test
   authoring** — Development g9's was merged here, 2026-07-24 MECE.)*
10. **Test maintenance & refactoring** — dead/redundant test pruning · test readability/DRY
    refactoring · test-to-code sync checks (tests updated alongside behavior changes).

**Determinism-ladder mapping → RESOLVED (user, 2026-07-24).** GA-4b/9f locked the fail-fast ladder
**unit → property → mutation → contract → chaos → E2E**. Onto this catalogue: unit = g1; property =
g6; contract = g2's internal-contract service; E2E = g3; **chaos = Infrastructure g7** (GA-9m);
**mutation = RESTORED as an 11th Testing group** (option (a) — not dropped). The user supplied a full
10-tool internal taxonomy for mutation, preserved at `../../current/reference/mutation-testing-taxonomy.raw.md`:
mutant generator · selector/sampler · equivalent-mutant detector · execution orchestrator · survivor
root-cause analyzer · test-suite remediation advisor · score metrics & trend tracker · CI/CD gate &
policy enforcer · run reporting/viz · language/runtime adapter. Each tool = a **service** of the
mutation group; its sub-capabilities (plugins/modes/flags) = the per-service **grade** detail
(GA-9k(c)). The GA-9a dependency edge holds: installing mutation pulls the unit/property it audits.

## À-la-carte catalogue — Infrastructure family contents (GA-9m, 2026-07-24)

User-supplied service catalogue for the **Infrastructure** family, same uniform group → service shape.

**Infrastructure family — groups (user's numbering) → services:**

1. **Provisioning & IaC** — IaC authoring (Terraform/Pulumi/CloudFormation) · environment-parity
   enforcement (dev/staging/prod) · resource sizing & capacity planning.
2. **CI/CD pipeline architecture** — pipeline definition (build/test/deploy orchestration) ·
   deployment strategy (blue-green / canary / rolling) · release gating & promotion across envs.
3. **Container & orchestration** — Dockerfile/image build optimization · Kubernetes manifest / Helm
   chart authoring · service-mesh & pod-scheduling config.
4. **Networking** — load-balancer & ingress config · DNS & service discovery · VPC/subnet/firewall
   topology.
5. **Observability** — metrics/dashboard instrumentation *(not app-level log analysis — that's
   Development debugging)* · distributed tracing · alerting rules & on-call routing.
6. **Storage & data infrastructure** — DB provisioning & replication topology · backup/restore
   automation · storage tiering & lifecycle policies.
7. **Scaling & reliability** — autoscaling policy config · **infra-level load testing** (capacity
   limits, not app perf) · **chaos engineering / resilience testing**.
8. **Cost management** — resource-utilization analysis · cost-anomaly detection · rightsizing &
   reserved-capacity recommendations.
9. **Environment & config management** — config/secrets **injection wiring** — the **sole home for
   runtime secret injection** (mechanics; Product-Security 1d merged here 2026-07-24; secret
   *content*/handling — encryption, leak-scan, rotation — stays Product-Security) · feature-flag
   infrastructure · multi-env config-drift detection.
10. **Disaster recovery & continuity** — DR-plan authoring & runbooks · failover testing &
    automation · RTO/RPO validation.

**Cross-family boundaries (user's own):** app-level log/trace analysis → **Development** (debugging);
secret *content* / depth → **Product-Security**; the ladder's **chaos** rung lives here (g7). *Note —
perf/load **deduped for MECE** (2026-07-24): Development = profiling only, Testing = the sole home for
perf/load test-authoring, Infrastructure = capacity load — three distinct concerns.*

## À-la-carte catalogue — Product-Security family contents (GA-9n, 2026-07-24)

The **fourth and final family** — the GA-9j family set is now complete: **Development · Testing ·
Infrastructure · Product-Security.** This is **product/application security**, the à-la-carte,
user-dialed concern (GA-9i), **distinct from the always-on agent-tech-safety baseline** (capability
B sanitation + drift). User-supplied taxonomy preserved at
`../../current/reference/product-security-taxonomy.raw.md`.

**Product-Security family — groups → services (user's numbering):**

1. **Secrets & credential handling** — encrypted-at-rest store · toy-project relaxation mode ·
   pre-commit secret-leak scanner · credential-rotation reminder. *(runtime secret **injection** →
   Infrastructure g9, merged 2026-07-24 for MECE — injection is plumbing; this family owns the
   security *of* the secret.)*
2. **Static & dependency vulnerability scanning** — SAST (source taint-flow) · SCA / dependency-CVE
   (reachability-aware) · secrets-in-dependencies cross-check · IaC scanning · **scan-depth dial**.
3. **License compliance** — license detection & inventory (SBOM) · policy-conflict checker ·
   license-change diff watcher · attribution/NOTICE-file generator.
4. **Active red-team / penetration simulation** *(maximal grade)* — automated DAST · **red/green
   adversarial simulation** · auth & session-boundary probe · rate-limit/abuse-resistance sim ·
   blast-radius containment verifier.

Per GA-9k(c): each numbered tool = a **group**; its sub-capabilities (1a, 1b, …) = **services**; the
depth-dials / sub-modes inside them (e.g. 2a's lint→taint-flow dial, 2e scan-depth) = **grade**. This
closes the GA-9i line: the maximal grade of group 4 is the *"red-green + cyber-attack / penetration"*
the user described.

## Open decision queue (ordered; one at a time)

Grilling each B/C/D capability into concrete, testable intent — one question at a time.

| ID | Decision | Depends on | State |
|---|---|---|---|
| ~~GA-3~~ | **Capability B — RESOLVED (Gate-1 intent):** layered vetter · threat=all(a/b/c) · scope=static+hook-enforcement · trigger + hit-response (SC6-mirrored default). Detail in "Capability B grilling detail". | GA-1/2 | **resolved** |
| ~~GA-4~~ | **Behavior-testing capability (C/D) → RESOLVED.** General convention + language-agnostic template; ladder rungs = per-service w/ dependency-order (GA-9f/9a); no-surface/override (GA-9f); packaging superseded by GA-9; **run-scope = per-service diff/whole-repo mode (GA-4c)**; **`reports/` = failure-centric but complete-on-what-matters (GA-4d).** | GA-1/2 | **resolved** |
| ~~GA-9~~ | **Delivery-model revamp → RESOLVED:** the fixed tier stack is dissolved into the **à-la-carte family → service → grade** catalogue + repo-scan recommendation lens. Sub-decisions GA-9a…GA-9g locked. Parked sidenote (graft onto existing `AGENTS.md`, never overwrite) → Gate-2. | GA-1/2/4 | **resolved** |
| **GA-9g** | **Tier naming deprecated → the catalogue IS the product** (GA-9 option b confirmed). No installable Basic/mid/Advanced; "Advanced" retires completely (no named starter preset — the scan recommendation is the only per-repo "preset"); shipped Basic's MCP configurator → MCP-config service (Infrastructure). **Archive/refactor DONE 2026-07-24** under `project-dev-docs/archive/deprecated-tier-taxonomy/`. | GA-9 | **resolved** |
| **GA-9h** | **Offering shape = mandatory security baseline + à-la-carte capability layer.** "À-la-carte" = *which capabilities you add* (old model = fixed set; now fully user-chosen), **not** an opt-out of the security floor. Sanitation (GA-9c) + always-on drift-prevention + git/CI floor (GA-9d/9e) are non-declinable — the à-la-carte layer only proceeds inside a safe environment. | GA-9c/9d/9e | **resolved** |
| **GA-9i** | **Two "securities" distinguished.** Agent-tech safety (B sanitation/vetting + drift + git/CI) = **baseline, always-on, strictest, off-menu** — keep the agent env safe (no conflicting-agent clobber; contain local-model / dangerous-mode / auto-runner hazard). Product/application security (encryption & secret depth · how-deep-the-check · pen-test red-green) = **à-la-carte development concern.** Corrects GA-9f "Security family = B". | GA-9f/9h | **resolved** |
| **GA-9j** | **Development ≠ Testing — kept as distinct families.** v1 à-la-carte family set = **Development · Testing · Infrastructure · Product-Security** (over the agent-tech-safety baseline). Testing's spine = the determinism ladder; **Development's own constituent services still to define** (next). | GA-9i | **resolved (Development contents TBD)** |
| **GA-9k** | **Development family contents + taxonomy grain / uniformity / depth / v1-scope.** Contents = user's 10 service-groups (GA-9k section). **Grain (option c): 4-level family → group → service → grade**; **uniformity (GA-9k(a)): uniform across all families**; **depth (GA-9k(c)): held at 4 levels** (sub-capabilities map to service/grade, no 5th tier — reversible default); **v1 scope (GA-9k(b)): the WHOLE catalogue ships v1** ("just tokens" under the GA-4 convention-not-engine model). | GA-9j/9f | **grain · uniformity · depth · v1-scope resolved** |
| **GA-9l** | **Testing family contents.** User's 10 groups → services (GA-9l section). **RESOLVED:** ladder reconciled — chaos in Infra (GA-9m); **mutation restored as an 11th Testing group** (`../../current/reference/mutation-testing-taxonomy.raw.md`); tools=services, sub-caps=grade (GA-9k(c)). | GA-9k | **resolved** |
| **GA-9n** | **Product-Security family contents — 4th & final family.** 4 groups → services (`../../current/reference/product-security-taxonomy.raw.md`); closes the GA-9j family set. À-la-carte product security (GA-9i), separate from the agent-tech-safety baseline. | GA-9j/9i | **resolved** |
| **GA-9m** | **Infrastructure family contents.** User's 10 groups → services (GA-9m section). Chaos-engineering + infra-load live here; config/secret-injection is mechanics-only (content → Product-Security). **Perf/load deduped for MECE** (2026-07-24): Testing owns perf-test-authoring, Dev = profiling, Infra = capacity. | GA-9k(a) | **recorded** |
| **GA-9b** | **The repo-scan recommendation lens** — RESOLVED: profile (purpose/type · outbound calls · data manipulation · existing agent infra) → match to Rig's catalogue for maximal-fit retrofit; **host-first flow**; core value = automate the per-codebase "transition." | GA-9 | **resolved** |
| **GA-9c** | **Security-bootstrap ordering** — RESOLVED: **sanitation first** (host → B-vet existing harness → surface w/ max context → user or opt-in Rig remediation → *then* profile). Distrust before profile. | GA-9b, GA-3 | **resolved** |
| **GA-9d** | **Lifecycle** — RESOLVED: an installed **always-on drift-prevention rule** (update global context after every change; inline refs → central sources of truth; sync-note on unavoidable duplication). Repo = the memory; stateless; no Tier-3 store reopened. | GA-9 | **resolved** |
| **GA-9e** | **Drift-rule enforcement** — RESOLVED: layered — deterministic exact-copy sync check (`check-rule-copies.js`-style) + agent semantic drift guard (stale/deprecated-context detection). Both combined. | GA-9d, GA-3 | **resolved** |
| ~~GA-5~~ | **Folded into GA-4** — D (spec→test→code) fused with C into "behavior-testing rigor" (user, 2026-07-21). Its distinct sub-question (what this adds beyond shipped `rig-tdd`/`rig-grilling` + the #13 gate) is grilled within GA-4. | — | folded |
| GA-6 | **"Highly customizable"** — largely resolved by GA-9/9f: axes = family → service → grade; scan recommends, **user overrides freely incl. installing non-recommended services** (configurability > paternalism). Residual (Gate-2-ish): the *mechanism* — where selections are recorded (manifest / per-repo config). | GA-9f | **mostly resolved** |
| **GA-7** | **"All hosts" enforcement tiering — RESOLVED (user).** Confirmed 3-way: (1) git/CI deterministic floors run on **any repo with git** (host-agnostic); (2) live in-session tool-boundary enforcement only on **hook-capable hosts**, advisory prose elsewhere; (3) semantic layers ride the host's brain. **Refinement:** for **context-sync** the weighting flips — **primary = the dev-time host always-on rule** (drift is a development problem; git/CI can't be counted on mid-dev), **secondary = CI** (piggyback existing test infra) at share time. Trigger = agent judgment (very long conversation / new product insights). | GA-3/4/9 | **resolved** |
| **GA-8** | **Gate-1 acceptance authoring — LIVE.** **Approach RESOLVED (property/archetype-level, GA-8(a), 2026-07-24):** the user defined correct as system-wide properties (no-blowout · safe-by-construction · **MECE** · host-coverage · highly-configurable) — see "Acceptance criteria". **MECE reconciliation COMPLETE**; GA-4 residual closed (run-scope GA-4c; `reports/` GA-4d). **Acceptance tests AUTHORED (2026-07-24)** — archetype + baseline + per-property + bespoke cases, in "Acceptance tests". Gate 1 ready to freeze on user sign-off. Residual: multi-host test *strategy* → Gate-2. | GA-3…9 | **acceptance authored — awaiting sign-off** |

## Decisions log (locked)

| ID | Resolution |
|---|---|
| GA-1 | **Tier 2 Advanced = B + C + D**, host-agnostic, + per-host install docs. Identity reset away from the inherited memory-store framing. Cap A (local-model / LangGraph runtime) + memory store → **Tier 3**. **[Revised by GA-4a: B + minimal testing → new mid-tier (Basic untouched); Advanced = rigorous testing only.]** |
| GA-2 | **Brain fork → B1 (config / host-brain)**, by entailment of A→Tier 3: no Rig runtime, no model key in Tier 2; **#11 survives**. B2 relocates to Tier 3. |
| GA-3 | **Capability B vetter = LAYERED** — deterministic pattern floor (always runs, host-agnostic) + host-agent judgment review on top, mirroring Basic's SC6. **Threat model = all of (a) injection, (b) dangerous-action directives, (c) disable-Rig-guardrails.** Detection semantics governed by the user-supplied *Agent Harness Security Playbook* (`../../current/reference/`). Trigger / hit-response = GA-3c (open). |
| GA-3b | **Tier 2 B scope = (i) static inspection [all hosts] + (ii) hook-based runtime enforcement [hook-capable hosts; advisory prose elsewhere, G6a/SUP].** Precedent: Basic SC6 pre-commit guard + G6a PreToolUse hooks are B1 config, so runtime *enforcement* is Tier-2-capable. **(iii) semantic-brain judgment (goal-drift / tool-chain reasoning) + isolation infra (sandbox / egress / DLP / JIT-creds / immutable telemetry) → Tier 3** (needs a brain / OS infra; GA-2 not reopened). |
| GA-3c | **Trigger** = static at adopt/install + on-demand `rig-security-review` + pre-commit on changed files; hooks = continuous PreToolUse (hook-capable). **Hit-response (reversible default, user deferred):** floor BLOCKs unambiguous; judgment QUARANTINEs uncertain (human review); fail-closed→QUARANTINE on unverifiable; ALLOW / ALLOW_WITH_RESTRICTIONS otherwise; playbook §10 JSON verdict. |
| GA-4a | **RE-TIER into 3 Tier-2 sub-levels (supersedes GA-1 placement).** **Basic** stays as-is (shipped MCP configurator, *not* reopened). **New mid-tier** (name TBD, "Basic-expanded") = **security (B, GA-3)** + **minimal/unit tests**. **Advanced** = the **rigorous behavior-testing pipeline** (red-green + property + mutation + contract + chaos + E2E, `reports/`, configurable) as a **general convention + language-agnostic fill-in template**. GA-2 B1 holds across all. Mid-tier needs its own Gate-1 grilling. *(Earlier same-turn "reopen Basic" framing withdrawn — user chose a separate mid-tier, keeping Basic clean.)* |
| GA-4b | **Tier-2 sub-levels are CUMULATIVE (stacked):** Advanced ⊇ mid-tier ⊇ Basic. Installing Advanced pulls in the mid-tier (security + unit) and Basic (MCP config) beneath it; Advanced does **not** re-ship the unit layer — it assumes the mid-tier laid it down and adds the heavy tiers (property / mutation / contract / chaos / E2E). Consistent with the #2 à-la-carte spectrum (pick a level = everything at/below it). **[Packaging superseded by GA-9; "cumulative" survives only *within* a capability's grade ladder.]** |
| **GA-4c** | **Testing run-scope = per-service mode (user, 2026-07-24):** diff-scoped during development (fast loop), whole-repo at the CI gate (thorough). Already encoded in the service taxonomies (mutation git-diff-scoped sampling / no-new-survivors-in-diff gate vs whole-repo score); matches the user's fail-fast `pr-context.sh` pattern. The remaining GA-4 residual is now `reports/` contents only. |
| **GA-4d** | **`reports/` = failure-centric, complete on what matters (user, 2026-07-24 — option b + caveat).** Default is not a full pass-dump; centers on what broke + why, with full fix-context per failure, and keeps important non-failure signals (esp. vacuous / "nothing-to-pin" coverage gaps). Routine passes omitted as noise. Grade dials depth, never whether important info appears. Refines "nothing swallowed" → "nothing *important* swallowed." Format (human/JSON) = Gate-2. |
| **GA-9** | **DELIVERY-MODEL REVAMP — supersedes the fixed tier stack (GA-4a/4b packaging).** Rig ships a **two-axis à-la-carte** install: **(axis 1) which capabilities** (security / behavior-testing / MCP-config / docs / …, user checks boxes) × **(axis 2) grade** per capability (minimal/mid/maximal = ordered determinism dial; each capability defines its own three grades). Driven by a **repo-scan recommendation lens** that recommends `(capability, grade)` pairs; user overrides freely. Capability *content* (B, C/D) unchanged; only packaging changes. B1 (GA-2) holds. |
| GA-9a | **Cross-capability dependency = auto-pull, razor-scoped, after selection.** Each capability carries a dependency list. Lock the user's grade choices first → then resolve missing deps → **auto-pull** (never warn-and-stop, never downgrade the dependent, never burden the user), **scoped narrowly to the dependent's need** (e.g. maximal-security needing MCP → *security-purpose* MCP coverage, not the user's general MCP grade, not random MCPs). Effective install = chosen grade + purpose-scoped dependency satellites. |
| GA-9b | **Scan lens = codebase profile → catalogue match for maximal-fit retrofit.** Profile: purpose/type (product vs integration vs …) · outbound calls · data manipulation (+ business context where needed) · existing agent infra (MCPs/`AGENTS.md`/skills/rules). **Host-first flow:** explain pipeline → user picks host + hands access → then scope (host-brain, B1). **Core value:** automate the per-codebase/per-host *transition* the user does by hand today; graft onto the existing framework (never overwrite) — the graft sidenote is therefore central. |
| GA-9c | **Security-bootstrap = sanitation FIRST (distrust before profile).** host → **B-sanitise** the existing agent framework (floor-first per GA-3, verdict per GA-3c) → surface findings with max context → user remediates via host **or opts in** to Rig-assisted remediation through the host (consent-gated write) → *only then* profile the good harness + codebase. Scope = harness, not whole codebase. |
| GA-9d | **Lifecycle = installed always-on drift-prevention rule (stateless; NOT the Tier-3 memory store).** After every change, update global context so tool contexts don't drift; prefer **inline references → central sources of truth** (DRY for context); on unavoidable duplication, annotate **"keep in sync with the repo."** State lives in the repo's own docs (repo = the memory) — realises "grows with the repo" without a persistent cross-session store. |
| GA-9e | **Drift enforcement = layered.** Deterministic **exact-duplicate one-to-one sync check** (`check-rule-copies.js`-style, fails commit/CI) for identical multi-agent copies **+** agent **semantic drift guard** (catches stale/deprecated-vs-current context the copy-check can't see). Both combined; same floor+judgment shape as GA-3. |
| GA-7 | **Enforcement tiering across all hosts.** (1) git/CI deterministic floors = host-agnostic (any repo w/ git); (2) live in-session tool-boundary enforcement = hook-capable hosts only, advisory prose elsewhere; (3) semantic layers = as good as the host's brain. **Context-sync runs on BOTH layers** (dev-time host always-on rule — indispensable, triggered by agent judgment on very-long-conversation / new-insights — **and** the git/CI floor). **Policy "never too safe":** a cheap deterministic guard runs *everywhere it can*, not one-place-by-cost. |
| GA-9f | **Install taxonomy = FAMILY → SERVICE → GRADE** (refines GA-9's two axes to three). Families (Security / Infrastructure / Development-Testing / Context / …) group **services** (contract, property, mutation, chaos, E2E, static-scan, sanitation, drift-sync — each a separate service); **grade = per-service thoroughness** (minimal/mid/maximal), not per-family. Scan marks applicable/not-recommended but the **user may install non-recommended services** (configurability > paternalism). B/C-D "capabilities" = families. The **determinism ladder = inter-service dependencies (GA-9a)**; grade is orthogonal. **Resolves GA-4 no-surface/override:** upward override allowed (not clamped); a surfaceless installed service runs vacuously + logs "nothing to pin" in `reports/` (C's nothing-swallowed). **(Security point superseded by GA-9i: capability B = baseline agent-tech safety, NOT an à-la-carte family; the selectable "Security" family is product/application security.)** |
| **GA-9g** | **TIER NAMING FULLY DEPRECATED — the à-la-carte catalogue is the product (confirms GA-9 option b).** There is **no installable "Basic / mid / Advanced" tier**; every repo onboards into the single catalogue (families → services → per-service grades). **"Advanced" retires completely** — not even a named starter preset; the only per-repo "preset" is the **dynamic scan recommendation** (GA-9b), a computed set of `(service, grade)` pairs, never a fixed bundle. Shipped/locked **Basic's MCP configurator is re-cast as the MCP-config service** (Infrastructure family) — its *content* is preserved; only its packaging identity dissolves. **Follow-up DONE 2026-07-24:** archived under `project-dev-docs/archive/deprecated-tier-taxonomy/`; README + agent project-context vocabulary refactored. |
| **GA-9h** | **OFFERING SHAPE = MANDATORY SECURITY BASELINE + À-LA-CARTE CAPABILITY LAYER.** The user's "à-la-carte / entirely configurable" means **which capabilities you add** — the old model shipped a **fixed capability set**; the revamp makes *what you add* fully user-chosen. It does **NOT** make the security floor optional. **Always-on, non-declinable (security needs):** (1) **sanitation** of the existing harness (GA-9c) and (2) the **always-on drift-prevention rule + git/CI sync floor** (GA-9d/9e). Rationale (user): the à-la-carte layer only operates **inside a safe environment** — "when the safe environment is not there, everything goes downhill from that." So the offering = a non-declinable baseline (sanitation gate + always-on drift prevention) **+** the à-la-carte catalogue on top; only the *catalogue* layer is user-selectable. |
| **GA-9i** | **TWO DISTINCT "SECURITIES" — the line of distinction (refines GA-9f/9h).** **(1) Agent-tech safety = BASELINE, always-on, strictest, non-selectable** — capability **B** (harness **sanitation** + vetting) **+ always-on drift-prevention + git/CI floor**; "a security consideration *for the agent*." Purpose: keep the **agent operating environment** safe so **conflicting agents don't clobber each other's work and destroy the project**, and to contain the real hazard of users running **local models**, **"accept-all edits" / bypass-permissions ("dangerous mode")**, and **auto-runner** setups. Enforced at the strictest measure **regardless of what the user selects**. **(2) Product / application security = À-LA-CARTE** — a *development* concern the user dials: "what security does your **codebase** need?" — encrypted files vs a toy project where hardcoding values is fine; **how deep the security checks must be**; at the maximal grade, **security testing = red-green + cyber-attack / penetration simulation**. **Consequence:** the à-la-carte catalogue is about **development concerns**, not agent-tech safety; GA-9f's "Security family = B" is **corrected** — B is baseline; the selectable **Security family = product security**. |
| **GA-9j** | **DEVELOPMENT AND TESTING ARE DISTINCT À-LA-CARTE FAMILIES** (user, 2026-07-23) — *not* one merged "Development/Testing" family. The **v1 à-la-carte family set** is therefore **Development · Testing · Infrastructure · Product-Security**, layered over the agent-tech-safety baseline (GA-9i). **Testing** family's spine = the determinism ladder (unit → property → mutation → contract → chaos → E2E, GA-4b/9f) + TDD discipline. **Development** family's own constituent services are **not yet defined** (grilled next). |
| **GA-9k** | **DEVELOPMENT FAMILY CONTENTS + TAXONOMY GRAIN.** User-supplied 10 service-groups for Development (code creation & modification · code quality gates · debugging & diagnosis · dependency management · documentation · architecture & design · data & schema · performance · repo/project hygiene — Testing being the separate family per GA-9j). Cross-family boundaries reaffirmed: security/vuln/license scanning → Product-Security; infra observability / runtime-scaling → Infrastructure. **Grain RESOLVED (option c, 2026-07-24): a formal GROUP tier** — the 10 categories = **groups**, each bullet = an individually selectable **service**, so the taxonomy is now **family → group → service → grade** (4 levels; refines GA-9f's 3). Group = formal taxonomy tier (its bulk-selectability = Gate-2 mechanism, with GA-6); **grade stays per-service** (leaf). **Uniformity RESOLVED (GA-9k(a), 2026-07-24): UNIFORM** — the user supplied Testing (GA-9l) and Infrastructure (GA-9m) in the same group→service shape, so every family is `family → group → service → grade`. **All resolved:** uniformity (GA-9k(a)); depth held at 4 levels (GA-9k(c)); mutation restored + ladder reconciled (GA-9l/9m); Product-Security = 4th family (GA-9n); **v1 scope = whole catalogue** (GA-9k(b), 2026-07-24 — "just tokens", per the GA-4 convention-not-engine model). Remaining Gate-1 work: acceptance authoring (GA-8) + GA-4 run-scope/`reports/` residual. |
| **GA-9l** | **TESTING FAMILY CONTENTS (uniform group tier).** User's 10 groups → services: unit · integration (incl. internal-contract) · e2e · test-strategy & planning · regression · property-based & fuzz · test-data management · flaky & reliability · performance & load (dev-facing) · test maintenance & refactoring. **Ladder reconciliation RESOLVED:** unit/property/contract/e2e = Testing; **chaos = Infrastructure g7 (GA-9m)**; **mutation RESTORED as an 11th Testing group** (option (a), 2026-07-24) with a 10-tool internal taxonomy (`../../current/reference/mutation-testing-taxonomy.raw.md`) — tools = services, sub-capabilities = grade (GA-9k(c)). GA-9a edge: mutation pulls unit/property. |
| **GA-9n** | **PRODUCT-SECURITY FAMILY CONTENTS — the 4th & final family (set complete).** À-la-carte product/application security (GA-9i), distinct from the always-on agent-tech-safety baseline. 4 groups → services (`../../current/reference/product-security-taxonomy.raw.md`): (1) secrets & credential handling; (2) static & dependency vulnerability scanning (SAST/SCA/IaC + scan-depth dial); (3) license compliance (SBOM/policy/attribution); (4) active red-team / penetration simulation (DAST + red/green adversarial — the maximal grade = the "red-green + cyber-attack" the user named). Tools = groups, sub-capabilities = services, internal dials = grade (GA-9k(c)). |
| **GA-9m** | **INFRASTRUCTURE FAMILY CONTENTS (uniform group tier).** User's 10 groups → services: provisioning & IaC · CI/CD pipeline architecture · container & orchestration · networking · observability · storage & data infra · scaling & reliability (incl. **chaos engineering / resilience testing** + infra-level load) · cost management · environment & config management (config/secrets *injection wiring* — mechanics only) · disaster recovery & continuity. **Boundaries (user):** app-level log/trace → Development; secret *content*/depth → Product-Security. **Perf/load deduped for MECE** (2026-07-24): Testing owns perf-test-authoring, Dev = profiling, Infra = capacity. |

## Future scope (non-Gate-1 — README backlog, do NOT build during this pipeline)

Forward-looking notes recorded per user (2026-07-23) for a later README "future scope" section.
**Not Gate-1 intent; not to be implemented during grilling / design / execution.** General
direction only, unscoped:

- **Visual capability-management dashboard / UI** — let the user **visually manage the context of
  each installed capability** (view and adjust each service's context/grade through a UI rather than
  files/config alone). *"A dashboard where the user can manage it visually … the context of each
  available capability."*
- ~~**Tier-vocabulary refactor / archive** (GA-9g)~~ — **DONE 2026-07-24** under
  `project-dev-docs/archive/deprecated-tier-taxonomy/`.

## Acceptance criteria (Gate 1)

**Approach → property/archetype-level (GA-8(a), user 2026-07-24).** The user defined "correct" as a
set of **system-wide properties every service must satisfy**, not 100+ bespoke behaviors — so Gate-1
acceptance proves the shared service *shape* once and enumerates the catalogue as instances, with
bespoke checks only for the genuinely-different (deterministic script/hook) services. Direct
consequence of *"once the specs are nailed it's just instances."*

**"What correct looks like" (user, 2026-07-24) — the acceptance properties:**

1. **No blowout / light-touch integration.** Rig integrates into an existing repo without bloating or
   taking it over — minimal footprint (ties to graft-not-replace, GA-9b: graft onto the repo's
   existing `AGENTS.md`/framework, never overwrite; automate the transition).
2. **Safe & secure by construction.** Integration happens the safe/secure way — the always-on
   agent-tech-safety baseline (sanitation-first + drift) is in place *before* any à-la-carte layer
   (GA-9c/9h/9i).
3. **Mutually exclusive services (MECE) — NEW.** No two services overlap; each owns a distinct slice.
   **Where two services *can* be combined, they are combined.** The mutation and product-security
   taxonomies were already authored as MECE partitions; this extends the property **across the whole
   catalogue.** *(Reconciliation of the remaining cross-family overlaps in progress — see below.)*
4. **Host coverage wherever possible.** Services cover all available agent hosts wherever they can,
   degrading per GA-7 (git/CI floors host-agnostic · live enforcement on hook-capable hosts ·
   advisory prose elsewhere · semantic layers ride the host brain).
5. **Highly configurable.** The à-la-carte dial holds end-to-end (family → group → service → grade;
   scan recommends, user overrides freely incl. non-recommended services — GA-6/9f).

**Authored:** the concrete observable acceptance cases per property are written below (see
**Acceptance tests (Gate 1 — authored 2026-07-24)**). All blocking intent is frozen (catalogue · MECE
· GA-4 run-scope + `reports/`); Gate 1 is ready to freeze on user sign-off.

### MECE reconciliation (GA-8 — complete)

The user's own cross-family boundary notes already de-conflict most potential overlaps (security
scanning → Product-Security not Development; app-level log/trace → Development not Infra; vuln/license
→ Product-Security not Dev dependency-mgmt; static-analysis-for-correctness ≠ SAST-for-security).
**Genuine remaining overlaps to reconcile (merge vs keep-separate-by-boundary):**

- **Performance / load → RESOLVED (user, 2026-07-24): perf/load *test-authoring* merged into
  Testing g9.** Development g9 keeps **profiling only**; Infrastructure g7 keeps **capacity load**;
  Testing g9 is the **sole home** for writing perf/load tests. Three distinct, non-overlapping
  performance concerns.
- **Secret injection → RESOLVED (user, 2026-07-24): Infrastructure owns injection (option a).**
  Product-Security's runtime-secret-injection (1d) **folds into Infrastructure g9** (injection is
  plumbing); Product-Security g1 keeps the security-*of*-the-secret services: encrypted-at-rest
  store (1a), toy-project relaxation (1b), pre-commit leak scanner (1c), rotation reminder (1e).
  Matches the user's own Infra boundary note (*"injection wiring — mechanics, not secret content"*).

**MECE reconciliation COMPLETE** (2026-07-24): both genuine cross-family overlaps resolved
(perf/load-test-authoring → Testing; secret-injection → Infrastructure). The catalogue is now
mutually exclusive.

### `reports/` contents (GA-4d, 2026-07-24)

**Failure-centric, but complete on what matters** (user: option b + caveat *"do not leave out anything
which may be important while fixing it"*). The default `reports/` output is **not** a full
pass-by-pass dump — it centers on **what broke and why**. But nothing *important* is swallowed: each
failure entry carries the **full context needed to fix it** (root cause · location · which test should
have caught it), and important **non-failure signals are kept** — notably **vacuous / "nothing-to-pin"
runs**, because a coverage gap is itself important to see. Routine passes are summarized/omitted as
noise. **Grade dials verbosity/depth, never whether important information appears.** This refines the
earlier *"nothing swallowed, maximum visibility"* to **"nothing *important* swallowed"** — signal over
noise. (Human vs machine-readable/JSON format = Gate-2 mechanism; may reuse the security §10
verdict-schema pattern.)

With GA-4c (run-scope) + GA-4d (`reports/`) closed, **all blocking Gate-1 intent is frozen** — the
acceptance tests below are authored against it.

### Acceptance tests (Gate 1)

**Transferred to the frozen artifact —
[`../../current/acceptance.md`](../../current/acceptance.md).** The original
cases were re-grilled and expanded by GA-10. The canonical acceptance file is
the single source; this section is retained only as historical rationale.

## GA-10 — Re-grill after implementation audit (2026-07-25)

The user, acting as product/acceptance authority, ruled:

| ID | Product ruling |
|---|---|
| GA-10a | `technical-spec.md` is the sole Gate-2 implementation authority. The SOW, task list, coverage plans, and later rulings cannot supersede it. A specification authority/traceability check and fresh-context semantic review run before code correctness can count. |
| GA-10b | All 115 catalogue leaves are production commitments. TODOs, generic filler, or merely non-empty fragments fail completion; every leaf needs service-specific boundaries, grade behavior, checks, and acceptance evidence. |
| GA-10c | Every selected service has one honest outcome: real executable behavior, verified convention-only behavior, or an explicit surfaceless result. Missing, malformed, silent, and fake-green/no-op behavior is a coverage failure. |
| GA-10d | First enabling the leak-scanner performs a real history scan before activation. Findings or scanner failure block activation until remediation/re-scan or an exact scoped waiver. |
| GA-10e | Approved remediation performs exactly the approved current write set, rejects stale/no-op work, rolls back partial failure, and re-runs sanitation before success. |
| GA-10f | A host/CI axis is verified only from a complete per-axis contract, official evidence, and first-wire proof for executable behavior. The complete advertised roster is an initial-release gate; speculative configuration is forbidden. |
| GA-10g | Existing verified CI is integrated additively and idempotently. With no CI, the user selects and approves a verified provider and Rig creates a minimal native pipeline. Unknown/unverified CI is preserved and fails visibly; first-run success is part of verification. |
| GA-10h | Network access is default-deny under one user-owned structured policy covering shell, built-in web, and network-capable MCP calls; an approved MCP route is preferred. A guide and installed agent rule make the policy discoverable. |
| GA-10i | The user may permanently allow any action category or disable enforcement globally. Policy edits are inert until the exact revision is user-approved; an agent cannot self-authorize. Disabled controls truly stop blocking, Rig remains usable, and no disabled/unrun protection is reported as scanned, passed, protected, or verified. |
| GA-10j | Exact one-use approval remains available for an unchanged denied action. Re-enabling a control restores enforcement and requires fresh evidence rather than reusing stale success. |
| GA-10k | Product, design, implementation, review, and acceptance are workflow contexts, not staffing requirements. A solo maintainer may orchestrate separate agents and humans may intervene anywhere; the implementing context cannot edit Gate 1 or approve itself. Named-person staffing, post-launch cadence, and commercial operations are not product prerequisites. |

These rulings supersede earlier text only where they conflict. The four-family
taxonomy, B1 runtime boundary, MECE decisions, razor-scoped dependency rule,
graft/no-clobber outcome, and failure-centric reporting remain unchanged.

## GA-11 — Gate 1 integrity mechanism (2026-07-26)

Recorded after the D1-D9 revision of the same date, during Gate 2 design. The
intent owner ruled:

| ID | Product ruling |
|---|---|
| GA-11a | The D5 mechanism protecting Gate 1 — comparison against committed upstream state, a separately reviewed commit, branch protection and code ownership — is withdrawn. It charges every Gate 1 edit to the repository's commit history, and organisations that audit commit traces should not be reading a stream of commits that only maintain agent documentation. |
| GA-11b | The replacement must not run through git. The gate recomputes the SHA-256 digest of both Gate 1 files and verifies a signature over that digest which only a physically present human can produce. An agent holding the whole repository can edit the files, the digest and the signature, and still cannot make the gate pass. |
| GA-11c | Hardware-attested user presence is the floor for this use specifically. Gate 1 integrity does not inherit any weaker signer the product permits elsewhere, because a signer the agent can operate unattended defeats the control entirely. |
| GA-11d | This is recorded as a strengthening, not a relaxation: branch protection is bypassable by anyone with push rights, whereas the signature is not forgeable by an agent. Two residual risks are accepted and recorded in the business spec §9 — a lost or never-obtained key leaves Gate 1 unprotected and must be described as such rather than dressed up as protection, and a signature defends against a silent edit but not against an intent owner who has been persuaded to sign. |

`AT-GATE-2` changes mechanism only. The frozen ID set remains 45 and no case is
added, removed, or given a different verdict.

Rejected on the way to this ruling, and why:

- **Comparing the working tree against the locally committed state.** Stops an
  agent from editing Gate 1 but not from committing that edit, and agents commit
  routinely. It would have passed while failing at its only job.
- **Read-only file permissions or platform immutability flags.** Reversible by
  the same agent that would make the edit.
- **Root-owned Gate 1 files.** Genuinely stops an unprivileged agent, but breaks
  checkout and the intent owner's own editing, and does not survive a clone.
- **A digest pinned in Gate 2, unsigned.** Forces a visible multi-file edit, so
  it is an audit trail and a deterrent — but it is not a barrier, and the
  product does not describe deterrents as protection.

## GA-12 — The lifecycle re-grill (2026-07-28)

Recorded after a sweep of the frozen Gate 1 for unstated behavior rather than
for wrong behavior. The finding that motivated it: the intent described how Rig
arrives in a repository in great detail and said almost nothing about how it
leaves, how it fails, or what it does with what it finds. `AT-HOME-2` already
obliged Rig to remove its own entries from a user-global file and report what it
removed, while nothing said what removal does to the repository Rig actually
modified — including the CI job Rig inserts into the user's pipeline.

Eight rulings, taken one at a time with the intent owner:

| ID | Product ruling |
|---|---|
| GA-12a (D11) | Repo-side uninstall is v1 scope. Every write to a file Rig does not exclusively own is delimited by managed-block markers and recorded in an install manifest as it happens; uninstall walks that manifest in reverse and removes exactly Rig's content. Rig also keeps a pre-modification copy of each touched file, used **as evidence and never as a restore**: the copy is diffed against the result so removal can be reported *verified clean* or *best-effort with the file named*, mirroring the install claim split. Restoring the copy was rejected — it would silently destroy every edit the user made after installing. |
| GA-12b (D11) | Usage artifacts are not installation state. Reports and run history survive uninstall by default; purging them is an explicit user request that names what it will delete. |
| GA-12c (D12) | Delegated policy-edit mode is scoped to the session it was given in and is never persisted. Revocation is ending the session; it needs no approval ceremony, because a control that can only be tightened where the approval surface is reachable cannot be tightened on the hosts that most need it. Because no grant can exist on disk, an agent in a later session asserting delegation is unverifiable by construction and is refused. `AT-BASE-4`'s "recorded delegated-edit receipt" is withdrawn — nothing is recorded. |
| GA-12d (D13) | There is no user-editable invariant tier. The prohibition on agent self-activation is a Rig product rule shipped with the baseline, not a clause in the user's policy. The user may disable enforcement wholesale and be told they are unprotected; what cannot exist is a configuration permitting self-activation alongside a claim of protection. |
| GA-12e (D14) | An interrupted install leaves its applied work in place, marked incomplete, and resumes from the manifest on re-run; uninstall backs it out through the same teardown path. No partially applied control may report as enabled or protecting. |
| GA-12f (D15) | Findings stay on the machine that produced them: reports are excluded from version control and never uploaded as build artifacts, and CI emits a verdict with counts and rule identities without printing detail to the log. |
| GA-12g (D16) | Matched secret content does not reach the model by default. Detection is deterministic; the agent reads counts, rule identities, and locations. Model-assisted triage is an explicit opt-in disclosed where it is enabled. |
| GA-12h (D17) | The specification gate is armed by the presence of the signer identity. On an armed repository a missing signature is a failure, not a downgrade. An unarmed repository runs and reports Gate 1 unprotected. |
| GA-12i (D18) | Version migration is out of scope and recorded as a deliberate exclusion. Rig ships as a source archive plus install stub, not through a package manager, so there is no upgrade channel; taking a newer Rig is a reinstall, which is already required to be idempotent. |

The ID set moves from 45 to **52**. `D18` adds no case.

Rejected on the way to these rulings, and why:

- **Snapshot-restore as the uninstall mechanism.** The intent owner first
  proposed returning to the pre-install state — the last commit, or a snapshot
  of the harness as it was. It guarantees a byte-exact return and silently
  discards every edit the user made to those files since installing. On a file
  like `AGENTS.md`, which a user edits continuously, that is data loss dressed as
  cleanliness. The snapshot survives as evidence for the clean/best-effort claim,
  which is the part of the idea that was load-bearing.
- **Transactional install with automatic rollback.** Rejected as a second
  implementation of a teardown path the product already commits to building, and
  because the classic failure of transactional installers is a failed rollback
  leaving worse debris than the original failure.
- **Invariant clauses held in a separate file or repository.** Proposed from
  general access-control practice, where it assumes IAM: service accounts,
  branch protection, absent merge rights. Rig's agent has full shell access, so a
  second file is reached exactly as easily as the first. This is the same
  reasoning that withdrew D5, and it was applied again rather than re-litigated.
- **Expiring or use-counted delegation grants.** A clock defends against a threat
  that exact-revision activation approval already contains, and it would make Rig
  store new state whose staleness it would then have to keep honest. The intent
  owner went further than the recommendation and removed persistence entirely.
- **Model-assisted secret triage as the default, with redaction as the guard.**
  Rejected because it makes the redaction step load-bearing and one bug in it
  ships a live credential to a third party. This is recorded as a deliberate
  inversion of the product's usual "configurability over paternalism" rule, on
  the ground that it is the only failure in the product that cannot be undone by
  re-running something.
- **Treating a missing Gate 1 signature as unprotected-but-passing.** This was
  the behavior implied by the existing §9 language and it made D10 opt-out: any
  context wanting to edit Gate 1 could delete the signature first. Found during
  this sweep and fixed by GA-12h rather than carried into freeze.

## GA-13 — D8 review separation correction (2026-08-19)

The intent owner ruled that the independent semantic-review requirement is a
fresh reviewer session, report-only operation, and a receipt pinned to the
reviewed bytes. A different-model requirement is withdrawn: the authoring
model was only self-declared, so comparing it with the review wrapper's model
label could not establish actual model separation.

`AT-GATE-3` keeps its semantic-coverage and contradiction verdicts. The ID set
remains 48; this changes only the separation mechanism. Model identity is not a
release condition or receipt field.

## GA-14 — Policy-signer recovery (2026-08-19)

A Gate 2 review of `technical-spec.md` (round 2) flagged that the design had
built a full recovery ceremony for the policy-activation signer — a
`trust.json` bootstrap/rotation record plus a bootstrap step invalidating
pending edits, one-use approvals, and evidence epochs — with no Gate 1
requirement behind it, and noted a recovery/reset path is exactly the kind of
mechanism the D5→D10→D17→D19 sequence spent four revisions keeping out of an
agent's reach. The intent owner chose to grill and add the requirement rather
than strip the capability from Gate 2.

| ID | Product ruling |
|---|---|
| GA-14a | Recovering a lost or compromised policy signer must clear the same live-human-act floor Gate 1 already sets for its own protection (D10/D19) — a credential class no agent on the user's machine could operate unattended. An ordinary host-native confirmation popup was considered and rejected: it proves only that a UI event fired, not that an agent couldn't have triggered or synthesised it. |
| GA-14b | The recovery credential must be cryptographically distinct from the everyday signing key and live in a genuinely separate failure domain — not merely a different key file beside the first, but kept outside any storage the repository, Rig's working state, or the agent can reach on its own. A pair of keys an attacker who compromises one location gets both of does not satisfy this. |
| GA-14c | A credential counts as a recovery credential only if it was registered while an already-valid credential was in force. Without this, an agent facing a "lost key" situation could simply designate a fresh key as the recovery credential itself, which defeats the control entirely. |
| GA-14d | Rig offers to generate a set of recovery credentials the first time the everyday signer is set up, and offers to add more every subsequent time signer setup runs while a valid credential still exists. This is the chosen mitigation against lockout — a pool established upfront and topped up over time — rather than a "reinitialise from scratch" escape hatch considered and rejected below. |
| GA-14e | If the everyday signer and every registered recovery credential are ever all lost together, recovery is refused permanently for that policy trust state. No forced override, no undocumented reset command, and no new fallback may be invented to route around the exhausted list — otherwise that fallback quietly becomes the real root of trust. |
| GA-14f | Recovery's consequences — invalidating pending policy edits, burning one-use approvals, resetting evidence-epoch tracking — are effects of an authorised recovery, never its trigger. An agent may request a recovery ceremony; it cannot complete one, and it cannot cause those consequences by merely asserting recovery is needed. Every recovery is disclosed via a receipt, never applied silently. |
| GA-14g | This is a separate trust domain from the Gate 1 integrity signer (D10/D19). That signer keeps no recovery path at all, and D20 does not add one to it — the two are documented independently so the design stays auditable. |

Rejected on the way to this ruling, and why:

- **Reinitialisation as an implicit recovery fallback.** Treating "start over
  with a fresh trust root" as part of recovery would make deleting state, or a
  `--force` flag, the real recovery authority — anything that can trigger the
  fallback bypasses every credential check above it. If Rig ever supports
  starting over after a genuine lockout, that has to be a distinct,
  separately named concept with no cryptographic claim of continuing the old
  trust state, and it is out of scope here rather than smuggled in as
  recovery.
- **An unlimited or self-extending recovery chain.** A recovery-for-the-
  recovery-mechanism pattern (lose the recovery credential, fall back to a
  weaker mechanism, lose that too, fall back again) was rejected because the
  system is only as strong as its weakest fallback; GA-14e fixes the bottom of
  that chain at "refuse."
- **The everyday signing key doubling as its own recovery credential.**
  Rejected as circular: if recovery used the same key class as ordinary
  activation, losing that key would strand recovery too, which is the exact
  failure recovery exists to solve.

The ID set moves from 48 to **49** (`AT-PRESENCE-2`). Exact recovery-credential
mechanism, generation flow, storage prompt, and count/threshold remain a Gate
2 decision.
