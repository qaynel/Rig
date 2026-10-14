# infrastructure.disaster-recovery.rto-rpo — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for rto rpo. The evidence must preserve the rto_minutes, rpo_minutes, claim_targets_without_exercise inputs that determined the result. Binding checks: rto-rpo-evidence-receipt.

Anchor the review on a second run against unchanged rto rpo inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: rto rpo configuration validation only; declared policy does not prove running rto rpo behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.disaster-recovery.rto-rpo:evidence-replay. Given the disaster-recovery.rto-rpo binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
State recovery-time and data-loss objectives as measurable limits. Targets become demonstrated assurance only when an actual recovery exercise measures them.

Owned scope: `disaster-recovery.rto-rpo`.

Offer: State recovery-time and data-loss objectives as measurable limits. Targets become demonstrated assurance only when an actual recovery exercise measures them.

Input: `rig-services/infrastructure.disaster-recovery.rto-rpo.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: rto rpo configuration validation only; declared policy does not prove running rto rpo behavior. Select an approved repository-owned command to verify that behavior.

minimal: rto minutes — 30.

mid: rpo minutes — 5.

maximal: claim targets without exercise — false.
