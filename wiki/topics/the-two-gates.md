# The gate

*(Formerly "the two gates." The two-gate model was collapsed into one freeze on
2026-08-21 to streamline the development cycle. Filename kept so inbound links
survive.)*

## What it is

There is **one freeze** — the gate. It locks the **oracle**: business intent,
acceptance criteria, and the testing infrastructure that deterministically
checks them, signed with one key before any code exists. The **technical
specification** owns *how*, but it is only **checked for presence** at the gate,
never locked; the code adapts to it, and it adapts to what the code learns, as
long as the frozen tests stay green.
[oracle](../gate1/business-spec.md) · [acceptance](../gate1/acceptance.md) · [technical spec](../gate2/technical-spec.md) · [router](../../rig/tier-1/routing.md)

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
[verbatim](../reasoning/2026-08-21-d24-owner-approval.md). Two concrete steps
remain before implementation: the complete deterministic test infrastructure
must be built and manifested, then the owner must perform the live-human
signature over both Gate 1 files and that manifest. The technical spec is no
longer a blocking second freeze.
[Status](../status.md)
