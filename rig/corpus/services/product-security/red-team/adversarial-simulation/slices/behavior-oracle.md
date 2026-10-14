# product-security.red-team.adversarial-simulation — behavior-oracle slice

Policy grade slice. This slice bounds adversarial simulation to red-team.adversarial-simulation. It uses `adversarial-simulation-slice-behavior-oracle` and checks attack_scenarios (nonempty): attack scenarios must name the concrete repository contract..

For adversarial simulation, choose a repository example that satisfies attack_scenarios at the behavior-oracle floor, plus a failure where attack scenarios must name the concrete repository contract. is false. For adversarial simulation, wire `behavior-oracle` to `rig-services/product-security.red-team.adversarial-simulation.json` and keep its verdict on attack_scenarios; missing evidence is a named gap, with ceiling adversarial simulation configuration validation only; declared policy does not prove running adversarial simulation behavior. Choose a repository-owned check that observes adversarial simulation from rig-services/product-security.red-team.adversarial-simulation.json..

Service-specific evidence cues:
Offer: Simulate threats in a contained environment with declared scenarios. Customer records and unapproved production targets do not belong in adversarial experiments.
minimal: attack scenarios — ["malformed token"].
mid: containment scope — "isolated test deployment".
maximal: use real customer data — false.
