# testing.performance-load.load-stress-scripts — mid

Define the load profile and automatic stop conditions before generating pressure. Stress scripts must target an approved isolated environment instead of defaulting to production.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: load-stress-scripts-source-code-boundary, load-stress-scripts-performance-load-context.

Acceptance target: policy:testing.performance-load.load-stress-scripts:mid:load-stress-scripts-source-code-boundary+load-stress-scripts-performance-load-context.

Declared predicates: load-stress-scripts-source-code-boundary: `load_profile` is nonempty (a string or array); load-stress-scripts-performance-load-context: `stop_conditions` is nonempty (a string or array).
