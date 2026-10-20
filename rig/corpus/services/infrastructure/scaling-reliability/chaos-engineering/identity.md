# infrastructure.scaling-reliability.chaos-engineering — identity

Policy grade: chaos-engineering owns scaling-reliability.chaos-engineering. Choose faults that test a resilience assumption and define immediate stop conditions. Production chaos requires explicit approval and measured safeguards.

Input: `rig-services/infrastructure.scaling-reliability.chaos-engineering.json`. Configuration validation only, so it confirms fault scenarios, stop conditions and the unapproved-production flag are declared; it does not inject any fault.

Disposition: executable.
Acceptance target: policy:infrastructure.scaling-reliability.chaos-engineering:minimal:chaos-engineering-source-code-boundary.
Declared predicates: chaos-engineering-source-code-boundary: `fault_scenarios` is nonempty (a string or array).
