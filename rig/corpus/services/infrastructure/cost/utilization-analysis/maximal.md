# infrastructure.cost.utilization-analysis — maximal

Measure utilization over a representative window and inspect multiple constrained resources. A single peak does not establish steady-state capacity or an opportunity to reduce it.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: utilization-analysis-source-code-boundary, utilization-analysis-cost-context, utilization-analysis-evidence-receipt.

The maximal policy predicates evaluate the declared configuration fields. Record the result and any observed repository evidence separately; this service does not issue or verify a replayable receipt.

Acceptance target: policy:infrastructure.cost.utilization-analysis:maximal:utilization-analysis-source-code-boundary+utilization-analysis-cost-context+utilization-analysis-evidence-receipt.

Declared predicates: utilization-analysis-source-code-boundary: `observed_resources` is nonempty (a string or array); utilization-analysis-cost-context: `observation_window_days` is numeric and at least 7; utilization-analysis-evidence-receipt: `decide_from_single_peak` equals false.
