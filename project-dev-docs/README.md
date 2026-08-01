# Rig project development docs

Two directories, and nothing else:

- **[`current/`](current/)** — the live pipeline. Everything here is being built
  against right now.
- **[`archive/`](archive/)** — superseded material. Kept because active docs
  still cite it, not because it is current.

## What Rig delivers

1. **Default-on, user-controlled baseline:** harness sanitation -> drift
   prevention -> secret floor -> git and CI sync floor. The user may explicitly
   configure or disable controls; disabled/unrun protection is reported
   truthfully.
2. **A-la-carte catalogue** (user-selected): Development, Testing,
   Infrastructure, and Product-Security, organised
   `family -> group -> service -> grade` (minimal / mid / maximal).
3. **Workflow:** host handoff -> inspect -> host review -> recommend ->
   select (`rig.json`) -> plan -> apply -> check. Remediation is separate and
   consent-gated.
4. **Constraints:** config-only (B1). No Rig model key, daemon, or persistent
   semantic memory. Graft onto the existing host harness. The scan recommends;
   the user overrides.

Fixed Basic / mid / Advanced install packages are deprecated (GA-9g). The
catalogue is the product.

## `current/`

| Path | Role |
|---|---|
| [`handoff.md`](current/handoff.md) | **Start here when picking the work up cold.** Current gate status, the locked design decisions, live digests, the remaining freeze blockers, and the traps found the hard way. |
| [`reviews/`](current/reviews/) | Report-only Gate-2 review receipts, each pinned to the exact content digest reviewed. A receipt whose digest is not the current one is void. |
| [`reference/`](current/reference/) | The official source documents implementation is built from: the agent-harness security playbook, the host and CI capability reports, the mutation and product-security taxonomies, and the testing-pipeline vision. Held as captured. |
| [`spec/product-spec.md`](current/spec/product-spec.md) | Product-level design and the shipping plan it sits under. |
| [`spec/business-spec.md`](current/spec/business-spec.md) | Re-grilled business intent: problem, users, complete catalogue, user-controlled safety policy, verified coverage, and correctness properties. |
| [`spec/technical-spec.md`](current/spec/technical-spec.md) | Sole Gate-2 implementation authority — but **reopened** by the 2026-07-28 Gate 1 revision. It is v0.3 written against the superseded 45-case set and must be rewritten against the current 52 before it can be a freeze candidate again. Implementation may not begin against it. |
| [`spec/host-coverage-spec.md`](current/spec/host-coverage-spec.md) | Host and CI coverage dispositions, evidence rules, and the roster acceptance cases. |
| [`acceptance.md`](current/acceptance.md) | Frozen acceptance criteria and tests. The verdict here outranks any implementer's claim. |
| [`sow.md`](current/sow.md) | Scope, deliverables, delivery status, definition of done, and remaining work. |
| [`tasklist.md`](current/tasklist.md) | The agent-followable build list that implements the SOW. |

The business spec and the acceptance file are two halves of one frozen Gate-1
artifact. Neither may be edited by a design or implementation agent; a wrong
decision returns to grilling and is revised by the intent owner.

Reading order for someone picking the work up: `spec/business-spec.md` ->
`acceptance.md` -> `spec/technical-spec.md` -> `sow.md` -> `tasklist.md`.
The first two are Gate 1. Once re-frozen, `technical-spec.md` alone governs
implementation; the remaining documents are subordinate scope/status aids.

## `archive/`

| Path | Why it is here |
|---|---|
| [`grilling/`](archive/grilling/) | Decision history. `advanced-grilling.md` is the `GA-#` log behind the business spec; `grill-decisions.md` is the foundational `G#` log. Both record *why*, and are still cited. |
| [`foundational/`](archive/foundational/) | The initial product plan, superseded by and folded into `current/spec/product-spec.md`. |
| [`tier-1-design-docs/`](archive/tier-1-design-docs/) | Design of the shipped Tier 1 bootstrap. Shipped, so no longer part of the live pipeline. |
| [`deprecated-tier-taxonomy/`](archive/deprecated-tier-taxonomy/) | The retired Basic / mid / Advanced packaging docs, including the historical MCP configurator design. |
