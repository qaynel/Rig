# product-security.red-team.adversarial-simulation — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for adversarial simulation. The evidence must preserve the attack_scenarios, containment_scope, use_real_customer_data inputs that determined the result. Binding checks: adversarial-simulation-evidence-receipt.

Trace the verdict to a second run against unchanged adversarial simulation inputs. Record the attack_scenarios, containment_scope, use_real_customer_data inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this adversarial simulation result is stale. The ceiling remains: adversarial simulation configuration validation only; declared policy does not prove running adversarial simulation behavior. Choose a repository-owned check that observes adversarial simulation from rig-services/product-security.red-team.adversarial-simulation.json.

Acceptance target: fixture:product-security.red-team.adversarial-simulation:evidence-replay. Given the red-team.adversarial-simulation binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Simulate threats in a contained environment with declared scenarios. Customer records and unapproved production targets do not belong in adversarial experiments.
minimal: attack scenarios — ["malformed token"].
mid: containment scope — "isolated test deployment".
maximal: use real customer data — false.
