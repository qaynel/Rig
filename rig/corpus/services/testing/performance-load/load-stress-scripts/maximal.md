# testing.performance-load.load-stress-scripts — maximal

Define the load profile and automatic stop conditions before generating pressure. Stress scripts must target an approved isolated environment instead of defaulting to production.

Policy grade, maximal: Set targeting production by default to false. Stress scripts must aim at an approved isolated environment, so require an explicit target. Cumulative with minimal and mid. Binding checks: load-stress-scripts-source-code-boundary, load-stress-scripts-performance-load-context, load-stress-scripts-evidence-receipt.

Acceptance target: policy:testing.performance-load.load-stress-scripts:maximal:load-stress-scripts-source-code-boundary+load-stress-scripts-performance-load-context+load-stress-scripts-evidence-receipt.
Declared predicates: load-stress-scripts-source-code-boundary: `load_profile` is nonempty (a string or array); load-stress-scripts-performance-load-context: `stop_conditions` is nonempty (a string or array); load-stress-scripts-evidence-receipt: `target_production_by_default` equals false.
