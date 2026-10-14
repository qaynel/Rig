# product-security.red-team.adversarial-simulation — floor and mutation-floor slice

Policy grade slice. This slice bounds adversarial simulation to red-team.adversarial-simulation. It uses `adversarial-simulation-slice-floor` and checks attack_scenarios (nonempty): attack scenarios must name the concrete repository contract..

Tie acceptance to a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/product-security.red-team.adversarial-simulation.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than adversarial simulation configuration validation only; declared policy does not prove running adversarial simulation behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Simulate threats in a contained environment with declared scenarios. Customer records and unapproved production targets do not belong in adversarial experiments.

Owned scope: `red-team.adversarial-simulation`.

Offer: Simulate threats in a contained environment with declared scenarios. Customer records and unapproved production targets do not belong in adversarial experiments.

Input: `rig-services/product-security.red-team.adversarial-simulation.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: adversarial simulation configuration validation only; declared policy does not prove running adversarial simulation behavior. Select an approved repository-owned command to verify that behavior.

minimal: attack scenarios — ["malformed token"].

mid: containment scope — "isolated test deployment".

maximal: use real customer data — false.
