# testing.e2e.cross-environment — maximal

Maximal adds a replayable evidence receipt for cross environment. The evidence must preserve the environments, shared_cases, assume_platform_equivalence inputs that determined the result.

Trace the verdict to a second run against unchanged cross environment inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: cross environment configuration validation only; declared policy does not prove running cross environment behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.e2e.cross-environment:evidence-replay. Given the e2e.cross-environment binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
