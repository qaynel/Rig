# load stress scripts

Define the load profile and automatic stop conditions before generating pressure. Stress scripts must target an approved isolated environment instead of defaulting to production.

Owned scope: `perf-load-test-authoring`, `load-stress-scripts`.

Offer: Define the load profile and automatic stop conditions before generating pressure. Stress scripts must target an approved isolated environment instead of defaulting to production.

Input: `rig-services/testing.performance-load.load-stress-scripts.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: load stress scripts configuration validation only; declared policy does not prove running load stress scripts behavior. Select an approved repository-owned command to verify that behavior.

minimal: load profile — "ramp 10 to 100 users".

mid: stop conditions — ["error rate above 5 percent"].

maximal: target production by default — false.

