# testing.performance-load.load-stress-scripts — identity

Policy grade: load-stress-scripts owns perf-load-test-authoring, load-stress-scripts. Define the load profile and automatic stop conditions before generating pressure. Stress scripts must target an approved isolated environment instead of defaulting to production.

Input: `rig-services/testing.performance-load.load-stress-scripts.json`. Configuration validation only, so it confirms a load profile, stop conditions and the production-default flag are declared; it does not generate load.

Disposition: executable.
Acceptance target: policy:testing.performance-load.load-stress-scripts:minimal:load-stress-scripts-source-code-boundary.
Declared predicates: load-stress-scripts-source-code-boundary: `load_profile` is nonempty (a string or array).
