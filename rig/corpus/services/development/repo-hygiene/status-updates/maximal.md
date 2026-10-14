# development.repo-hygiene.status-updates — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for status updates. The evidence must preserve the completed, in_flight, next_action inputs that determined the result. Binding checks: status-updates-evidence-receipt.

Anchor the review on a second run against unchanged status updates inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: status updates configuration validation only; declared policy does not prove running status updates behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.repo-hygiene.status-updates:evidence-replay. Given the repo-hygiene.status-updates binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Report observed progress, the work in flight and the next resolving action. Distinguish finished evidence from intended work so another contributor can resume accurately.

Owned scope: `repo-hygiene.status-updates`.

Offer: Report observed progress, the work in flight and the next resolving action. Distinguish finished evidence from intended work so another contributor can resume accurately.

Input: `rig-services/development.repo-hygiene.status-updates.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: status updates configuration validation only; declared policy does not prove running status updates behavior. Select an approved repository-owned command to verify that behavior.

minimal: completed — ["parser regression reproduced"].

mid: in flight — ["shared boundary fix"].

maximal: next action — "run parser regression".
