# testing.performance-load.load-stress-scripts — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for load stress scripts. The evidence must preserve the load_profile, stop_conditions, target_production_by_default inputs that determined the result. Binding checks: load-stress-scripts-evidence-receipt.

Start from a second run against unchanged load stress scripts inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: load stress scripts configuration validation only; declared policy does not prove running load stress scripts behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.performance-load.load-stress-scripts:evidence-replay. Given the perf-load-test-authoring binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Define the load profile and automatic stop conditions before generating pressure. Stress scripts must target an approved isolated environment instead of defaulting to production.

Owned scope: `perf-load-test-authoring`, `load-stress-scripts`.

Offer: Define the load profile and automatic stop conditions before generating pressure. Stress scripts must target an approved isolated environment instead of defaulting to production.

Input: `rig-services/testing.performance-load.load-stress-scripts.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: load stress scripts configuration validation only; declared policy does not prove running load stress scripts behavior. Select an approved repository-owned command to verify that behavior.

minimal: load profile — "ramp 10 to 100 users".

mid: stop conditions — ["error rate above 5 percent"].

maximal: target production by default — false.
