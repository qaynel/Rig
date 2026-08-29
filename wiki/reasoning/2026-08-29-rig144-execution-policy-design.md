---
date: 2026-08-29
source: agent
topics: policy-model, trust-and-failure-boundaries
decisions: AD-39, GA-38
---

# RIG-144 execution-policy implementation design

The accepted capability requirements need an authority that does not get
regenerated from the catalogue. `.rig/service-bindings.json` is Rig-owned
output, so extending it would let a changed binding request and supply its own
authority in the same generated file. A separate, target-owned
`.rig/execution-policy.json` is the smallest safe shape: it is seeded on
install, retained as user bytes, and only grants take effect when the exact
file is tracked and clean in Git.

Version 1 is deliberately small:

```json
{
  "schema_version": 1,
  "grants": {
    "service.id": {
      "network": "required",
      "timeout_ms": 1200000,
      "memory_limit_mb": 4096
    }
  }
}
```

The key is the existing service ID, which is the stable binding identity in
the generated bindings map. A command may request a smaller-than-default or
default resource ceiling without a grant. A request above the 10-minute / 2
GiB defaults must be no greater than that service's committed grant. An
explicit `network: "required"` needs the same service's exact network grant;
`network: "none"` is a restriction and needs no grant. Omitted network keeps
running only as a distinct `undeclared` compatibility state and emits a
diagnostic. This makes a future default-deny flip a policy change, not a
schema migration.

The shared evaluator belongs in the canonical check-runner module. It returns
either an executable normalized capability record or a named refusal, so a
future interactive one-use grant can call the same evaluator with an
additional authority source rather than reimplementing CI policy. The present
CI path supplies only committed policy; it never prompts and never reads an
environment override. Unknown schema keys, bad types, invalid JSON, a missing
or dirty policy file when elevated capability is requested, and unavailable
resource/network enforcement all fail closed.

The implementation slices are: mandatory timeout/memory wrapping through the
existing watchdog; three-state network wrapping through the existing sandbox
prefix; then the policy evaluator and its install seed. Each slice has a
direct and materialized-runner test. A separate file wins over extending
service bindings because it keeps request and authority independently owned;
an activated network policy file loses because it governs wider safety
controls and its approval lifecycle is not the requested committed CI grant.
