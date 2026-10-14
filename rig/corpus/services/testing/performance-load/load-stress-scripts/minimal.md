# testing.performance-load.load-stress-scripts — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for load stress scripts. It checks load_profile (nonempty): load profile must name the concrete repository contract.. Binding checks: load-stress-scripts-source-code-boundary.

Ground the decision in a repository-owned command or existing native check that can observe perf-load-test-authoring, load-stress-scripts; bind it to the input named in `rig-services/testing.performance-load.load-stress-scripts.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside perf-load-test-authoring, load-stress-scripts is a failure.

Acceptance target: fixture:testing.performance-load.load-stress-scripts:policy-boundary. Given source-code is present and perf-load-test-authoring is selected, pass only when the repository binding evaluates perf-load-test-authoring and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent performance load concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Define the load profile and automatic stop conditions before generating pressure. Stress scripts must target an approved isolated environment instead of defaulting to production.

Owned scope: `perf-load-test-authoring`, `load-stress-scripts`.

Offer: Define the load profile and automatic stop conditions before generating pressure. Stress scripts must target an approved isolated environment instead of defaulting to production.

Input: `rig-services/testing.performance-load.load-stress-scripts.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: load stress scripts configuration validation only; declared policy does not prove running load stress scripts behavior. Select an approved repository-owned command to verify that behavior.

minimal: load profile — "ramp 10 to 100 users".

mid: stop conditions — ["error rate above 5 percent"].

maximal: target production by default — false.
