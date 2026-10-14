# testing.performance-load.load-stress-scripts — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for load stress scripts. The evidence must preserve the load_profile, stop_conditions, target_production_by_default inputs that determined the result. Binding checks: load-stress-scripts-evidence-receipt.

Start from a second run against unchanged load stress scripts inputs. Record the load_profile, stop_conditions, target_production_by_default inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this load stress scripts result is stale. The ceiling remains: load stress scripts configuration validation only; declared policy does not prove running load stress scripts behavior. Choose a repository-owned check that observes load stress scripts from rig-services/testing.performance-load.load-stress-scripts.json.

Acceptance target: fixture:testing.performance-load.load-stress-scripts:evidence-replay. Given the perf-load-test-authoring binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Define the load profile and automatic stop conditions before generating pressure. Stress scripts must target an approved isolated environment instead of defaulting to production.
minimal: load profile — "ramp 10 to 100 users".
mid: stop conditions — ["error rate above 5 percent"].
maximal: target production by default — false.
