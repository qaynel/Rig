# Archived — deprecated Basic / mid / Advanced tier taxonomy

**Status: ARCHIVED 2026-07-24 (GA-9g).**

These documents describe the superseded install packaging where Tier 2 was
delivered as fixed climbable packages (**Basic → mid → Advanced**), and where
"Advanced" meant agents/loops/memory.

That packaging is **retired**. The product is now:

1. a **mandatory agent-tech-safety baseline** (sanitation, drift, secret, git/CI
   floors), then
2. a single **à-la-carte catalogue** (`family → group → service → grade`) across
   Development · Testing · Infrastructure · Product-Security.

Active sources of truth:

- Gate 1: [`../../current/spec/business-spec.md`](../../current/spec/business-spec.md)
- Gate 2: [`../../current/spec/technical-spec.md`](../../current/spec/technical-spec.md)
- Operator guide: [`../../../docs/advanced/operator.md`](../../../docs/advanced/operator.md)

The archived `basic/` tree retains the historical MCP-configurator design
(host matrix, secret chain). That *content* survives as the Infrastructure
MCP-config compatibility slice and the legacy Basic CLI; only the **tier
package identity** is dissolved. Do not use these files as the current delivery
model.
