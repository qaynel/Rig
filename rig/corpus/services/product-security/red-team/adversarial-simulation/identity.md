# product-security.red-team.adversarial-simulation — identity

Policy grade: adversarial simulation owns red-team.adversarial-simulation. Simulate threats in a contained environment with declared scenarios. Customer records and unapproved production targets do not belong in adversarial experiments.

Keep neighboring red-team services outside the adversarial simulation decision for red-team.adversarial-simulation. Read the configured input at `rig-services/product-security.red-team.adversarial-simulation.json`; malformed input is still attributed to that path.

Disposition: convention. Ground the decision in the limit: adversarial simulation configuration validation only; declared policy does not prove running adversarial simulation behavior. Choose a repository-owned check that observes adversarial simulation from rig-services/product-security.red-team.adversarial-simulation.json.

Acceptance target: fixture:product-security.red-team.adversarial-simulation:policy-boundary. Given source-code is present and red-team.adversarial-simulation is selected, pass only when the repository binding evaluates red-team.adversarial-simulation and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent red team concern.

Service-specific evidence cues:
Offer: Simulate threats in a contained environment with declared scenarios. Customer records and unapproved production targets do not belong in adversarial experiments.
minimal: attack scenarios — ["malformed token"].
mid: containment scope — "isolated test deployment".
maximal: use real customer data — false.
