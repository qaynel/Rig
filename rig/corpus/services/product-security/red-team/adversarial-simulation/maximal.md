# product-security.red-team.adversarial-simulation — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for adversarial simulation. The evidence must preserve the attack_scenarios, containment_scope, use_real_customer_data inputs that determined the result. Binding checks: adversarial-simulation-evidence-receipt.

Trace the verdict to a second run against unchanged adversarial simulation inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: adversarial simulation configuration validation only; declared policy does not prove running adversarial simulation behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:product-security.red-team.adversarial-simulation:evidence-replay. Given the red-team.adversarial-simulation binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Simulate threats in a contained environment with declared scenarios. Customer records and unapproved production targets do not belong in adversarial experiments.

Owned scope: `red-team.adversarial-simulation`.

Offer: Simulate threats in a contained environment with declared scenarios. Customer records and unapproved production targets do not belong in adversarial experiments.

Input: `rig-services/product-security.red-team.adversarial-simulation.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: adversarial simulation configuration validation only; declared policy does not prove running adversarial simulation behavior. Select an approved repository-owned command to verify that behavior.

minimal: attack scenarios — ["malformed token"].

mid: containment scope — "isolated test deployment".

maximal: use real customer data — false.
