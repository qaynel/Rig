# testing.performance-load.load-stress-scripts — minimal

Define the load profile and automatic stop conditions before generating pressure. Stress scripts must target an approved isolated environment instead of defaulting to production.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for load stress scripts. The minimal boundary for load stress scripts checks load_profile (nonempty): load profile must name the concrete repository contract. Binding checks: load-stress-scripts-source-code-boundary.

Ground the decision in a repository-owned command or existing native check that can observe perf-load-test-authoring, load-stress-scripts; bind it to the input named in `rig-services/testing.performance-load.load-stress-scripts.json` and preserve the check's failure status. When adopting this in an existing repository, connect load stress scripts to the command that inspects load_profile and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside perf-load-test-authoring, load-stress-scripts as a failure.

Acceptance target: policy:testing.performance-load.load-stress-scripts:minimal:load-stress-scripts-source-code-boundary.

Declared predicates: load-stress-scripts-source-code-boundary: `load_profile` is nonempty (a string or array).
