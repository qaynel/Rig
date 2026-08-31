# The gate

*(Formerly "the two gates." The two-gate model was collapsed into one freeze on
2026-08-21 to streamline the development cycle. Filename kept so inbound links
survive.)*

## What it is

There is **one freeze** — the gate. It locks the **oracle**: acceptance
criteria and the testing infrastructure that deterministically checks them,
signed with one key before any code exists. Business intent is **highly
recommended but optional** (D25); the **technical specification** owns *how* and
is only **checked for presence**, never locked. The code adapts to the spec, and
the spec adapts to what the code learns, as long as the frozen tests stay green.
[oracle](../gate1/business-spec.md) · [acceptance](../gate1/acceptance.md) · [technical spec](../gate2/technical-spec.md) · [router](../../rig/tier-1/routing.md)

### The pipeline into the lock

A task enters either as a **new feature** (get the business specs — the use
cases) or an **identified problem** (bug report → root cause → solution). Then in
both cases: **explore the codebase and existing docs**; write the **technical
spec as genuine open questions only** — the architectural forks that *cannot* be
inferred from the code or the docs, never a restatement of intent, each layer
adding new context; state **acceptance criteria** (the observable "this works",
or for a bug the exact failure never recurring); and derive the **testing
infrastructure from the acceptance criteria** — a near-automatic step lined up
with authoring acceptance, not a separate phase (90–100% of the test strategy
falls out of acceptance directly). **Only then** does the single lock close.
[process doctrine](../reasoning/2026-08-24-process-doctrine-and-one-lock.md)

Requests framed as "spec this out" use that same pipeline rather than a
separate spec skill: grilling establishes Why and Scope, product design performs
code-grounded Technical interrogation, both artifacts receive Draft review,
and the existing Gate is the fifth checkpoint. This preserves one owner per
phase and adds no runtime to Tier 1.

### One lock (D26), and freeze timing (D27)

There is **one lock**: it locks the tests and acceptance together, and the only
way to change a locked expectation is the owner through the hardware key — that
is why the key exists. Nothing is locked until three things are in place **and
sound**: a solution/spec the owner agrees with, refined acceptance criteria, and
tests built on that acceptance. **"Not yet frozen" is the normal default for
in-progress design — it is a state, never a pending "freeze now?" decision.**

## Why it is this way

The gate protects exactly one property: **an agent cannot move its own
goalpost** — it cannot weaken a difficult requirement or write tests that merely
bless its own code. Rig guards the human from the agent, not the human from the
human; the developer owns the code and is their own product manager with a team
of interns. That ownership is why one gate is enough.

The property is enforced by **human signature before code plus oracle
immutability after** — not by independent authorship. An agent may draft the
oracle, because the informed human signature is the safeguard; grilling declares
anything it inferred so that sign-off is never blind. The second freeze on the
technical spec was retired because it guarded nothing this property needs and
cost the velocity the cycle exists to protect.
[one-gate intent](../reasoning/2026-08-21-one-gate-streamlining-intent.md)

## What binds it

`D10`, `D17`, and `D19` protect the signature-over-digest integrity mechanism.
The escape hatch — a wrong locked test is corrected only by the key holder as a
quick re-sign, never a full return to grilling; an agent may propose but never
make the change — is [Option A](../reasoning/2026-08-21-one-gate-escape-hatch-resolved.md).
[Decision index](../index/decisions.md)

## What was rejected

- **Two separate freezes** (the prior Gate 1 → Gate 2 model): retired 2026-08-21;
  the second freeze guarded nothing the goalpost property needs and stalled work
  behind repeated technical-spec review rounds.
- **Independent authorship as the safeguard**: replaced by signature-before-code
  plus immutability, which defeats the same threat without forbidding an agent
  from drafting the oracle.
- **Option B** (a wrong locked test forces a full return to grilling): rebuilds
  the gate friction the collapse removes.
- Branch protection as the trust root and self-declared reviewer identity remain
  rejected — neither establishes integrity outside a repo an agent can modify.
[Rejected approaches](../index/rejected.md)

## Authorities and sources

- The oracle: [business intent](../gate1/business-spec.md) and [acceptance](../gate1/acceptance.md)
- Technical spec (checked, not frozen): [technical specification](../gate2/technical-spec.md)
- Workflow doctrine: [router](../../rig/tier-1/routing.md), [grilling](../../rig/tier-1/skills/grilling/SKILL.md), [product-design](../../rig/tier-1/skills/product-design/SKILL.md)
- The collapse: [intent](../reasoning/2026-08-21-one-gate-streamlining-intent.md), [escape hatch](../reasoning/2026-08-21-one-gate-escape-hatch-resolved.md)

## What is still open

The doctrine and both Gate 1 files now describe one gate. The intent owner
approved D24 and the one-gate amendment on 2026-08-21; the approval is filed
[verbatim](../reasoning/2026-08-21-d24-owner-approval.md). Path B's complete
deterministic testing infrastructure is manifested and its amended 83-case
oracle has received the live-human signature, so the protected implementation
work is now underway. The technical spec remains a non-blocking design record.
[Implementation resumption](../reasoning/2026-09-01-path-b-implementation-resumption.md)
