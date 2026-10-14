# product-security.red-team.adversarial-simulation — behavior-oracle slice

This slice bounds adversarial simulation to red-team.adversarial-simulation. It uses `adversarial-simulation-slice-behavior-oracle` and checks attack_scenarios (nonempty): attack scenarios must name the concrete repository contract..

Inspect a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/product-security.red-team.adversarial-simulation.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than adversarial simulation configuration validation only; declared policy does not prove running adversarial simulation behavior. Select an approved repository-owned command to verify that behavior.
