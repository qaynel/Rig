# infrastructure.scaling-reliability.chaos-engineering — minimal

Choose faults that test a resilience assumption and define immediate stop conditions. Production chaos requires explicit approval and measured safeguards.

Policy grade, minimal: List the faults that test a resilience assumption. Random breakage teaches nothing, so name each scenario and what it checks. Binding checks: chaos-engineering-source-code-boundary.

Acceptance target: policy:infrastructure.scaling-reliability.chaos-engineering:minimal:chaos-engineering-source-code-boundary.
Declared predicates: chaos-engineering-source-code-boundary: `fault_scenarios` is nonempty (a string or array).
