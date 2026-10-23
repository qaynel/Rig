# testing.performance-load.load-stress-scripts — mid

Define the load profile and automatic stop conditions before generating pressure. Stress scripts must target an approved isolated environment instead of defaulting to production.

Policy grade, mid: Define the stop conditions that end the test automatically. An unbounded stress run can damage an environment, so write the abort limits. Cumulative with minimal. Binding checks: load-stress-scripts-source-code-boundary, load-stress-scripts-performance-load-context.

Acceptance target: policy:testing.performance-load.load-stress-scripts:mid:load-stress-scripts-source-code-boundary+load-stress-scripts-performance-load-context.
Declared predicates: load-stress-scripts-source-code-boundary: `load_profile` is nonempty (a string or array); load-stress-scripts-performance-load-context: `stop_conditions` is nonempty (a string or array).
