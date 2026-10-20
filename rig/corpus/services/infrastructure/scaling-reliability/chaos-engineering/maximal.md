# infrastructure.scaling-reliability.chaos-engineering — maximal

Choose faults that test a resilience assumption and define immediate stop conditions. Production chaos requires explicit approval and measured safeguards.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: chaos-engineering-source-code-boundary, chaos-engineering-scaling-reliability-context, chaos-engineering-evidence-receipt.

The maximal policy predicates evaluate the declared configuration fields. Record the result and any observed repository evidence separately; this service does not issue or verify a replayable receipt.

Acceptance target: policy:infrastructure.scaling-reliability.chaos-engineering:maximal:chaos-engineering-source-code-boundary+chaos-engineering-scaling-reliability-context+chaos-engineering-evidence-receipt.

Declared predicates: chaos-engineering-source-code-boundary: `fault_scenarios` is nonempty (a string or array); chaos-engineering-scaling-reliability-context: `stop_conditions` is nonempty (a string or array); chaos-engineering-evidence-receipt: `production_experiment_without_approval` equals false.
