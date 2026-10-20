# testing.performance-load.load-stress-scripts — minimal

Define the load profile and automatic stop conditions before generating pressure. Stress scripts must target an approved isolated environment instead of defaulting to production.

Policy grade, minimal: Define the load profile, such as ramp and peak rate. Without it pressure is arbitrary, so write the shape. Binding checks: load-stress-scripts-source-code-boundary.

Acceptance target: policy:testing.performance-load.load-stress-scripts:minimal:load-stress-scripts-source-code-boundary.
Declared predicates: load-stress-scripts-source-code-boundary: `load_profile` is nonempty (a string or array).
