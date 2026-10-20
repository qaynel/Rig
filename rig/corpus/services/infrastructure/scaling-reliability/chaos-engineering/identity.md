# infrastructure.scaling-reliability.chaos-engineering — identity

Policy grade: chaos engineering owns scaling-reliability.chaos-engineering. Choose faults that test a resilience assumption and define immediate stop conditions. Production chaos requires explicit approval and measured safeguards.

Keep neighboring scaling-reliability services outside the chaos engineering decision for scaling-reliability.chaos-engineering. Start from the configured input at `rig-services/infrastructure.scaling-reliability.chaos-engineering.json`; malformed input is still attributed to that path.

Disposition: executable. Trace the verdict to the limit: chaos engineering configuration validation only; declared policy does not prove running chaos engineering behavior. Choose a repository-owned check that observes chaos engineering from rig-services/infrastructure.scaling-reliability.chaos-engineering.json.

Acceptance target: policy:infrastructure.scaling-reliability.chaos-engineering:minimal:chaos-engineering-source-code-boundary.

Declared predicates: chaos-engineering-source-code-boundary: `fault_scenarios` is nonempty (a string or array).
