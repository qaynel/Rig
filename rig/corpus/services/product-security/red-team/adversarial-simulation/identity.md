# product-security.red-team.adversarial-simulation — identity

adversarial simulation owns red-team.adversarial-simulation. Simulate threats in a contained environment with declared scenarios. Customer records and unapproved production targets do not belong in adversarial experiments.

Keep sibling services in red-team under their own verdicts. Read the configured input at `rig-services/product-security.red-team.adversarial-simulation.json`; malformed input is still attributed to that path.

Disposition: convention. Ground the decision in the limit: adversarial simulation configuration validation only; declared policy does not prove running adversarial simulation behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:product-security.red-team.adversarial-simulation:policy-boundary. Given source-code is present and red-team.adversarial-simulation is selected, pass only when the repository binding evaluates red-team.adversarial-simulation and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent red team concern.
