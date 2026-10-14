# testing.regression.suite-curation — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for suite curation. The evidence must preserve the retained_suites, retirement_reasons, remove_without_behavior_owner inputs that determined the result. Binding checks: suite-curation-evidence-receipt.

Trace the verdict to a second run against unchanged suite curation inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: suite curation configuration validation only; declared policy does not prove running suite curation behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.regression.suite-curation:evidence-replay. Given the regression.suite-curation binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Keep the regressions that protect live behavior and give obsolete tests a written retirement reason. Removing a slow test without identifying its behavior owner can silently reopen a defect.

Owned scope: `regression.suite-curation`.

Offer: Keep the regressions that protect live behavior and give obsolete tests a written retirement reason. Removing a slow test without identifying its behavior owner can silently reopen a defect.

Input: `rig-services/testing.regression.suite-curation.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: suite curation configuration validation only; declared policy does not prove running suite curation behavior. Select an approved repository-owned command to verify that behavior.

minimal: retained suites — ["critical regression"].

mid: retirement reasons — ["obsolete API removed"].

maximal: remove without behavior owner — false.
