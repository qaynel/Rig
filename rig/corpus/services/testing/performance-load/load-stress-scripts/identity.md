# testing.performance-load.load-stress-scripts — identity

Policy grade: load stress scripts owns perf-load-test-authoring, load-stress-scripts. Define the load profile and automatic stop conditions before generating pressure. Stress scripts must target an approved isolated environment instead of defaulting to production.

Keep sibling services in performance-load under their own verdicts. Tie acceptance to the configured input at `rig-services/testing.performance-load.load-stress-scripts.json`; malformed input is still attributed to that path.

Disposition: convention. Read the limit: load stress scripts configuration validation only; declared policy does not prove running load stress scripts behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.performance-load.load-stress-scripts:policy-boundary. Given source-code is present and perf-load-test-authoring is selected, pass only when the repository binding evaluates perf-load-test-authoring and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent performance load concern.

Service-specific evidence cues:
Define the load profile and automatic stop conditions before generating pressure. Stress scripts must target an approved isolated environment instead of defaulting to production.

Owned scope: `perf-load-test-authoring`, `load-stress-scripts`.

Offer: Define the load profile and automatic stop conditions before generating pressure. Stress scripts must target an approved isolated environment instead of defaulting to production.

Input: `rig-services/testing.performance-load.load-stress-scripts.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: load stress scripts configuration validation only; declared policy does not prove running load stress scripts behavior. Select an approved repository-owned command to verify that behavior.

minimal: load profile — "ramp 10 to 100 users".

mid: stop conditions — ["error rate above 5 percent"].

maximal: target production by default — false.
