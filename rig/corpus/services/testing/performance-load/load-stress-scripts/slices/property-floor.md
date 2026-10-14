# testing.performance-load.load-stress-scripts — property-floor slice

Policy grade slice. This slice bounds load stress scripts to perf-load-test-authoring, load-stress-scripts. It uses `load-stress-scripts-slice-property-floor` and checks load_profile (nonempty): load profile must name the concrete repository contract..

Anchor the review on a concrete repository example that would pass this property-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.performance-load.load-stress-scripts.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than load stress scripts configuration validation only; declared policy does not prove running load stress scripts behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Define the load profile and automatic stop conditions before generating pressure. Stress scripts must target an approved isolated environment instead of defaulting to production.

Owned scope: `perf-load-test-authoring`, `load-stress-scripts`.

Offer: Define the load profile and automatic stop conditions before generating pressure. Stress scripts must target an approved isolated environment instead of defaulting to production.

Input: `rig-services/testing.performance-load.load-stress-scripts.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: load stress scripts configuration validation only; declared policy does not prove running load stress scripts behavior. Select an approved repository-owned command to verify that behavior.

minimal: load profile — "ramp 10 to 100 users".

mid: stop conditions — ["error rate above 5 percent"].

maximal: target production by default — false.
