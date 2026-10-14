# testing.strategy.coverage-gap — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for coverage gap. The evidence must preserve the uncovered_behaviors, risk_owners, claim_complete_from_line_coverage inputs that determined the result. Binding checks: coverage-gap-evidence-receipt.

Anchor the review on a second run against unchanged coverage gap inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: coverage gap configuration validation only; declared policy does not prove running coverage gap behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.strategy.coverage-gap:evidence-replay. Given the strategy.coverage-gap binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Map untested behavior to business risk and owners. Line coverage can locate unused paths, but it does not prove that important outcomes are asserted.

Owned scope: `strategy.coverage-gap`.

Offer: Map untested behavior to business risk and owners. Line coverage can locate unused paths, but it does not prove that important outcomes are asserted.

Input: `rig-services/testing.strategy.coverage-gap.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: coverage gap configuration validation only; declared policy does not prove running coverage gap behavior. Select an approved repository-owned command to verify that behavior.

minimal: uncovered behaviors — ["expired token"].

mid: risk owners — ["auth team"].

maximal: claim complete from line coverage — false.
