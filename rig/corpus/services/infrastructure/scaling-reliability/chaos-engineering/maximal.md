# infrastructure.scaling-reliability.chaos-engineering — maximal

Choose faults that test a resilience assumption and define immediate stop conditions. Production chaos requires explicit approval and measured safeguards.

Policy grade, maximal: Set production experiments without approval to false. Production chaos needs explicit sign-off and safeguards, so obtain it first. Cumulative with minimal and mid. Binding checks: chaos-engineering-source-code-boundary, chaos-engineering-scaling-reliability-context, chaos-engineering-evidence-receipt.

Acceptance target: policy:infrastructure.scaling-reliability.chaos-engineering:maximal:chaos-engineering-source-code-boundary+chaos-engineering-scaling-reliability-context+chaos-engineering-evidence-receipt.
Declared predicates: chaos-engineering-source-code-boundary: `fault_scenarios` is nonempty (a string or array); chaos-engineering-scaling-reliability-context: `stop_conditions` is nonempty (a string or array); chaos-engineering-evidence-receipt: `production_experiment_without_approval` equals false.
