# testing.performance-load.load-stress-scripts — maximal

Define the load profile and automatic stop conditions before generating pressure. Stress scripts must target an approved isolated environment instead of defaulting to production.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: load-stress-scripts-source-code-boundary, load-stress-scripts-performance-load-context, load-stress-scripts-evidence-receipt.

The maximal policy predicates evaluate the declared configuration fields. Record the result and any observed repository evidence separately; this service does not issue or verify a replayable receipt.

Acceptance target: policy:testing.performance-load.load-stress-scripts:maximal:load-stress-scripts-source-code-boundary+load-stress-scripts-performance-load-context+load-stress-scripts-evidence-receipt.

Declared predicates: load-stress-scripts-source-code-boundary: `load_profile` is nonempty (a string or array); load-stress-scripts-performance-load-context: `stop_conditions` is nonempty (a string or array); load-stress-scripts-evidence-receipt: `target_production_by_default` equals false.
