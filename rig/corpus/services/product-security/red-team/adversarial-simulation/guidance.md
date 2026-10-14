# adversarial simulation

Simulate threats in a contained environment with declared scenarios. Customer records and unapproved production targets do not belong in adversarial experiments.

Owned scope: `red-team.adversarial-simulation`.

Offer: Simulate threats in a contained environment with declared scenarios. Customer records and unapproved production targets do not belong in adversarial experiments.

Input: `rig-services/product-security.red-team.adversarial-simulation.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: adversarial simulation configuration validation only; declared policy does not prove running adversarial simulation behavior. Select an approved repository-owned command to verify that behavior.

minimal: attack scenarios — ["malformed token"].

mid: containment scope — "isolated test deployment".

maximal: use real customer data — false.

