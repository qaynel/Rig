# testing.regression.suite-curation — maximal

Maximal adds a replayable evidence receipt for suite curation. The evidence must preserve the retained_suites, retirement_reasons, remove_without_behavior_owner inputs that determined the result.

Trace the verdict to a second run against unchanged suite curation inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: suite curation configuration validation only; declared policy does not prove running suite curation behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.regression.suite-curation:evidence-replay. Given the regression.suite-curation binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
