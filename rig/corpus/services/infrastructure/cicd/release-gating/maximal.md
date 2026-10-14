# infrastructure.cicd.release-gating — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for release gating. The evidence must preserve the required_gates, release_revision, use_stale_gate_results inputs that determined the result. Binding checks: release-gating-evidence-receipt.

Inspect a second run against unchanged release gating inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: release gating configuration validation only; declared policy does not prove running release gating behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.cicd.release-gating:evidence-replay. Given the cicd.release-gating binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Bind release gates to the revision and artifact that will ship. Earlier green results do not authorize a different commit or rebuilt artifact.

Owned scope: `cicd.release-gating`.

Offer: Bind release gates to the revision and artifact that will ship. Earlier green results do not authorize a different commit or rebuilt artifact.

Input: `rig-services/infrastructure.cicd.release-gating.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: release gating configuration validation only; declared policy does not prove running release gating behavior. Select an approved repository-owned command to verify that behavior.

minimal: required gates — ["tests","artifact digest"].

mid: release revision — "a1b2c3d".

maximal: use stale gate results — false.
