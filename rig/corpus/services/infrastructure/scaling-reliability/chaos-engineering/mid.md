# infrastructure.scaling-reliability.chaos-engineering — mid

Choose faults that test a resilience assumption and define immediate stop conditions. Production chaos requires explicit approval and measured safeguards.

Policy grade, mid: Define the conditions that stop the experiment immediately. Without them a fault can run away, so write the abort criteria. Cumulative with minimal. Binding checks: chaos-engineering-source-code-boundary, chaos-engineering-scaling-reliability-context.

Acceptance target: policy:infrastructure.scaling-reliability.chaos-engineering:mid:chaos-engineering-source-code-boundary+chaos-engineering-scaling-reliability-context.
Declared predicates: chaos-engineering-source-code-boundary: `fault_scenarios` is nonempty (a string or array); chaos-engineering-scaling-reliability-context: `stop_conditions` is nonempty (a string or array).
