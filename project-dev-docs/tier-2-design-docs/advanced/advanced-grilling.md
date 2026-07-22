# Tier 2 Advanced — Grilling (Gate 1, IN PROGRESS)

Live Gate-1 record for **Tier 2 Advanced**. Started 2026-07-21 from the grilling
session that follows shipped Tier 2 Basic.

- Product source of truth: `../../foundational-design/rig-foundational-design.md`
- Parent (still "in progress" for Advanced): `../tier-2-design.md` §2 / §5 / §6
- Foundational decisions log: `../../foundational-design/grill-decisions.md` (G4, G11, **G11a**)
- Shipped sibling (locked): `basic/basic-design.md`

**Status:** **RE-TIERED into 3 Tier-2 sub-levels (GA-4a, corrected 2026-07-21).** Tier 2 **Basic**
stays **as-is** (shipped MCP configurator — *not* reopened). A **new mid-tier** (name TBD,
working label "Basic-expanded") = **security (B)** + **minimal/unit tests**. Tier 2 **Advanced** =
the **rigorous behavior-testing pipeline** (red-green + property + mutation + contract + chaos +
E2E + `reports/`). Supersedes GA-1's "Advanced = B + C + D". Brain fork **B1** (GA-2) holds across
all sub-levels. Acceptance tests not yet authored.

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

From G11 (`grill-decisions.md`) and `tier-2-design.md` §2/§5:

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
at `references/agent-harness-security-playbook.raw.md` (raw paste; the playbook body appears
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
preserved at `references/testing-pipeline-vision.raw.md` (mapped to the user's Ruby/Rails
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

**GA-7 / context-sync refinement → RESOLVED (user, 2026-07-21): for context-sync the PRIMARY path is
the host always-on rule (dev-time), CI is only a share-time backstop.** The general GA-7 tiering
holds (git/CI deterministic floor is host-agnostic; live in-session enforcement is host-tiered), but
context-drift is **a development-time problem, not a CI problem** — drift accumulates *while you
work*, and **during development you cannot count on git/CI** (it only bites when you share / push).
So for context-sync:

- **Primary = the host's always-on rule** (agent-run, live during development) — *the layer we must
  count on*, because it is the one actually running as work happens.
- **Trigger (agent judgment):** run the sync/update-context script when **the conversation has grown
  extremely long** and refreshing the overall context would help, or when **new product insights
  have been found** that should be captured.
- **Secondary = CI**, where the sync check can **piggyback on the repo's existing testing
  infrastructure** (run on top of it) — a backstop at share/push time, not the main guard.

*(Note the asymmetry vs security: security's static scan leans on the git/CI floor as primary;
context-sync leans on the dev-time agent rule as primary. Same two layers, opposite weighting,
because the two problems surface at different moments in the loop.)*

## Open decision queue (ordered; one at a time)

Grilling each B/C/D capability into concrete, testable intent — one question at a time.

| ID | Decision | Depends on | State |
|---|---|---|---|
| ~~GA-3~~ | **Capability B — RESOLVED (Gate-1 intent):** layered vetter · threat=all(a/b/c) · scope=static+hook-enforcement · trigger + hit-response (SC6-mirrored default). Detail in "Capability B grilling detail". | GA-1/2 | **resolved** |
| **GA-4** | **Behavior-testing capability (C/D).** Resolved: general convention + language-agnostic fill-in template; determinism-ladder rungs cumulative *within the capability*. **Packaging (GA-4a/b 3-tier stack) superseded by GA-9's à-la-carte model.** Still grilling **pipeline content**: no-surface rungs, per-change vs whole-repo, what Rig ships, `reports/`. | GA-1/2 | **OPEN — grilling** |
| **GA-9** | **Delivery-model revamp:** dissolve the fixed tier stack → **à-la-carte capability × grade** matrix + repo-scan recommendation lens. Adopted; grade semantics + GA-9a dependency resolution (auto-pull, razor-scoped) resolved. **Open: GA-9b the scan lens itself (current question).** Parked sidenote: graft onto existing `AGENTS.md`, never overwrite. | GA-1/2/4 | **OPEN — grilling** |
| **GA-9b** | **The repo-scan recommendation lens** — RESOLVED: profile (purpose/type · outbound calls · data manipulation · existing agent infra) → match to Rig's catalogue for maximal-fit retrofit; **host-first flow**; core value = automate the per-codebase "transition." | GA-9 | **resolved** |
| **GA-9c** | **Security-bootstrap ordering** — RESOLVED: **sanitation first** (host → B-vet existing harness → surface w/ max context → user or opt-in Rig remediation → *then* profile). Distrust before profile. | GA-9b, GA-3 | **resolved** |
| **GA-9d** | **Lifecycle** — RESOLVED: an installed **always-on drift-prevention rule** (update global context after every change; inline refs → central sources of truth; sync-note on unavoidable duplication). Repo = the memory; stateless; no Tier-3 store reopened. | GA-9 | **resolved** |
| **GA-9e** | **Drift-rule enforcement** — RESOLVED: layered — deterministic exact-copy sync check (`check-rule-copies.js`-style) + agent semantic drift guard (stale/deprecated-context detection). Both combined. | GA-9d, GA-3 | **resolved** |
| ~~GA-5~~ | **Folded into GA-4** — D (spec→test→code) fused with C into "behavior-testing rigor" (user, 2026-07-21). Its distinct sub-question (what this adds beyond shipped `rig-tdd`/`rig-grilling` + the #13 gate) is grilled within GA-4. | — | folded |
| GA-6 | **"Highly customizable":** which axes are customizable, by whom, via what (manifest? per-repo config?). | GA-3/4/5 | queued |
| **GA-7** | **"All hosts" enforcement tiering — RESOLVED (user).** Confirmed 3-way: (1) git/CI deterministic floors run on **any repo with git** (host-agnostic); (2) live in-session tool-boundary enforcement only on **hook-capable hosts**, advisory prose elsewhere; (3) semantic layers ride the host's brain. **Refinement:** for **context-sync** the weighting flips — **primary = the dev-time host always-on rule** (drift is a development problem; git/CI can't be counted on mid-dev), **secondary = CI** (piggyback existing test infra) at share time. Trigger = agent judgment (very long conversation / new product insights). | GA-3/4/9 | **resolved** |
| GA-8 | **Advanced multi-host test strategy** + Gate-1 acceptance authoring. | GA-3…7 | queued |

## Decisions log (locked)

| ID | Resolution |
|---|---|
| GA-1 | **Tier 2 Advanced = B + C + D**, host-agnostic, + per-host install docs. Identity reset away from the inherited memory-store framing. Cap A (local-model / LangGraph runtime) + memory store → **Tier 3**. **[Revised by GA-4a: B + minimal testing → new mid-tier (Basic untouched); Advanced = rigorous testing only.]** |
| GA-2 | **Brain fork → B1 (config / host-brain)**, by entailment of A→Tier 3: no Rig runtime, no model key in Tier 2; **#11 survives**. B2 relocates to Tier 3. |
| GA-3 | **Capability B vetter = LAYERED** — deterministic pattern floor (always runs, host-agnostic) + host-agent judgment review on top, mirroring Basic's SC6. **Threat model = all of (a) injection, (b) dangerous-action directives, (c) disable-Rig-guardrails.** Detection semantics governed by the user-supplied *Agent Harness Security Playbook* (`references/`). Trigger / hit-response = GA-3c (open). |
| GA-3b | **Tier 2 B scope = (i) static inspection [all hosts] + (ii) hook-based runtime enforcement [hook-capable hosts; advisory prose elsewhere, G6a/SUP].** Precedent: Basic SC6 pre-commit guard + G6a PreToolUse hooks are B1 config, so runtime *enforcement* is Tier-2-capable. **(iii) semantic-brain judgment (goal-drift / tool-chain reasoning) + isolation infra (sandbox / egress / DLP / JIT-creds / immutable telemetry) → Tier 3** (needs a brain / OS infra; GA-2 not reopened). |
| GA-3c | **Trigger** = static at adopt/install + on-demand `rig-security-review` + pre-commit on changed files; hooks = continuous PreToolUse (hook-capable). **Hit-response (reversible default, user deferred):** floor BLOCKs unambiguous; judgment QUARANTINEs uncertain (human review); fail-closed→QUARANTINE on unverifiable; ALLOW / ALLOW_WITH_RESTRICTIONS otherwise; playbook §10 JSON verdict. |
| GA-4a | **RE-TIER into 3 Tier-2 sub-levels (supersedes GA-1 placement).** **Basic** stays as-is (shipped MCP configurator, *not* reopened). **New mid-tier** (name TBD, "Basic-expanded") = **security (B, GA-3)** + **minimal/unit tests**. **Advanced** = the **rigorous behavior-testing pipeline** (red-green + property + mutation + contract + chaos + E2E, `reports/`, configurable) as a **general convention + language-agnostic fill-in template**. GA-2 B1 holds across all. Mid-tier needs its own Gate-1 grilling. *(Earlier same-turn "reopen Basic" framing withdrawn — user chose a separate mid-tier, keeping Basic clean.)* |
| GA-4b | **Tier-2 sub-levels are CUMULATIVE (stacked):** Advanced ⊇ mid-tier ⊇ Basic. Installing Advanced pulls in the mid-tier (security + unit) and Basic (MCP config) beneath it; Advanced does **not** re-ship the unit layer — it assumes the mid-tier laid it down and adds the heavy tiers (property / mutation / contract / chaos / E2E). Consistent with the #2 à-la-carte spectrum (pick a level = everything at/below it). **[Packaging superseded by GA-9; "cumulative" survives only *within* a capability's grade ladder.]** |
| **GA-9** | **DELIVERY-MODEL REVAMP — supersedes the fixed tier stack (GA-4a/4b packaging).** Rig ships a **two-axis à-la-carte** install: **(axis 1) which capabilities** (security / behavior-testing / MCP-config / docs / …, user checks boxes) × **(axis 2) grade** per capability (minimal/mid/maximal = ordered determinism dial; each capability defines its own three grades). Driven by a **repo-scan recommendation lens** that recommends `(capability, grade)` pairs; user overrides freely. Capability *content* (B, C/D) unchanged; only packaging changes. B1 (GA-2) holds. |
| GA-9a | **Cross-capability dependency = auto-pull, razor-scoped, after selection.** Each capability carries a dependency list. Lock the user's grade choices first → then resolve missing deps → **auto-pull** (never warn-and-stop, never downgrade the dependent, never burden the user), **scoped narrowly to the dependent's need** (e.g. maximal-security needing MCP → *security-purpose* MCP coverage, not the user's general MCP grade, not random MCPs). Effective install = chosen grade + purpose-scoped dependency satellites. |
| GA-9b | **Scan lens = codebase profile → catalogue match for maximal-fit retrofit.** Profile: purpose/type (product vs integration vs …) · outbound calls · data manipulation (+ business context where needed) · existing agent infra (MCPs/`AGENTS.md`/skills/rules). **Host-first flow:** explain pipeline → user picks host + hands access → then scope (host-brain, B1). **Core value:** automate the per-codebase/per-host *transition* the user does by hand today; graft onto the existing framework (never overwrite) — the graft sidenote is therefore central. |
| GA-9c | **Security-bootstrap = sanitation FIRST (distrust before profile).** host → **B-sanitise** the existing agent framework (floor-first per GA-3, verdict per GA-3c) → surface findings with max context → user remediates via host **or opts in** to Rig-assisted remediation through the host (consent-gated write) → *only then* profile the good harness + codebase. Scope = harness, not whole codebase. |
| GA-9d | **Lifecycle = installed always-on drift-prevention rule (stateless; NOT the Tier-3 memory store).** After every change, update global context so tool contexts don't drift; prefer **inline references → central sources of truth** (DRY for context); on unavoidable duplication, annotate **"keep in sync with the repo."** State lives in the repo's own docs (repo = the memory) — realises "grows with the repo" without a persistent cross-session store. |
| GA-9e | **Drift enforcement = layered.** Deterministic **exact-duplicate one-to-one sync check** (`check-rule-copies.js`-style, fails commit/CI) for identical multi-agent copies **+** agent **semantic drift guard** (catches stale/deprecated-vs-current context the copy-check can't see). Both combined; same floor+judgment shape as GA-3. |
| GA-7 | **Enforcement tiering across all hosts.** (1) git/CI deterministic floors = host-agnostic (any repo w/ git); (2) live in-session tool-boundary enforcement = hook-capable hosts only, advisory prose elsewhere; (3) semantic layers = as good as the host's brain. **Context-sync weighting flips:** primary = dev-time host always-on rule (triggered by agent judgment — very long conversation / new insights), secondary = CI backstop piggybacking existing test infra. Security weighting is the opposite (git/CI floor primary). |

## Acceptance criteria (Gate 1)

_(authored after B/C/D are grilled; externally observable examples + runnable acceptance tests,
per the grilling contract)_
