# product-security.red-team.dast — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for dast. The evidence must preserve the target_origin, authorized_scope, scan_unapproved_targets inputs that determined the result. Binding checks: dast-evidence-receipt.

Ground the decision in a second run against unchanged dast inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: dast configuration validation only; declared policy does not prove running dast behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:product-security.red-team.dast:evidence-replay. Given the red-team.dast binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Dynamic security testing needs a specifically authorized target and path scope. A declared target does not prove a live scan; missing scanner or credentials must remain visible.

Owned scope: `red-team.dast`.

Offer: Dynamic security testing needs a specifically authorized target and path scope. A declared target does not prove a live scan; missing scanner or credentials must remain visible.

Input: `rig-services/product-security.red-team.dast.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: dast configuration validation only; declared policy does not prove running dast behavior. Select an approved repository-owned command to verify that behavior.

minimal: target origin — "http://127.0.0.1:8080".

mid: authorized scope — ["/api"].

maximal: scan unapproved targets — false.
