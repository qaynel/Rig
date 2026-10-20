# testing.performance-load.load-stress-scripts — identity

Policy grade: load stress scripts owns perf-load-test-authoring, load-stress-scripts. Define the load profile and automatic stop conditions before generating pressure. Stress scripts must target an approved isolated environment instead of defaulting to production.

Keep neighboring performance-load services outside the load stress scripts decision for perf-load-test-authoring, load-stress-scripts. Tie acceptance to the configured input at `rig-services/testing.performance-load.load-stress-scripts.json`; malformed input is still attributed to that path.

Disposition: executable. Read the limit: load stress scripts configuration validation only; declared policy does not prove running load stress scripts behavior. Choose a repository-owned check that observes load stress scripts from rig-services/testing.performance-load.load-stress-scripts.json.

Acceptance target: policy:testing.performance-load.load-stress-scripts:minimal:load-stress-scripts-source-code-boundary.

Declared predicates: load-stress-scripts-source-code-boundary: `load_profile` is nonempty (a string or array).
