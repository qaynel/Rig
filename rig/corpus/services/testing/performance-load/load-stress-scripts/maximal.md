# testing.performance-load.load-stress-scripts — maximal

Maximal adds a replayable evidence receipt for load stress scripts. The evidence must preserve the load_profile, stop_conditions, target_production_by_default inputs that determined the result.

Start from a second run against unchanged load stress scripts inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: load stress scripts configuration validation only; declared policy does not prove running load stress scripts behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.performance-load.load-stress-scripts:evidence-replay. Given the perf-load-test-authoring binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
